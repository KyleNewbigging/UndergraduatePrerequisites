const fs = require("fs");
const playwright = require('playwright');
const { exit } = require("process");



async function mostActive(){
    try{
        const browser = await playwright.chromium.launch({
            headless: true // set this to true
        });

        const page = await browser.newPage();

        jsonObj = new Object();
        jsonObj.departments = [];

        // Grab site with all courses
        await page.goto('https://calendar.uoguelph.ca/undergraduate-calendar/course-descriptions/')

        const departmentUrlList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.href));
        const departmentNameList = await page.$$eval('main div div ul li a', (allElements) => allElements.map((element) => element.innerText));

        let finalCourseList = []

        // iterating through each departments courses
        for (depIndex in departmentNameList) {
            
            console.log("Scrapping " + departmentNameList[depIndex]);

            departmentCourseList = []

            await page.goto(departmentUrlList[depIndex]);
            
            const courseList = await page.$$eval('.sc_sccoursedescs div div span strong', (allElements) => allElements.map((element) => element.innerText));
            const entireCourseBlock = await page.$$eval('.courseblock', (allElements) => allElements.map((element) => element.innerText));

            let count = 0;
            let courseIndex = 0;
            let courseNames = [];
            for(courseIndex in courseList){
                
                // console.log(courseList[courseIndex])
                if (!courseList[courseIndex].includes(".")){
                    // console.log(courseList[courseIndex].length);
                    if (courseList[courseIndex].length < 10){
                        // console.log(courseList[courseIndex], courseList[courseIndex + 1])
                        if (/\d/.test(courseList[courseIndex]) && (courseList[courseIndex].includes("LEC") == false && courseList[courseIndex].includes("LAB") == false)){
                            
                            let courseObj = new Object();
                            courseObj.courseCode = courseList[courseIndex];
                            
                            // print course code
                            // console.log(courseList[courseIndex])
                            // let newIndex = parseInt(courseIndex) + 1;
                            courseIndex = parseInt(courseIndex) + 1;

                            // print course name
                            // console.log(courseList[courseIndex])
                            // console.log(courseIndex, courseList[courseIndex-1], courseList[courseIndex]);
                            courseObj.courseName = courseList[courseIndex];
                            
                            // Semester
                            courseIndex = parseInt(courseIndex) + 1;


                            if (courseList[courseIndex].includes("Fall") || courseList[courseIndex].includes("Winter") || courseList[courseIndex].includes("Summer")){
                                semester = courseList[courseIndex]
                            }else{
                                semester = "Unspecified"
                            }
                            // console.log(courseList[courseIndex])
                            // semester = courseList[courseIndex];
                            
                            // credits
                            courseIndex = parseInt(courseIndex) + 2;

                

                            //pushing each course from this department into the department list
                            if (typeof courseList[courseIndex] == 'undefined' || courseList[courseIndex].includes("Prerequisite(s):") || courseList[courseIndex].includes("Offering(s):") ){
                                departmentCourseList.push ([courseList[courseIndex-4], courseList[courseIndex-3], departmentNameList[depIndex], semester, courseList[courseIndex-1], "none"]);
                            }else{
                                departmentCourseList.push ([courseList[courseIndex-4], courseList[courseIndex-3], departmentNameList[depIndex], semester, courseList[courseIndex], "none"]);
                            }
                            // console.log(courseList[courseIndex])
                            
                           
                            courseNames.push(courseList[courseIndex-4]);
                
                            // courseObj.preReqs = preReqsList[preqsIndex];
                            // deptObj.courses.push(courseObj);
                        }
                    }
                    
                }
                count++;
                
            }

            // let courseBlockLength = entireCourseBlock.length;
            let courseBlockLength = entireCourseBlock.length;
            // console.log('course nums: ', courseNames.length, 'course blocks: ', entireCourseBlock.length )
            // console.log(entireCourseBlock)
            let requirementsListRough = [];
            let currentCourse = "none";

            let x = 0;
            for (let x = 0; x<courseBlockLength; x++) {
                
                currentCourse = courseNames[x]
                // console.log(currentCourse)
                // console.log (entireCourseBlock[x]);
                // iterating through each line of the courseblock

                blockLineArray = entireCourseBlock[x].split("\n");
                numLinesInBlock = blockLineArray.length;

                for (let y = 0; y< numLinesInBlock; y++){

                    let courseObj = new Object();

                    // console.log('TEST   ', blockLineArray[])
                    
                    // console.log
                    if (blockLineArray[y].includes("Prerequisite(s):")){
                        // console.log(blockLineArray[y])
                        // if (currentCourse != "none"){

                        //     courseObj.courseCode = currentCourse.replace(" ","*");
                        //     requirementsListRough.push([currentCourse, blockLineArray[y]]);
                            
                        //     console.log(blockLineArray[y]);
                            
                        for (let d = 0; d<departmentCourseList.length; d++){


                            if (currentCourse == departmentCourseList[d][0]){
                                // console.log(blockLineArray[y])
                                tmpRequirements = blockLineArray[y].replace("Prerequisite(s): ", "");
                                tmpRequirements = tmpRequirements.replace("including", " | ");
                                tmpRequirements = tmpRequirements.replace(", |", " |");
                                tmpRequirements = tmpRequirements.replace(/\,/g," or");
                                tmpRequirements = tmpRequirements.replace(/and/g,"|");
                                tmpRequirements = tmpRequirements.replace(/1 of /g,"");
                            
                                tmpRequirements = tmpRequirements.trim();
                                // tmpRequirements = tmpRequirements.replace(",", " or");
                                // dealing with one of cases
                            
                                departmentCourseList[d][5] = tmpRequirements;
                                courseObj.prereqs = tmpRequirements;
                            }
                        }
                               
                            
                        // }
                        
                    }
                }

                
            }
            

            for (let i=0; i<departmentCourseList.length; i++){
                // console.log (departmentCourseList[i]);
                finalCourseList.push(departmentCourseList[i]);

            }
        }

        
       

        await browser.close();

        // creating JSON file
        prevDepartment = "";
        sameDepartment = false;

        for (let x = 0; x < finalCourseList.length; x++){
            
            
            if (prevDepartment == finalCourseList[x][2]) {

                sameDepartment = true

            } else {

                sameDepartment = false

            }

            if(!sameDepartment){
                
                let deptObj = new Object();
                deptObj.department = finalCourseList[x][2];
                deptObj.courses = [];
                prevDepartment = deptObj.department
                
                // Get all the courses within the department

                for(let i = 0; i < finalCourseList.length; i++){
                    if (finalCourseList[i][2] == deptObj.department){
                        // console.log(prevDepartment, finalCourseList[i][0])
                        let course = new Object();
                        course.code = finalCourseList[i][0];                        
                        course.name = finalCourseList[i][1];
                        course.semester = finalCourseList[i][3];

                        finalCourseList[i][4] = finalCourseList[i][4].replace("[","");
                        finalCourseList[i][4] = finalCourseList[i][4].replace("]","");
                        course.credit = finalCourseList[i][4];
                                
                        // finalCourseList[i][5] = finalCourseList[i][5].replace(",","");
                        // finalCourseList[i][5] = finalCourseList[i][5].replace("(", "");
                        // finalCourseList[i][5] = finalCourseList[i][5].replace(")", "");
                        // finalCourseList[i][5] = finalCourseList[i][5].replace("[", "");
                        // finalCourseList[i][5] = finalCourseList[i][5].replace("]", "");

                        course.prereqs = finalCourseList[i][5];

                        deptObj.courses.push(course);
                    }
                    
                    
                }

                jsonObj.departments.push(deptObj)
            }
            
        }

        jsonString = JSON.stringify(jsonObj, null, 1);
        var stream = fs.createWriteStream("coursesGuelph.json", {flags:'w'});
        stream.write(jsonString);

    }catch (e) {
        console.log(e);
        exit();
    }
}

mostActive();