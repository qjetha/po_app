import os, requests, re, psycopg2, json
import pandas as pd
import numpy as np

from flask import Flask, render_template, request, jsonify, url_for

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Set up database
conn = psycopg2.connect(os.environ.get("DATABASE_URL"))
cursor = conn.cursor()

# Define Question List & Response Options Dictionaries
q_list = {
	'Important to learn about Golden Triangle of Trade': ['GTT_importance', 
	'I believe it is important to learn about Medford\'s history with respect to slavery and the Golden Triangle of Trade.'],
	'Feel uncomfortable looking at the mural': ['mural_uncomfortable',
	'I feel uncomfortable when I look at this mural.'],
	'Enjoy looking at the mural': ['enjoy_mural',
	'I enjoy looking at this mural when I visit the Post Office.'],
	'Important for history to be represented fairly': ['history_fairly',
	'It is important for Medford\'s history to be represented fairly and accurately in public places such as the Post Office.'],
	'Important for residents to feel welcome': ['welcome_public',
	'It is important that all Medford residents feel welcome in public places such as the Post Office.'],
	'Find the mural offensive': ['mural_offensive', 'I find the mural offensive.'],
	'Mural effective in teaching history': ['mural_effective',
	'I believe the Post Office mural is effective in teaching about Medford’s history with respect to slavery and the Golden Triangle of Trade.'],
	'Feel unwelcome looking at mural': ['mural_unwelcome', 'I feel unwelcome when I look at this mural.'],
	'I believe the mural accurately depicts of Medford\'s history': ['mural_accuracy', 'I believe the mural accurately depicts Medford\'s history.'],
	'I believe the mural accurately depicts Medford today': ['mural_represent_today', 'I believe the mural accurately depicts Medford today.']
}

labels_string = {'1': "strongly agree", '2': "agree", '3': "neutral", '4': "disagree", '5': "strongly disagree"}


