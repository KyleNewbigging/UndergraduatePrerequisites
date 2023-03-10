const fs = require("fs");
const playwright = require('playwright');
const { exit } = require("process");

function is_this_course (potentialCourse){

    lengthPotentialCourse = potentialCourse.length;
    
    if (lengthPotentialCourse < 3){
        return false;
    }
    else if ((lengthPotentialCourse > 4) && ( !isNaN(potentialCourse[lengthPotentialCourse-1])) &&  ( !isNaN(potentialCourse[lengthPotentialCourse-2])) && ( !isNaN(potentialCourse[lengthPotentialCourse-3]))){
        return true;
    }

}

function is_this_duo_course (potentialCourse){

    lengthPotentialCourse = potentialCourse.length;
    
    if (lengthPotentialCourse < 3){
        return false;
    }
    else if ((lengthPotentialCourse > 4) && ( !isNaN(potentialCourse[lengthPotentialCourse-1])) &&  ( !isNaN(potentialCourse[lengthPotentialCourse-2])) && potentialCourse.search("/") != -1){
        return true;
    }
    else {
        return false;
    }

}

//Corrects codes like PHGY215/216 to PHGY215 or PHGY216 
function check_split_code(str) {

    words = str.split(" ")

    for (let i = 0 ; i < words.length ; i++) {

        if(words[i].includes("/")){

            section = words[i].split("/");
            rootLocal = ""
            validCourse = false

            for (let x = 0 ; x < section.length ; x ++) {

                if (x == 0 && is_course(section[x].replace("*", ""))) {

                    validCourse = true

                } else if (x > 0 && (/^\d+$/).test(section[x]) && validCourse) {

                    if (section[x].length == 3) {

                        rootLocal = section[0].substring(0, 5)
                        str = str.replace("/" + section[x], " or " + rootLocal + section[x]);

                    }  else if (section[x] == "60") {
                        str = str.replace("/" + 60, "")
                    }
                    
                } else {
                    
                    break;

                }
            }

        }
    }

    return str
}

// Checks to see if the string is a course code
function is_course (string){

    for(let i = 0 ; i < string.length ; i++) {

        if (string.length == 7){

            if(!(/[a-zA-Z]/).test(string[i]) && i < 4) {

                return false;

            } else if (!(/^\d+$/).test(string[i]) && i > 3) {
        
                return false;

            }

        } else if (string.len == 8) {

            if(!(/[a-zA-Z]/).test(string[i]) && i < 4) {

                return false;

            } else if (!(/^\d+$/).test(string[i]) && i > 4) {

                return false;

            } else if (i == 4 && string[i] != " ") {

                return false;

            }

        } else {

            return false;

        }
    }
    return true;
}

// removes notes and equivalent courses from prereq
function valid_sentence(string) {

    result = "true"

    if (string.includes("Equivalency")) {

        if (string.indexOf("Equivalency") == 0 || string.indexOf("Equivalency") == 1) {

            result =  "false";

        } else {

            result = string.substring(0, string.indexOf("Equivalency"));
        }

    }
    
    if (string.includes("Note")) {

        if (string.indexOf("Note") == 0 || string.indexOf("Note") == 1) {

            result = "false";

        } else {

            result = string.substring(0, string.indexOf("Note"));

        }
    }

    return result
}

