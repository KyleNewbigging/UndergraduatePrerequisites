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
    requiredCourses = requiredCourses.replace("1. Core ", "");
    requiredCourses = requiredCourses.replace("Complete the following:", "");
    requiredCourses = requiredCourses.replace("above", "");
    requiredCourses = requiredCourses.replace("higher", "");
    requiredCourses = requiredCourses.replace("A.", "");
    requiredCourses = requiredCourses.replace("B.", "");
    requiredCourses = requiredCourses.replace("C.", "");
    requiredCourses = requiredCourses.replace("D.", "");
    requiredCourses = requiredCourses.replace("E.", "");
    requiredCourses = requiredCourses.replace("Select 6.00 units from the following:", "");
    requiredCourses = requiredCourses.replace("Select 3.00 units from the following:", "");
    requiredCourses = requiredCourses.replace("F.", "");
    requiredCourses = requiredCourses.replace("G.", "");
    requiredCourses = requiredCourses.replace("Semester 8", "");
    requiredCourses = requiredCourses.replace(/- Fall/g, "");
    requiredCourses = requiredCourses.replace(/- Winter/g, "");
    requiredCourses = requiredCourses.replace(/\,/g, " | ");
    requiredCourses = requiredCourses.replace(/\\\n/g," ");
    requiredCourses = requiredCourses.replace(/\&/g, "|");
    requiredCourses = requiredCourses.trim();
    // Include pipe
    requiredCourses = requiredCourses.replace(/  /g, " | ");

    // Get rid of double pipe
    requiredCourses = requiredCourses.replace(/\|  \|/g, "|")

    requiredCourses = requiredCourses.replace(/  /g, " ");
    // Account for or
    requiredCourses = requiredCourses.replace(/ \| or/g, " or");
    requiredCourses = requiredCourses.replace(/or \|/g);
    
    // Deal with duplicate courses
    requiredCourses = requiredCourses.replace(/[ ]/g," ").split("|");
    var result = [];
    for(var i =0; i < requiredCourses.length ; i++){
        if(result.indexOf(requiredCourses[i]) == -1) result.push(requiredCourses[i]);
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

        await page.goto('https://www.queensu.ca/academic-calendar/arts-science/schools-departments-programs/')

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
                programNameList[programIndex] = programNameList[programIndex].replace("-","")
                // const requirementsPage = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.href));

                // console.log(requirementsPage[1])

                // await page.goto(requirementsPage[1]);

                const prereq_list = await page.$$eval('.sc_courselist .courselistcomment, tr .codecol', (allElements) => allElements.map((element) => element.innerText));

                courses = [];
                for (i in prereq_list){
                    prereq = [];
                    if(!Number(prereq_list[i][0]) && prereq_list[i][1] === '.'){
                        // prereq_list[i] = prereq_list[i].replace(/[^\x00-\x7F]/g, ''); // **Removes invisible unicode characters
                        // prereq_list[i] = prereq_list[i].replace(/\n/g, ''); // Remove \n
                        if (prereq_list[i].includes('Complete') || prereq_list[i].includes('Select')){
                            // console.log(programNameList[programIndex])
                            // console.log(prereq_list[i])
                            // console.log(prereq_list[i+1])
                            i = parseInt(i)
                            // console.log(prereq_list[i])
                            // console.log(prereq_list[i+1])
                            while (i+1 < prereq_list.length && !(prereq_list[i+1][1] === '.') && !(prereq_list[i+1].includes('Elective'))) {
                                i++;
                                prereq_list[i] = prereq_list[i].replace(/[^\x00-\x7F]/g, '*'); // **Removes invisible unicode characters
                                prereq_list[i] = prereq_list[i].replace(/\n/g, ''); 
                                // Remove \n
                                if (prereq_list[i].includes('&')) {
                                    // requirements_obj.courses.push(prereq_list[i].substring( 0, prereq_list[i].indexOf('&')));
                                    // requirements_obj.courses.push(prereq_list[i].substring( prereq_list[i].indexOf('&')+1, prereq_list[i].length));
                                    prereq_list[i] = prereq_list[i].replace("&"," | ")
                                    // console.log(prereq_list[i])
                                    prereq.push(prereq_list[i])
                                    // courses.push(prereq_list[i].substring( 0, prereq_list[i].indexOf('&')));
                                    // courses.push(prereq_list[i].substring( prereq_list[i].indexOf('&')+1, prereq_list[i].length));
                                } else {
                                    // requirements_obj.courses.push(prereq_list[i]);
                                    prereq_list[i] = prereq_list[i].replace("or"," or ")
                                    // console.log(prereq_list[i])
                                    prereq.push(prereq_list[i])
                                    // courses.push(prereq_list[i]);
                                }
                                //console.log(prereq_list[i]);
                            }
                            
                        } 
                        // if(prereq_list[i][1] != '.'){
                            // console.log(prereq_list[i])
                        // }

                        // if(prereq_list[i])
                    }
                    // console.log(prereq_list[i])
                    courses.push(prereq)
                    finalCourseList.push([degreeNameList[degreeIndex], programNameList[programIndex], prereq])

                }

                programList.push(programNameList[programIndex], courses)
                // console.log(degreeNameList[degreeIndex], programNameList[programIndex], courseList)
                // console.log("Done scrapping ", degreeNameList[degreeIndex])
            }
            console.log("Done scrapping ", degreeNameList[degreeIndex])
            finalDegreeList.push(degreeNameList[degreeIndex], programList)
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
                            // console.log(finalCourseList[i][1])
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
                            
                            courseString = courseString.replace(/\|  \|/g, "|")
                            if(courseString == ""){
                                courseString = "none"
                            }
                            program.courses = courseString;


                            degreeObj.programs.push(program);
                        }
                    }
                        
                    
                }

                jsonObj.degrees.push(degreeObj);
            }
            


        }

        jsonString = JSON.stringify(jsonObj, null, 1);
        var stream = fs.createWriteStream("degreesQueens.json", {flags:'w'});
        stream.write(jsonString);

    }catch (e) {
        console.log(e);
        exit();
    }
}

mostActive();