# Set Single Flask Route (index)
@app.route('/', methods=['GET', 'POST'])
def index():

	if request.method=='GET':
		return render_template("viz.html", q_list=q_list.keys())

	else:

		# Get Post Data
		series = request.form['series']
		survey_q = q_list[series][0]
		outcome = request.form['outcome']
		subgroup = request.form['subgroup']

		# Define stat_by_col function for the 4 variations of graphs
		def stat_by_col(col, outcome='all', subgroup='none'):
			'''
			Subgroups = (a) White; (b) less 45; (c) noticed mural; (d) heard GTT
			4 Graph Variations: (1) No proportion agreed, no subgroup
								(2) Proportion agreed, no subgroup
								(3) No proportion agreed, subgroup
								(4) Proportion agreed, subgroup
			'''
			
			# Get Data if Request contains no subgroup (1 & 2)
			if subgroup=='none':

				# Querey PostGres for the Particular Question Selected and put data in DF.
				cursor.execute(f'SELECT {col} from po_data')
				
				df = pd.DataFrame(cursor.fetchall())
				df.columns = [col]
				df.replace(777, np.nan, inplace=True)

				# If proportion selected (2) then return proportion agree/strongly agree.
				if outcome=='proportion':
					numerator = df[col].isin([1,2]).sum()
					denominator = df[col].isin([1,2,3,4,5]).sum()
					value_ct = round((numerator/denominator)*100, 2)

					return str(value_ct), str(denominator)
				
				# If no proportion selected (1) then get percent for each response option.
				else:
					agg = df[col].value_counts().sort_index()
					agg = agg.to_dict()
					
					# Values - Convert to Proportion
					agg_values = list(agg.values())
					sum_agg_val = np.asarray(agg_values).sum()
					agg_values_p = [round((x/sum_agg_val)*100, 2) for x in agg_values]
					
					# Labels
					agg_labels_pre = [str(x) for x in list(agg.keys())]
					agg_labels = [labels_string[x].title() for x in agg_labels_pre]

				return agg_values_p, agg_labels, str(sum_agg_val)


			# Get Data if Request contains a subgroup (3 & 4)
			else:

				# Querey PostGres for the Question & Subgroup Selected and put data in DF.
				cursor.execute(f'SELECT {col}, {subgroup} from po_data')

				df = pd.DataFrame(cursor.fetchall())
				df.columns = [col, subgroup]
				df.replace(777, np.nan, inplace=True)

				# Define Subgroup Labels to Pass Back in Ajax Request
				if subgroup=="white":
					s1 = "White"
					s2 = "Non-White"
					sgroup_label = "Race"

				if subgroup=="less45":
					s1 = "Younger than 45"
					s2 = "Older than 45"
					sgroup_label = "Age"

				# Get Counts For Each Subgroup
				agg = df.groupby([col, subgroup])[col].count()
				agg = agg.to_dict()

				# Parse the agg dictionary
				def parse_dict():
					agg_False, agg_True, agg_F_1_2, agg_T_1_2 = [], [], [], []

					for val in range(1,6):
						for k,v in agg.items():
							if int(k[0]==val) & (k[1]==False):
								agg_False.append(v)
								if val in [1,2]:
									agg_F_1_2.append(v)
							if int(k[0]==val) & (k[1]==True):
								agg_True.append(v)
								if val in [1,2]:
									agg_T_1_2.append(v)
						if len(agg_False)==(val-1):
							agg_False.append(0)
						if len(agg_True)==(val-1):
							agg_True.append(0)
					
					return agg_False, agg_True, agg_F_1_2, agg_T_1_2

				agg_False, agg_True, agg_F_1_2, agg_T_1_2 = parse_dict()

				sum_agg_val_F = np.asarray(agg_False).sum()
				sum_agg_val_T = np.asarray(agg_True).sum()

				if outcome=='proportion':
					ratioF = round(100*(np.asarray(agg_F_1_2).sum()/sum_agg_val_F), 2)
					ratioT = round(100*(np.asarray(agg_T_1_2).sum()/sum_agg_val_T), 2)
					
					return str(ratioT), str(ratioF), s1, s2, sgroup_label, str(sum_agg_val_F), str(sum_agg_val_T)
				
				else:
					agg_values_F = [round((x/sum_agg_val_F)*100, 2) for x in agg_False]
					agg_values_T = [round((x/sum_agg_val_T)*100, 2) for x in agg_True]
					agg_labels = ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree']

					return agg_values_T, agg_values_F, agg_labels, s1, s2, sgroup_label, str(sum_agg_val_F), str(sum_agg_val_T)
			

		# Get Graph Title Based on Question Selected
		title = q_list[series][1]

		# Call stat_by_col function for the 4 variations of graphs

		# (1) no subgroup no proportion: return data, labels, title, and n
		if (subgroup=='none') & (outcome=="likert"):
			data, labels, n = stat_by_col(survey_q, outcome, subgroup)
			return jsonify({"datas": data, "labels": labels, "titles": title, "n": n})

		# (2) no subgroup, yes proportion: return data, n, title (no labels)
		elif (subgroup=='none') & (outcome=="proportion"):
			prop, n = stat_by_col(survey_q, outcome, subgroup)
			return jsonify({"datas": prop, "n":n, "titles": title})

		# (3) subgroup and no proportion: return data if sub=true, data if sub=false, labels, titles, groups, n by group	
		elif (subgroup!='none') & (outcome=="likert"):
			data_True, data_False, labels, s1, s2, sgroup_label, nF, nT = stat_by_col(survey_q, outcome, subgroup)
			return jsonify({'Data_True': data_True, "Data_False": data_False, "labels":labels, "titles": title, 
							"s1": s1, "s2": s2, "slabel": sgroup_label, "nF":nF, "nT":nT })
		
		# (4) subgroup and proportion: return data if sub=true, data if sub=false, titles, groups, n by group
		else:
			data_True, data_False, s1, s2, sgroup_label, nF, nT = stat_by_col(survey_q, outcome, subgroup)
			return jsonify({'Data_True': data_True, "Data_False": data_False, "titles": title, 
							"s1": s1, "s2": s2, "slabel": sgroup_label, "nF": nF, "nT": nT})

