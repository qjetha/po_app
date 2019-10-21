import pandas as pd
import psycopg2
import numpy as np

conn = psycopg2.connect(host="ec2-174-129-227-146.compute-1.amazonaws.com", database='dfo8bn6dvo5jif',
                        user='jisphegcimejgv', password='435b93240b5aaedf25a444585d9fa1ed5fc1ff7eeb2f28f20d62377865e11c3f')

cursor = conn.cursor()

cursor.execute('SELECT * FROM po_data')

df = pd.DataFrame(cursor.fetchall())
df.set_index(0, inplace=True)

for x in df.columns:
   df[x].replace(777, np.nan, inplace=True)
   df[x].replace('', np.nan, inplace=True)
   df[x].replace('777', np.nan, inplace=True)

df.columns = ['noticed_mural', 'heard_gtt', 'gtt_importance', 'mural_uncomfortable',	
             'enjoy_mural',	 'history_fairly', 'welcome_public', 'mural_offensive',	
             'mural_effective',	'mural_unwelcome', 'mural_accuracy', 'mural_represent_today', 	
             'med_years', 'med_residence', 'race', 'age', 'gender', 'visit_po']

# Generate White, < 45, Missing = np.nan
df['white'] = np.where(df.race=="White", True, False)
df['white'] = np.where(df['race']=="Other/Missing", None, df['white'])

# Generate Less than 45, Missing = np.nan
df['less45'] = df.age.isin(['19 or younger', '36-45 years', '26-35 years', '20-25 years'])
df['less45'] = np.where(df['age'].isna(), None, df['less45'])

# Convert Heard GTT into Boolean
d = {'1':True, '0':False}
df['heard_gtt'] = df['heard_gtt'].map(d)

# # Add Series to po_data table
cursor.execute("ALTER TABLE po_data ADD COLUMN white boolean;")
cursor.execute("ALTER TABLE po_data ADD COLUMN less45 boolean;")
conn.commit()

# Populate new series. 
for index, row in df.iterrows():
    cursor.execute("""UPDATE po_data
               SET white = %s
               WHERE id = %s""", (row['white'], index))
    conn.commit()
   
    cursor.execute("""UPDATE po_data
           SET less45 = %s
           WHERE id = %s""", (row['less45'], index))
    conn.commit()

    cursor.execute('''UPDATE po_data
                SET heard_gtt = %s
                WHERE id = %s''', (row['heard_gtt'], index))
    conn.commit()

