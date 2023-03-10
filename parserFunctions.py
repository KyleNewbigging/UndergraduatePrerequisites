import json
from collections import OrderedDict
import unicodedata

def generate_guelph_course_list():

    guelphFile = open('coursesGuelph.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    courseList = []

    for courseDep in guelphList['departments']:

        for eachCourse in courseDep['courses']:
            
            courseString = [courseDep['department'],eachCourse['code'], eachCourse['name'],eachCourse['semester'],eachCourse['credit'],eachCourse['prereqs']]
            # print(courseDep['department'])
            # print(courseString)
            courseList.append(courseString)

    # for line in courseList:
    #     print(line)
    
    return courseList

def generate_queens_course_list():

    queensFile = open('coursesQueens.json')

    queensList = json.load(queensFile)

    queensFile.close

    courseList = []

    for courseDep in queensList['departments']:
        
        for eachCourse in courseDep['courses']:
            
            courseString = [courseDep['department'],eachCourse['code'], eachCourse['name'],"Unspecified",eachCourse['credit'],eachCourse['prereqs']]
            # print(courseDep['department'])
            # print(courseString)
            courseList.append(courseString)

        # for line in courseList:
        #     print(line)
        
    return courseList


def find_courses_by_name_code(course, courseList, listToReturn):

    courseInfo = {"department":"none","code":"none", "name":"none", "semester":"none", "credits":"none"}

    for line in courseList:

        if course == line[1]:
            # print(line[5])
            courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
            listToReturn.append(courseInfo)
        elif course == line[2]:
            courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
            listToReturn.append(courseInfo)

    return listToReturn

def find_courses(credit, semester, department, courseList, listToReturn):

    courseInfo = {"department":"none","code":"none", "name":"none", "semester":"none", "credits":"none", "prereqs":"none"}

    if not department:
        for line in courseList:
            if credit and not semester:
                # Find course by credit

                if credit == line[4]:
                    # print(line[1] + " " + line[4])
                    courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
                    listToReturn.append(courseInfo)

            elif semester and not credit:
                # Find course by semester
                
                if semester in line[3]:
                    # print(line[1] + " " + line[3])
                    courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
                    listToReturn.append(courseInfo)

            elif credit and semester:
                
                # Find by both credit and semester
                if credit == line[4] and semester in line[3]:
                    # print(line[1] + " " + line[3] + " " + line[4])
                    courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
                    listToReturn.append(courseInfo)
        
    else:
        # Specific department
        for line in courseList:
            if department in line[0]:
                if credit and not semester:
                    # Find course by credit
                   
                    if credit == line[4]:
                        # print(line[1] + " " + line[4])
                        courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
                        listToReturn.append(courseInfo)

                elif semester and not credit:
                    # Find course by semester
                   
                    if semester in line[3]:
                        # print(line[1] + " " + line[3])
                        courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
                        listToReturn.append(courseInfo)

                elif credit and semester:
                    # Find by both credit and semester
                    if credit == line[4] and semester in line[3]:
                        # print(line[1] + " " + line[3] + " " + line[4])
                        courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
                        listToReturn.append(courseInfo)
                
                else:
                    # print(line[1] + " " + line[3] + " " + line[4])
                    courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
                    listToReturn.append(courseInfo)
   
    return listToReturn

def all_courses(courseList, listToReturn):

    for line in courseList:
        courseInfo = {"department": line[0], "code": line[1], "name":line[2], "semester":line[3], "credit":line[4], "prereqs":line[5]}
        listToReturn.append(courseInfo)
    
    return listToReturn

def guelph_departments():
    guelphFile = open('coursesGuelph.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    departmentList = []

    for department in guelphList['departments']:

        departmentName = [''.join(department['department'])]
        departmentJSON = {"department": departmentName}
        departmentList.append(departmentName)
    
    return departmentList

def guelph_parser (uni, course, credit, semester, department):

    print("you have selected: " + uni + " " + course + " " + credit + " " + semester)

    # departmentList = guelph_departments()
    # print(departmentList)
    courseList = generate_guelph_course_list()
    returnList = []
    # generate_guelph_course_list()
    if not course and not department and not semester and not credit:
        returnList = all_courses(courseList, returnList)
    elif not course:
        print("no course selected")
        returnList = find_courses(credit, semester, department, courseList, returnList)
    elif course:
        print("course selected")
        returnList = find_courses_by_name_code(course, courseList, returnList)
        
    # print(returnList)
    listJSON = {"departments":returnList}
    # courseJSON = json.dumps(listJSON)
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(listJSON, f, ensure_ascii=False, indent=4, sort_keys=True)
    
    
    # print(courseJSON)
    
def queens_parser(uni, course, credit, semester, department):
    print("you have selected: " + uni + " " + course + " " + credit + " " + semester)

    # departmentList = guelph_departments()
    # print(departmentList)
    courseList = generate_queens_course_list()
    returnList = []
    # generate_guelph_course_list()
    if not course and not department and not semester and not credit:
        returnList = all_courses(courseList, returnList)
    elif not course:
        print("no course selected")
        returnList = find_courses(credit, semester, department, courseList, returnList)
    elif course:
        print("course selected")
        returnList = find_courses_by_name_code(course, courseList, returnList)
        
    # print(returnList)
    listJSON = {"departments":returnList}
    # courseJSON = json.dumps(listJSON)
    with open('dataQueens.json', 'w', encoding='utf-8') as f:
        json.dump(listJSON, f, ensure_ascii=False, indent=4, sort_keys=True)

def create_program_JSON(programName):

    courseList = generate_guelph_course_list()
    requiredCourses = generate_program_course_list(programName)
    listOfRequiredCourses = []
    stringCourse = ""
    # get all the required courses
    for line in requiredCourses:
        print(line)
        stringCourse = line[0]
        for course in line[0].split():
            if ('*' in course):
                listOfRequiredCourses.append(course)

    listOfCourseInfo = find_course_prereqs(listOfRequiredCourses, courseList)

    listJSON = {"program": programName, "courses": stringCourse, "coursesInfo": listOfCourseInfo}

    with open('dataProgram.json', 'w', encoding='utf-8') as f:
        json.dump(listJSON, f, ensure_ascii=False, indent=4)

    finalJSON = json.dumps(listJSON);

def create_program_JSON_queens(programName):
    
    courseList = generate_queens_course_list()
    requiredCourses = generate_program_course_list_queens(programName)
    listOfRequiredCourses = []
    stringCourse = ""
    # get all the required courses
    for line in requiredCourses:
        print(line)
        stringCourse = line[0]
        for course in line[0].split():
            if ('*' in course):
                listOfRequiredCourses.append(course)

    listOfCourseInfo = find_course_prereqs(listOfRequiredCourses, courseList)

    listJSON = {"program": programName, "courses": stringCourse, "coursesInfo": listOfCourseInfo}

    with open('dataProgramQueens.json', 'w', encoding='utf-8') as f:
        json.dump(listJSON, f, ensure_ascii=False, indent=4)

    finalJSON = json.dumps(listJSON);


    # return finalJSON

def find_course_prereqs(requiredCourses, courseList):

    listOfCourses = []
    for course in requiredCourses:
        for line in courseList:
            if (course == line[1]):
                # print("Match: ", course, line[1])
                courseInfo = {"code": line[1], "name":line[2], "prereqs":line[5]}
                listOfCourses.append(courseInfo)

    return listOfCourses

# Find courses required for each program
def generate_program_course_list(programName):
    guelphFile = open('degreesGuelph.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    courseList = []

    for degree in guelphList['degrees']:

        # print(degree, degreeInList)
        for program in degree['programs']:

            if (programName == program['programName']):

                # Get rid of non ASCII values in string
                course = "".join(c for c in program['courses'] if ord(c)<128)
                
                course = course.replace("or", "or ")
                courses = [course]
                courseList.append(courses)
        
    return courseList

def generate_program_course_list_queens(programName):
    queens = open('degreesQueens.json')

    queensList = json.load(queens)

    queens.close

    courseList = []

    for degree in queensList['degrees']:
        
        for program in degree['programs']:
            # Get rid of non ASCII values in string
            program['programName'] = "".join(c for c in program['programName'] if ord(c)<128)
            program['programName'] = program['programName'].replace("  "," ")
            print(program['programName'])
            if (programName == program['programName']):
                print(program['courses'])
                # Get rid of non ASCII values in string
                course = "".join(c for c in program['courses'] if ord(c)<128)
                
                course = course.replace("or", "or ")
                courses = [course]
                courseList.append(courses)
        
    return courseList

# Specific degrees programs
def generate_degree_program(degree):
    guelphFile = open('degreesGuelph.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    programList = []

    for degreeInList in guelphList['degrees']:

        if (degree in degreeInList['degree']):
            # print(degree, degreeInList)
            for program in degreeInList['programs']:

                # program = [''.join(program['programName'])]
                program = [''.join(program['programName'])]
                programList.append(program)
        
    return programList

def generate_degree_program_queens(degree):
    guelphFile = open('degreesQueens.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    programList = []

    for degreeInList in guelphList['degrees']:

        if (degree in degreeInList['degree']):
            # print(degree, degreeInList)
            for program in degreeInList['programs']:

                # program = [''.join(program['programName'])]
                program = [''.join(program['programName'])]
                programList.append(program)
        
    return programList

# All the degrees
def generate_degree_list():
    guelphFile = open('degreesGuelph.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    degreeList = []

    for degree in guelphList['degrees']:

        degreeName = [''.join(degree['degree'])]
        
        degreeList.append(degreeName)
    
    return degreeList

def generate_degree_list_queens():
    guelphFile = open('degreesQueens.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    degreeList = []

    for degree in guelphList['degrees']:

        degreeName = [''.join(degree['degree'])]
        
        degreeList.append(degreeName)
    
    return degreeList

# Generates all the programs
def generate_program_list():
    guelphFile = open('degreesGuelph.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    programList = []

    for degree in guelphList['degrees']:

        for program in degree['programs']:

            # program = [''.join(program['programName'])]
            program = [degree['degree'], ''.join(program['programName'])]
            programList.append(program)
    
    return json.dump(programList)

def generate_program_list_queens():
    guelphFile = open('degreesQueens.json')

    guelphList = json.load(guelphFile)

    guelphFile.close

    programList = []

    for degree in guelphList['degrees']:

        for program in degree['programs']:

            # program = [''.join(program['programName'])]
            program = [degree['degree'], ''.join(program['programName'])]
            programList.append(program)
    
    return programList

def main ():


    uni = "Guelph"

    # if (uni == "Guelph"):
    #     guelph_parser("UofG", "", "", "", "ANAT")

    degreeList = generate_degree_list_queens();

    print(degreeList)

    # programs = generate_degree_program("Bachelor of Applied Science (B.A.Sc.)");

    # for line in programs:
    #     print(line)


    # courses = generate_program_course_list("AHN")

    # for line in courses:
    #     print(courses)

    courses = create_program_JSON_queens("Hispanic Studies Minor (Arts)")
    

    print(courses)


main()