function give_prereques_astirx (prereqs){

    tempPrereqs = "";

    splitPrereqs = prereqs.split(/\s+/);

    for (let i=0; i<splitPrereqs.length; i++){

        if (splitPrereqs[i].length > 5 && splitPrereqs[i].length < 8){ //potentially one course without a space

            sizeWord = splitPrereqs[i].length;
            numberPotentialLetters = sizeWord-3;
            lastThreeNumbers = true;
            firstCharactersLetters = true;


            //checking to see if the last three characters are numbers
            for (let j=sizeWord-1; j>=numberPotentialLetters; j--){
                if (isNaN(splitPrereqs[i][j])){
                    lastThreeNumbers = false;
                }
            }
            // checking all proceeding characters before the numbers are letters
            for (let j=0; j<sizeWord-3; j++){

                if (!(splitPrereqs[i][j].match(/[a-z]/i))){
                    firstCharactersLetters = false;
                }

            }

            if (lastThreeNumbers == true && firstCharactersLetters == true){ //if the last three numbers are digits (assume it is a course)

                if (i==0){
                    
                    //adding the course letter by letter with an astrix
                    for (let j=0; j<sizeWord; j++){
                        
                        tempPrereqs = tempPrereqs + splitPrereqs[i][j];
                        if (j == numberPotentialLetters-1){
                            tempPrereqs = tempPrereqs + "*";
                        }
                    }
                    
                }
                else {

                    tempPrereqs = tempPrereqs + " ";

                     //adding the course letter by letter with an astrix
                     for (let j=0; j<sizeWord; j++){
                        
                        tempPrereqs = tempPrereqs + splitPrereqs[i][j];
                        if (j == numberPotentialLetters-1){
                            tempPrereqs = tempPrereqs + "*";
                        }
                    }

                }

            }
            else { //this word is not a course

                if (i==0){
                    tempPrereqs = tempPrereqs + splitPrereqs[i];
                }
                else {
                    tempPrereqs = tempPrereqs + " " + splitPrereqs[i];
                }

            }



        }
        else if (i != splitPrereqs.length-1){ //not at the last word in prerequsistes and seeing if there are space inbetwen them

            // posibleCourseLetterCode = splitPrereqs[i];
            // possibleCousreNumberCode = splitPrereqs[i+1];

            // isCouseLettersUpperAlpha = true;

            // for (let j=0; j<posibleCourseLetterCode.length; j++){

            //     if ()

            // }

            isThisCourse = is_this_course(splitPrereqs[i] + splitPrereqs[i+1]);
            isThisDuoCourse = is_this_duo_course (splitPrereqs[i] + splitPrereqs[i+1]);

            if (isThisCourse && splitPrereqs[i].length > 2 && splitPrereqs[i+1].length == 3) {

                if (i == 0){

                    tempPrereqs = tempPrereqs + splitPrereqs[i] + "*" + splitPrereqs[i+1];
                    i++;
                }
                else {
                    tempPrereqs = tempPrereqs + " " + splitPrereqs[i] + "*" + splitPrereqs[i+1];
                    i++;
                }
            }
            else if (isThisDuoCourse){
                if (i == 0){

                    tempPrereqs = tempPrereqs + splitPrereqs[i] + "*" + splitPrereqs[i+1];
                    i++;
                }
                else {
                    tempPrereqs = tempPrereqs + " " + splitPrereqs[i] + "*" + splitPrereqs[i+1];
                    i++;
                }
            }
            else if (i==0){
                tempPrereqs = tempPrereqs + splitPrereqs[i];
            }
            else  {
                tempPrereqs = tempPrereqs + " " + splitPrereqs[i];

            }

        }
        else { //next two words are not a course

            if (i==0){
                tempPrereqs = tempPrereqs + splitPrereqs[i];
            }
            else  {
                tempPrereqs = tempPrereqs + " " + splitPrereqs[i];

            }
        }
    }

    return tempPrereqs

}


function check_semicolon_and(string) {

    if(string[0] == " ") {

        string = string.substring(1, string.length)

    }

    temp = string.split("; ")
    previousCourse = false
    beginningCourseCode = ""

    for (let x = 0 ; x < temp.length ; x++) {

        if(x == 0 && is_course(temp[x])) {

            previousCourse = true;

            beginningCourseCode = temp[x].substring(0, 4)

        } else if (previousCourse) {

            words = temp[x].split(" ");

            if ((/^\d+$/).test(words[0])) {


                if(is_course(beginningCourseCode + words[0])) {

                    string = string.replace("; " + words[0], "|" + beginningCourseCode + words[0]);
                    
                } else {

                    previousCourse = false
                    beginningCourseCode = ""
                    
                }

            } else {

                previousCourse = false
                beginningCourseCode = ""

            }

        } else if (is_course(temp[x])) {

            previousCourse = true;

        }
    }

    return string
}

