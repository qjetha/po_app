Flask WebApp that creates a data-visualization dashboard to display data from the Medford, MA Post Office Survey.

For context on the survey/issue see the Delta Diversiy Medford Facebook Group. Essentially, there is a group that is trying to remove a mural in the Medford Post Office that has explicit slavery themes including the Golden Triangle of Trade. It is pretty awful. The survey is an attempt to understand public sentiment about the mural in an attempt to convince the powers at be to remove the mural from the post office.

The data is from an google form survey. Not entirely sure the specifics of the sample frame, how it was administered, etc. 

I cleaned the data using Python and stored the cleaned survey data in a PostGres SQL database (I used python's psycopg2 library to make the tables and insert the data). The python framework, Flask, supported the backend (pretty basic - a single route). HTML/CSS/JS made up the front end. The JS library I used for the viz was Chart.js, which I really liked. I probably could have coded the JS script a lot more efficiently, but whatever. This definitely was not my best code in any of the languages that I used. 

The user is able to specify whether to see the data broken down as:

(1) the individual likert scale response rates for the particular survey question
(2) the proportion of respondents who agree or strongly agree for the particular survey question
(3) the individual likert scale response rates for the particular survey question broken up by a subgroup - either the age or race of the respondent.
(4) the proportion of respondents who agree or strongly agree for the particular survey question but also broken up by subgroup.

I deployed the app on Heroku. You can see it here: <post0office.herokuapp.com>.