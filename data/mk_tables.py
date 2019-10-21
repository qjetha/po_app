import csv
import os

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

# Set up database
engine = create_engine(os.getenv("DATABASE_URL"))
db = scoped_session(sessionmaker(bind=engine))


''' Using Raw SQL Commands in SQL Alchemy to Create Tables'''

# Table 1 = Create Table
db.execute("DROP TABLE IF EXISTS po_data")

db.execute('''CREATE TABLE po_data (
	id NUMERIC,
	noticed_mural NUMERIC,
	heard_GTT NUMERIC,
	GTT_importance NUMERIC,
	mural_uncomfortable NUMERIC,
	enjoy_mural TEXT,
	history_fairly TEXT,
	welcome_public TEXT,
	mural_offensive TEXT,
	mural_effective TEXT,
	mural_unwelcome TEXT,
	mural_accuracy TEXT,
	mural_represent_today TEXT,
	med_years NUMERIC,
	med_residence TEXT,
	race TEXT,
	age TEXT,
	gender TEXT,
	visit_PO TEXT)''')


# # Populate Table With Data from CSV Input
with open('data/po_data_clean.csv') as file:
	reader = csv.reader(file)

	for line in reader:
		
		if line[0]=="ID":
			continue

		db.execute('''INSERT INTO po_data (id, noticed_mural, heard_GTT,
			GTT_importance, mural_uncomfortable, enjoy_mural, history_fairly,
			welcome_public, mural_offensive, mural_effective, mural_unwelcome,
			mural_accuracy, mural_represent_today, med_years, med_residence,
			race, age, gender, visit_PO) 
			VALUES (:id, :noticed_mural, :heard_GTT, :GTT_importance, :mural_uncomfortable,
			 :enjoy_mural, :history_fairly, :welcome_public, :mural_offensive, 
			 :mural_effective, :mural_unwelcome, :mural_accuracy, :mural_represent_today,
			 :med_years, :med_residence, :race, :age, :gender, :visit_PO)''',
			{"id": line[0], "noticed_mural": line[1], "heard_GTT": line[2], \
			"GTT_importance": line[3], "mural_uncomfortable": line[4], "enjoy_mural": line[5], \
			"history_fairly": line[6], "welcome_public": line[7], "mural_offensive": line[8], \
			"mural_effective": line[9], "mural_unwelcome": line[10], "mural_accuracy": line[11], \
			"mural_represent_today": line[12], "med_years": line[13], "med_residence": line[14], \
			"race": line[15], "age": line[16], "gender": line[17], "visit_PO": line[18]})

	db.commit()