function one_of_cases(str) {

    splitStr = str.split("one of")
    oldSplitStr = ""

    for (let x = 0 ; x < splitStr.length ; x++) {

        oldSplitStr = splitStr[x]

        if (str[str.indexOf("one of") - 1] == "|" && x != 0) {

            splitStr[x] = splitStr[x].replace(/\|/g," or ")
        
            words = splitStr[x].split(" ")

            for(let y = 0 ; y < words.length - 1 ; y++) {

                if(y != 0 && is_course(words[y].replace("*", "")) && words[y + 1] != "or") {
                    splitStr[x] = splitStr[x].replace(words[y], words[y] + " or")
                }
            }
            
            str = str.replace(oldSplitStr, splitStr[x])
            str = str.replace("one of ", "")
            str = str.replace("one of: ", "")

        } else if(x != 0) {

            str = str.replace(splitStr[x-1], "")
            str = str.replace("one of ", "")
            str = str.replace("one of: ", "")

        }
        
    }

    return str
}

async function mostActive(){
    try{
        const browser = await playwright.chromium.launch({
            headless: true // set this to true
        });

        const page = await browser.newPage();

        jsonObj = new Object();
        jsonObj.departments = [];

        // Grab site with all courses
        await page.goto('https://www.queensu.ca/academic-calendar/arts-science/course-descriptions/')

        const departmentUrlList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.href));
        const departmentNameList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.innerText));

        let finalCourseList = []

        // iterating through each departments courses
        for (depIndex in departmentNameList) {
            
            departmentCourseList = []

            await page.goto(departmentUrlList[depIndex]);

            // deptObj = new Object();
            // deptObj.departmentName = departmentNameList[depIndex];
            // deptObj.courses = [];

            const courseList = await page.$$eval('.sc_sccoursedescs div div span strong', (allElements) => allElements.map((element) => element.innerText));
            const entireCourseBlock = await page.$$eval('.courseblock div', (allElements) => allElements.map((element) => element.innerText));
            
            // console.log(courseList.length, entireCourseBlock.length)
            let count = 0;
            let courseIndex = 0;
            for (courseIndex in courseList){
                
                if (!courseList[courseIndex].includes(".")){
                    // console.log(courseList[courseIndex].length);
                    if (courseList[courseIndex].length < 9){
                        if (/\d/.test(courseList[courseIndex])){
                            // console.log(courseList[courseIndex], courseList[courseIndex + 1])
                            let courseObj = new Object();
                            courseObj.courseCode = courseList[courseIndex];
                            
                            // let newIndex = parseInt(courseIndex) + 1;
                            courseIndex = parseInt(courseIndex) + 1;
                            // console.log(courseIndex, courseList[courseIndex-1], courseList[courseIndex]);
                            courseObj.courseName = courseList[courseIndex];

                            // units
                            courseIndex = parseInt(courseIndex) + 1;
                            // console.log(courseList[courseIndex])
                            
                            //pushing each course from this department into the department list
                            departmentCourseList.push ([courseList[courseIndex-2], courseList[courseIndex-1], departmentNameList[depIndex], courseList[courseIndex], "none"]);
                            
                
                            // courseObj.preReqs = preReqsList[preqsIndex];
                            // deptObj.courses.push(courseObj);
                        }
                    }
                    
                }
                count++;
                
            }

            // console.log("This is the entire course blocks??");
            // console.log (entireCourseBlock);

            let courseBlockLength = entireCourseBlock.length;
            let requirementsListRough = [];
            let currentCourse = "none";

            let x = 0;
            for (let x = 0; x<courseBlockLength; x++) {
                // console.log (entireCourseBlock[x]);

                // iterating through each line of the courseblock

                blockLineArray = entireCourseBlock[x].split("\n");
                numLinesInBlock = blockLineArray.length;

                for (let y = 0; y< numLinesInBlock; y++){

                    let courseObj = new Object();

                    if (blockLineArray[y].search("Units:") != -1){


                        lineSplitSpaces = blockLineArray[y].split(/\s+/);
                        currentCourse = lineSplitSpaces[0] + " " + lineSplitSpaces[1];
                        // console.log("Found current course it is: '" + currentCourse + "'");
                        
                    }

                    //checking to find all the requirements
                    if (blockLineArray[y].search("Requirements:") != -1){

                        if (currentCourse != "none"){

                            courseObj.courseCode = currentCourse.replace(" ","*");
                            requirementsListRough.push([currentCourse, blockLineArray[y]]);
                            
                            // console.log(blockLineArray[y]);
                            
                            for (let d = 0; d<departmentCourseList.length; d++){

                                if (currentCourse == departmentCourseList[d][0]){

                                    tmpRequirements = blockLineArray[y].replace("Requirements:", "");
                                    tmpRequirements = tmpRequirements.replace("PREREQUISITES", "");
                                    tmpRequirements = tmpRequirements.replace("Prerequisites", "");
                                    tmpRequirements = tmpRequirements.replace("PREREQUISITE", "");
                                    tmpRequirements = tmpRequirements.replace("REQUISITE", "");
                                    tmpRequirements = tmpRequirements.replace("Prerequisite", "");
                                    tmpRequirements = tmpRequirements.replace("prerequisite", "");
                                    tmpRequirements = tmpRequirements.replace("CO", "or");
                                    tmpRequirements = tmpRequirements.replace("corequisite", "or");
                                    tmpRequirements = tmpRequirements.replace("Corequisite", "or");
                                    tmpRequirements = tmpRequirements.replace(/\,/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\)/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\(/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\[/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\]/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\/3.0/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\/2.0/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\|/g, " | ");
                                    tmpRequirements = tmpRequirements.replace(/  /g, " ");
                                    tmpRequirements = tmpRequirements.replace(/above/g, "");
                                    tmpRequirements = tmpRequirements.replace(/undefined/g, "");
                                    tmpRequirements = tmpRequirements.replace(/and/g, "|");
                                    tmpRequirements = tmpRequirements.replace(/\| or/g, " or");
                                    tmpRequirements = tmpRequirements.replace(/\|  \|/g, " | ");
                                    tmpRequirements = tmpRequirements.replace(/   /g, " ");
                                    tmpRequirements = tmpRequirements.replace(/  /g, " ");
                                    
                                    //fixing courses that have MICR221; 299; 360; 461
                                    if (tmpRequirements.includes(";")) {

                                        tmpRequirements = check_semicolon_and(tmpRequirements);

                                    }

                                    tmpRequirements = tmpRequirements.replace(/\;/g,"");
                                    tmpRequirements = tmpRequirements.replace(/\./g,"");
                                    tmpRequirements = tmpRequirements.trim();

                                    // console.log(String(tmpRequirements));
                                    tmpRequirements = give_prereques_astirx(tmpRequirements);

                                    if (tmpRequirements.includes("/")) {

                                        tmpRequirements = check_split_code(tmpRequirements)
                                    }
                            
                                    departmentCourseList[d][4] = tmpRequirements;
                                    courseObj.prereqs = tmpRequirements;
                                }
                            }
                               
                            
                        }
                        
                    }
                }

                
            }

            //going through the departmentCourseList and replacing the course code space with an astrix
            for (let i=0; i<departmentCourseList.length; i++){
                departmentCourseList[i][0] = departmentCourseList[i][0].replace(" ","*");
            }


            for (let i=0; i<departmentCourseList.length; i++){
                // console.log (departmentCourseList[i]);
                finalCourseList.push(departmentCourseList[i]);

            }

            console.log ("finished Queens scraping for: " + departmentNameList[depIndex]);
            
        }

        // for (let e=0; e<10; e++){
            
        //     console.log(finalCourseList[e][0])
        //     console.log (give_prereques_astirx(finalCourseList[e][3]));
        // }

        await browser.close();

        //creating a csv for all queens courses
        var streamCSVCourses = fs.createWriteStream("queens_rough.csv", {flags:'w'});


        for (let v = 0; v<finalCourseList.length; v++){

            streamCSVCourses.write(finalCourseList[v][0] + "," + finalCourseList[v][1] + "," + finalCourseList[v][2] + "," + String(finalCourseList[v][3]) + "\n");
        }
        
        
        prevDepartment = "";
        sameDepartment = false;
       
        for (let x = 0; x < finalCourseList.length; x++){
            
            // console.log(deptObj.department, finalCourseList[x][2])

            if (prevDepartment == finalCourseList[x][2]) {

                sameDepartment = true

            } else {

                sameDepartment = false

            }
            
            if(!sameDepartment) {

                let deptObj = new Object();
                deptObj.department = finalCourseList[x][2];
                deptObj.courses = [];
                prevDepartment = deptObj.department
                
            
                // get all courses / department 
                for(let i = 0; i < finalCourseList.length; i++){
                    if (finalCourseList[i][2] == deptObj.department){
                        let course = new Object();
                        course.code = finalCourseList[i][0];
                        finalCourseList[i][1] = finalCourseList[i][1].replace(/\"/g,"")
                        course.name = finalCourseList[i][1];

                        finalCourseList[i][3] = finalCourseList[i][3].replace("Units: ", "")
                        course.credit = finalCourseList[i][3];

                        let tempPreReqs = finalCourseList[i][4];

                        // Removes all on unnecessary info for courses with no prerequisites
                        if (tempPreReqs.includes("None")) {
                            tempPreReqs = "none";
                        }

                        // Remove everything past "Exclusion"
                        if (tempPreReqs.includes("Exclusion") || tempPreReqs.includes("EXCLUSION") || tempPreReqs.includes("Excl") || tempPreReqs.includes("excl") ){
                            tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("Exclusion"));
                            tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("Excl"));
                            tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("EXCLUSION"));
                            tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("excl"));

                            //removes One-Way at the end of the string if it is there
                            if (tempPreReqs.includes("One-Way")) {

                                if (tempPreReqs.indexOf("One-Way") == tempPreReqs.length - 8) {

                                    tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("One-Way"));

                                } 

                            } else if (tempPreReqs.includes("One-way")) {

                                if (tempPreReqs.indexOf("One-way") == tempPreReqs.length - 8) {

                                    tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("One-way"));

                                } 

                            }
                            
                            if(tempPreReqs == "") {

                                tempPreReqs = "none";

                            }
                        }

                        if (tempPreReqs.includes("recommended") || tempPreReqs.includes("Recommended") || tempPreReqs.includes("Recommendation")) {

                            tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("recommended"));
                            tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("Recommended"));
                            tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("Recommendation"));

                            if(tempPreReqs == "") {

                                tempPreReqs = "none";

                            }

                        }

                        // Replace ands with pipe
                        if(tempPreReqs.includes(" and ") || tempPreReqs.includes(" AND ")){
                            
                            if (tempPreReqs.search ("and Cultures") == -1){
                                tempPreReqs = tempPreReqs.replace(/ and /g,"|");
                                tempPreReqs = tempPreReqs.replace(/ AND /g,"|");
                            }
                            else { // case to note remove and if the use in in and Cultures.
                                tempSplitReqs = tempPreReqs.split(/\s+/)

                                for (let e=0; e<tempSplitReqs.length; e++){

                                    if (tempSplitReqs[e] == "and" && tempSplitReqs[e+1] != "Cultures."){
                                        tempSplitReqs[e] = '|';
                                    }
                                }

                                tempPreReqs_local = ""

                                for (let e=0; e<tempSplitReqs.length; e++){

                                    if (e==0){
                                        tempPreReqs_local = tempPreReqs_local + tempSplitReqs[e];
                                    }
                                    else {
                                        tempPreReqs_local = tempPreReqs_local + " " + tempSplitReqs[e];
                                    }

                                }


                                tempPreReqs = tempPreReqs_local;

                                // console.log (tempPreReqs);
                            }
                        }

                        if(tempPreReqs.includes("OR")){

                            tempPreReqs = tempPreReqs.replace(/OR/g,"or");

                        }

                        var sentences = tempPreReqs.split(".");

                        for(let x = 0 ; x < sentences.length ; x++) {

                            while (valid_sentence(sentences[x]) !== "true") {

                                if (valid_sentence(sentences[x]) === "false") {

                                    tempPreReqs = tempPreReqs.replace(sentences[x] , "");
                                    sentences[x] = ""
        
                                } else if (valid_sentence(sentences[x]) !== "true") {
        
                                    tempPreReqs = tempPreReqs.replace(sentences[x], valid_sentence(sentences[x]))

                                    sentences[x] = valid_sentence(sentences[x])
        
                                }

                            }

                        }

                        if (tempPreReqs == "") {

                            tempPreReqs = "none";
                            
                        }

                        // dealing with one of cases
                        if (tempPreReqs.includes("one of")) {

                            tempPreReqs = one_of_cases(tempPreReqs)

                        }

                        //removes and at the end of the string if it is there
                        if (tempPreReqs.includes("and")) {

                            if (tempPreReqs.indexOf("and") == tempPreReqs.length - 3) {

                                tempPreReqs = tempPreReqs.substring(0, tempPreReqs.indexOf("and"));

                            } 

                        }

                        tempPreReqs = tempPreReqs.replace(/\|or/g, " or");
                        tempPreReqs = tempPreReqs.replace(/\|/g, " | ");
                        tempPreReqs = tempPreReqs.replace(/\| or/g, " or");
                        tempPreReqs = tempPreReqs.replace(/  or/g, " or");
                        tempPreReqs = tempPreReqs.replace(/or \|/g, " or");
                        tempPreReqs = tempPreReqs.replace(/Level 4 or/g, "");
                        tempPreReqs = tempPreReqs.replace(/Level 3 or/g, "");
                        tempPreReqs = tempPreReqs.replace(/Level 2 or/g, "");
                        tempPreReqs = tempPreReqs.replace(/Level 1 or/g, "");
                        tempPreReqs = tempPreReqs.replace(/Level 4/g, "");
                        tempPreReqs = tempPreReqs.replace(/Level 3/g, "");
                        tempPreReqs = tempPreReqs.replace(/Level 2/g, "");
                        tempPreReqs = tempPreReqs.replace(/Level 1/g, "");
                        tempPreReqs = tempPreReqs.replace(/\|  registration/g, "registration")
                        tempPreReqs = tempPreReqs.replace(/\|  registration/g, "registration")
                        tempPreReqs = tempPreReqs.replace(/higher/g, "");
                        tempPreReqs = tempPreReqs.replace(/above/g, "");
                        tempPreReqs = tempPreReqs.replace("|or", " or");
                        tempPreReqs = tempPreReqs.replace("or or", "or ");
                        tempPreReqs = tempPreReqs.replace("and*", "and ");

                        if (!tempPreReqs.includes("*") && tempPreReqs.includes("or permission of the Department")){
                            tempPreReqs = "permission of the Department"
                        }

                        if (tempPreReqs.includes("|  registration in an ARTH")){
                            tempPreReqs = tempPreReqs.replace("|  registration in an ARTH", "registration in an ARTH")
                        }

                        if (tempPreReqs.includes("a cumulative GPA of 190 or")){
                            tempPreReqs = tempPreReqs.replace("a cumulative GPA of 190 or", "a cumulative GPA of 190")
                        }

                        // tempPreReqs = tempPreReqs.replaceAll(/\0x20|\0x0A\g/," ");

                        tempPreReqs = tempPreReqs.replace(/\./g,"");
                        tempPreReqs = tempPreReqs.trim();

                        //adding an astrix to each of the courses
                        // tempPreReqs = give_prereques_astirx(tempPreReqs);

                        finalCourseList[i][4] = tempPreReqs;
                        course.prereqs = tempPreReqs;
                        // console.log(JSON.parse(JSON.stringify(course)));
                        deptObj.courses.push(course);
                    }
                    
                }
                jsonObj.departments.push(deptObj)
        }

           
        }

        // for (let i=0; i<finalCourseList.length; i++){
        //     console.log(finalCourseList[i]);
        // }
        
        jsonString = JSON.stringify(jsonObj, null, 1);
        var stream = fs.createWriteStream("coursesQueens.json", {flags:'w'});
        stream.write(jsonString);
        // console.log(jsonObj)
    }catch (e) {
        console.log(e);
        exit();
    }
}

mostActive();