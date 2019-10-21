import excel using "/Users/qayamjetha/Desktop/po_app/data/raw/Survey_Records.xlsx", firstrow clear

rename ANoticedmural 	noticed_mural
rename BHeardofGTT 		heard_GTT
rename CGTTImportance 	GTT_importance
rename DComfortability	mural_uncomfortable
rename EEnjoyment		enjoy_mural
rename FFairness		history_fairly
rename GWelcoming		welcome_public
rename HOffensiveness	mural_offensive
rename IEffectiveness	mural_effective
rename JUnwelcome		mural_unwelcome		
rename KAccuracy		mural_accuracy
rename KComments 		comments
rename LRepresentation	mural_represent_today
rename MVisiting		visit_PO

rename NAge				age
rename OResidence		med_residence
rename NumberYears		med_years
rename PGender			gender
rename QRace			race
rename OtherRace 		race_other
rename CommentsOpinions	opinions

order comments, before(opinions)

*Likert Options = 1 "strongly agree" 2 "agree" 3 "neutral" 4 "disagree" 5 "strongly disagree"

assert OtherIdentity==.
drop OtherIdentity

foreach var of varlist noticed_mural heard_GTT {
	gen `var'_temp = 1 if `var' == "Yes"
	replace `var'_temp = 0 if `var'=="No"
	order `var'_temp, after(`var')
	
	drop `var'
	rename `var'_temp `var'
}
	
foreach var of varlist mural_accuracy mural_represent_today {
	count if `var' == "?"
	replace `var' = "" if `var'=="?"
	destring `var', replace
}


/// Medford Years + Residence
replace med_years = 0 if med_residence=="No"

*2 Incorrect Values of Years - Replacing to equal the lower value in the age range
replace med_years = 60 if med_years==225
replace med_years = 26 if med_years==213

gen med_residence_num = 1 if regexm(med_residence, "Current")
replace med_residence_num = 0 if med_residence_num==. & !missing(med_residence)

label def residence 0 "No or Former Resident" 1 "Current Resident"
label val med_residence_num residence

drop med_residence
rename med_residence_num med_residence


/// Race (white, black, hispanic, other)
gen race_num = 1 if regexm(race, "Black")
replace race_num = 2 if regexm(race, "White")
replace race_num = 3 if regexm(race, "Hispanic") | regexm(race, "Latino")
replace race_num = 4 if missing(race_num)

label def race 1 "Black" 2 "White" 3 "Hispanic" 4 "Other/Missing"
label val race_num race

drop race race_other
rename race_num race


/// Age
encode age, gen(age_num)
drop age
rename age_num age


/// Gender
gen gender_num = 1 if gender=="Female"
replace gender_num = 2 if gender=="Male"
replace gender_num = 3 if regexm(gender, "Trans") | gender=="Other"

label def gender 1 "Female" 2 "Male" 3 "Trans/Other"
label val gender_num gender

drop gender
rename gender_num gender


/// Visit PO
replace visit_PO = "Once a year" if regexm(visit_PO, "year")
encode visit_PO, gen(visit)

drop visit_PO
rename visit visit_PO

order comments opinions, after(visit_PO)
format comments opinions %15s


/* 
	Looks like a lot of likert questions have a value of 0, which I don't understand?
	Going to replace to missing until I understand what a value of 0 means.
*/

foreach var of varlist GTT_importance - mural_represent_today {
	replace `var' = 777 if `var'==0
}


/// Replacing Missing with 777
foreach var of varlist _all {
	if !inlist("`var'", "comments", "opinions") {
		replace `var' = 777 if missing(`var')
	}
}

*Relace Heard_GTT & GTT_importance to 777 if mtissing
replace heard_GTT = 777 if mi(heard_GTT)
replace GTT_importance = 777 if mi(GTT_importance)


*Drop comments & opinions (for now)
drop comments opinions

compress

export delimited using "/Users/qayamjetha/Desktop/po_app/data/po_data_clean.csv", replace
