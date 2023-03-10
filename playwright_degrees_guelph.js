const fs = require("fs");
const playwright = require('playwright');
const { exit } = require("process");

// Array.prototype.removeDuplicate = function(){
//     var result = [];
//     for(var i =0; i < this.length ; i++){
//         if(result.indexOf(this[i]) == -1) result.push(this[i]);
//     }
//     return result;
// }

function clean_up_courses(requiredCourses){

    // Remove duplicate courses
    // requiredCourses = requiredCourses.replace(/[ ]/g,"").split(",").removeDuplicate().join(", ");
    // Remove semester line
    requiredCourses = requiredCourses.replace("Semester 1", "");
    requiredCourses = requiredCourses.replace("Semester 2", "");
    requiredCourses = requiredCourses.replace("Semester 3", "");
    requiredCourses = requiredCourses.replace("Semester 4", "");
    requiredCourses = requiredCourses.replace("Semester 5", "");
    requiredCourses = requiredCourses.replace("Semester 6", "");
    requiredCourses = requiredCourses.replace("Semester 7", "");
    requiredCourses = requiredCourses.replace("Semester 8", "");
    requiredCourses = requiredCourses.replace(/- Fall/g, "");
    requiredCourses = requiredCourses.replace(/- Winter/g, "");
    requiredCourses = requiredCourses.replace(/- Summer/g, "");
    // Remove weird characters
    requiredCourses = requiredCourses.replace(/\\\n/g," ");
    requiredCourses = requiredCourses.replace(/\n/g," ");
    requiredCourses = requiredCourses.replace(/\&/g, "|");
    requiredCourses = requiredCourses.trim();
    // Include pipe
    requiredCourses = requiredCourses.replace(/  /g, " | ");

    // Get rid of double pipe
    requiredCourses = requiredCourses.replace(/\|  \|/g, "|")

    // Account for ors
    requiredCourses = requiredCourses.replace(/ \| or/g, " or");
    
    // Deal with duplicate courses
    requiredCourses = requiredCourses.replace(/[ ]/g," ").split("|");
    var result = [];
    for(var i =0; i < requiredCourses.length ; i++){
        if(requiredCourses[i].indexOf("select") == -1 && requiredCourses[i].indexOf("following") == -1 && requiredCourses[i].indexOf("Select") == -1 && requiredCourses[i].indexOf("Required Core Courses") == -1 && requiredCourses[i].indexOf("Core Requirement")) {
            if (requiredCourses[i].indexOf("emester") == -1 && requiredCourses[i].indexOf("Required Course") == -1 && requiredCourses[i].indexOf("Required core course") == -1 && requiredCourses[i].indexOf("Core Requirements") == -1 && requiredCourses[i].indexOf("Required course") == -1) {
                if(result.indexOf(requiredCourses[i]) == -1) result.push(requiredCourses[i]);
            }
        }
    }
    result=result.join("| ");

    requiredCourses = result;
    
    return requiredCourses;
}
async function mostActive(){

    try{

        const browser = await playwright.chromium.launch({
            headless: true
        });

        const page = await browser.newPage();

        await page.goto('https://calendar.uoguelph.ca/undergraduate-calendar/degree-programs/')

        const degreeUrlList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.href));
        const degreeNameList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.innerText));

        console.log(degreeNameList);

        let finalDegreeList = []
        let finalCourseList = []

        // Iterate through each degree and grab their majors
        for (degreeIndex in degreeNameList){

            programList = [];
            await page.goto(degreeUrlList[degreeIndex])

            const programUrlList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.href));
            const programNameList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.innerText));

            // console.log(degreeNameList[degreeIndex], programNameList)

            for (programIndex in programNameList){

                await page.goto(programUrlList[programIndex]);

                const requirementsPage = await page.$$eval('main nav ul li a', (allElements) => allElements.map((element) => element.href));

                // console.log(requirementsPage[1])

                await page.goto(requirementsPage[1]);

                const courseList = await page.$$eval('.sc_courselist .courselistcomment, tr .codecol', (allElements) => allElements.map((element) => element.innerText));

                courses = [];
                for (courseIndex in courseList){
                    // console.log(degreeNameList[degreeIndex], programNameList[programIndex], courseList[courseIndex])

                    courses.push(courseList[courseIndex]);
                    finalCourseList.push([degreeNameList[degreeIndex], programNameList[programIndex], courseList[courseIndex]])
                }

                programList.push(programNameList[programIndex], courses)
                // console.log(degreeNameList[degreeIndex], programNameList[programIndex], courseList)
                // console.log("Done scrapping ", degreeNameList[degreeIndex])
            }
            console.log("Done scrapping ", degreeNameList[degreeIndex])
            // finalDegreeList.push(degreeNameList[degreeIndex], programList)
        }

        await browser.close();

        // for (let i = 0; i < finalCourseList.length; i++){
        //     console.log(finalCourseList[i])
        // }
        jsonObj = new Object();
        jsonObj.degrees = [];

        prevDegree = "";
        sameDegree = false;

        prevProgram = "";
        sameProgram = false;
        // console.log(finalCourseList[0])
        for (let x = 0; x < finalCourseList.length; x++){

            // console.log(finalCourseList[x])
            if (prevDegree == finalCourseList[x][0]){
                sameDegree = true;
            } else {
                sameDegree = false;
            }

            if(!sameDegree){
                let degreeObj = new Object();
                degreeObj.degree = finalCourseList[x][0];
                degreeObj.programs = [];
                prevDegree = degreeObj.degree

                for(let i = 0; i < finalCourseList.length; i++){

                    if (prevProgram == finalCourseList[i][1]){
                        sameProgram = true;
                    } else {
                        sameProgram = false;
                    }

                    if (!sameProgram){
                        
                        if (finalCourseList[i][0] == degreeObj.degree){
                            console.log(finalCourseList[i][1])
                            let program = new Object();
                            program.programName = finalCourseList[i][1]
                            prevProgram = program.programName;

                            program.courses = "none";

                            
                            courseString = "";
                            for(let j = 0; j < finalCourseList.length; j++){
                                
                                if (finalCourseList[j][1] == program.programName){

                                    // let course = new Object();
                                    // course.code = finalCourseList[j][2]

                                    // program.courses.push(course);

                                    courseString = courseString + "  " + finalCourseList[j][2];
                                }

                               
                            }

                            courseString = clean_up_courses(courseString);
                            
                            program.courses = courseString;


                            degreeObj.programs.push(program);
                        }
                    }
                        
                    
                }

                jsonObj.degrees.push(degreeObj);
            }
            


        }

        jsonString = JSON.stringify(jsonObj, null, 1);
        var stream = fs.createWriteStream("degreesGuelph.json", {flags:'w'});
        stream.write(jsonString);

    }catch (e) {
        console.log(e);
        exit();
    }
}

mostActive();