from flask import Flask
from flask_cors import CORS
from flask import request, jsonify
from parserFunctions import *

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():

	returnString = "Hello from Axios"
	# if 'course' in request.args:
	# 	returnString = returnString + " This is the course search term: " + request.args["course"]
	# if 'semester' in request.args:
        #        returnString = returnString + " This is the semester search term: " + request.args["semester"]
	# if 'credit' in request.args:
        #        returnString = returnString + " This is the credit search term: " + request.args["credit"]
	if 'university' in request.args:
                #returnString = returnString + " This is the university search term: " + request.args["university"]
		
		courseSearch = request.args["course"]
		creditSearch = request.args["credit"]
		semesterSearch = request.args["semester"]
		departmentSearch = request.args["department"]

		if "none" in courseSearch:
			courseSearch = ""
		if "none" in creditSearch:
			creditSearch = ""
		if "none" in semesterSearch:
			semesterSearch = ""
		if "none" in departmentSearch:
			departmentSearch = ""
		
		if 'Guelph' in request.args["university"] or 'UofG' in request.args["university"]:
			JSONCourseListReturn = guelph_parser("UofG", courseSearch, creditSearch, semesterSearch, departmentSearch)
			return JSONCourseListReturn
		else:
			JSONCourseListReturn = queens_parser("Queens", courseSearch, creditSearch, semesterSearch, departmentSearch)
			print(JSONCourseListReturn)
			return JSONCourseListReturn
		
		
		# return JSONCourseListReturn
	
	return returnString

@app.route("/departmentlistqueens")
def returnListQueens():
	#returnString = "Hello from Axios"

	return queens_departments() 

@app.route("/departmentlist")
def returnList():
	#returnString = "Hello from Axios"

	return guelph_departments() 

@app.route("/getDegreePrograms")
def getDegreeCourses():
	#returnString = "Hello from Axios"

	degree_list_JSON = generate_program_list()

	return degree_list_JSON

@app.route("/getDegreeProgramsQueens")
def getDegreeCoursesQueens():
	#returnString = "Hello from Axios"

	degree_list_JSON = generate_program_list_queens()

	return degree_list_JSON


@app.route("/searchDegreeProgram")
def searchDegreeProgram():
	#returnString = "Hello from Axios"

	if 'searchDegree' not in request.args:
		return "error: must include searchDegree"

	degreeProgram = request.args["searchDegree"]

	returnStringDegree = "The function got: '" + degreeProgram + "' as the search term"

	

	# program_code = ''

	# program_code = degreeProgram.split('(')[1].lstrip().split(')')[0] # grabs just the program code
	# print (program_code)

	program_info_JSON = create_program_JSON(degreeProgram)

	# print (program_info_JSON)

	return program_info_JSON

@app.route("/searchDegreeProgramQueens")
def searchDegreeProgramQueens():
	#returnString = "Hello from Axios"

	if 'searchDegree' not in request.args:
		return "error: must include searchDegree"

	degreeProgram = request.args["searchDegree"]

	returnStringDegree = "The function got: '" + degreeProgram + "' as the search term"

	

	# program_code = ''

	# program_code = degreeProgram.split('(')[1].lstrip().split(')')[0] # grabs just the program code
	# print (program_code)

	program_info_JSON = create_program_JSON_queens(degreeProgram)

	# print (program_info_JSON)

	return program_info_JSON
	
if __name__ == "__main__":
	app.run(host='0.0.0.0')