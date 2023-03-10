import React, { Component, useState } from 'react'
import { Row, Col, Container } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import axios from 'axios';
import DagreGraph from 'dagre-d3-react'
import * as d3 from 'd3';
import $ from 'jquery';
import { Stack } from 'react-bootstrap'
import UniversitySearch from './UniSearch';

const GraphSearch = () => {

    // TEMP JSON variables for tree
    // -----------------------------------------------------------------
    
    let orgChart = {
        nodes: [
        ],
        links: [
        ]
    }

    const linkConfig = {
        arrowhead: 'normal',
        style: 'stroke: #333; fill: none; stroke-width: 1.5px;',
        curve: d3.curveBasis
    }

    //config for or arrows
    const linkConfigOR = {
        arrowhead: 'normal',
        arrowheadStyle: "fill: #87B6A7",
        style: 'stroke: #87B6A7; fill: none; stroke-width: 1.5px;',
        curve: d3.curveBasis
    }

    //config for and arrows
    const linkConfigAND = {
        arrowhead: 'normal',
        arrowheadStyle: "fill: #5B5941",
        style: 'stroke: #5B5941; fill: none; stroke-width: 1.5px;',
        curve: d3.curveBasis
    }


    

    const newchart = {
        nodes: [{ id: "CIS*1300", label: "<h5>CIS*1300</h5>",labelType: "html"}, { id: "CIS*2500", label: "<h3>Node 2</h3>",labelType: "html" }, { id: "CIS*2170", label: "<h3>Node 2</h3>" ,labelType: "html"}, { id: "CIS*1910", label: "<h3>Node 2</h3>" ,labelType: "html"}, { id: "CIS*2430", label: "<h3>Node 2</h3>",labelType: "html" }, { id: "CIS*2520", label: "<h3>Node 2</h3>" ,labelType: "html"}, { id: "CIS*2750", label: "<h3>Node 2</h3>" ,labelType: "html"}],
        links: [
          { source: "CIS*1300", target: "CIS*2500", config:linkConfig },
          { source: "CIS*1300", target: "CIS*2170", config:linkConfig },
          { source: "CIS*2500", target: "CIS*2430", config:linkConfig },
          { source: "CIS*2500", target: "CIS*2520", config:linkConfig },
          { source: "CIS*2430", target: "CIS*2750", config:linkConfig },
          { source: "CIS*1910", target: "CIS*2520", config:linkConfig },
          { source: "CIS*2520", target: "CIS*2750", config:linkConfig },
        ],
    };

    // CSS Styling
    // -----------------------------------------------------------------

    const searchStyle = {
        backgroundColor: "lightgrey",
        minWidth: "250px",
        height: "calc(100vh - 64px)"
    };

    const treeStyle = {
        backgroundColor: "lightblue",
        height: "calc(100vh - 64px)"
    };

    // Initialize useStates
    // -----------------------------------------------------------------
    const [universityInput, setuniversityInput] = useState ("")
    const [courseInput, setcourseInput] = useState ("")
    const [degreeInput, setdegreeInput] = useState ("")

    const [courses, setCourses] = useState ([""])
    const [degrees, setDegrees] = useState ([""])

    const [searchCourse, setsearchCourse] = useState (true)
    const [searchDegree, setsearchDegree] = useState (true)

    const [data, setData] = useState (orgChart)

    // Handle Functions
    // -----------------------------------------------------------------

    const handleUniSelect = (e) => {
        
        setuniversityInput(e.target.value)
        if (e.target.value == "") {
            setsearchDegree(true)
            setsearchCourse(true)
            document.getElementById('courseSelect').selectedIndex = 0;
            document.getElementById('degreeSelect').selectedIndex = 0;
        } else {
            setsearchDegree(false)
            setsearchCourse(false)
        }
        if (e.target.value === 'University of Guelph') {
            axios.get('https://131.104.49.103:80/departmentlist?getUni=guelph', {
                headers: { "Access-Control-Allow-Origin": "*" }
                })
                .then((response) => {
                    
                    
                    // console.log(response.data['departments'])
                    var departmentNames = []
    
                    for (let i=0; i<response.data['departments'].length; i++ ){
                        departmentNames.push (response.data['departments'][i])
                    }
    
                    // console.log(departmentNames)
    
                    setCourses(departmentNames)
                    
                })
                .catch(err => {
                    console.log(err.code);
                    console.log(err.message);
                    console.log(err.stack);
                });

            //axios call to populate the degree list dropdown

            axios.get('https://131.104.49.103:80/getDegreePrograms', {
            headers: { "Access-Control-Allow-Origin": "*" }
            })
            .then((response) => {
                
                // console.log("Entereted the getDegreePrograms axios");
                var degreeNames = []
                for (let i=0; i<response.data["programs"].length; i++){
                    // console.log (response.data['programs'][i][1]);
                    degreeNames.push(response.data['programs'][i][1]);
                }

                setDegrees (degreeNames);
                
            })
            .catch(err => {
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            });





        } else if (e.target.value == 'Queens University') {
            axios.get('https://131.104.49.103:80/departmentlistqueens?getUni=queens', {
            headers: { "Access-Control-Allow-Origin": "*" }
            })
            .then((response) => {
                
                
                console.log(response.data)
                var departmentNames = []

                for (let i=0; i<response.data['departments'].length; i++ ){
                    departmentNames.push (response.data['departments'][i])
                }

                console.log(departmentNames)

                setCourses(departmentNames)
                
            })
            .catch(err => {
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            });

            axios.get('https://131.104.49.103:80/getDegreeProgramsQueens', {
            headers: { "Access-Control-Allow-Origin": "*" }
            })
            .then((response) => {
                
                // console.log("Entereted the getDegreePrograms axios");
                var degreeNames = []
                for (let i=0; i<response.data.length; i++){
                    // console.log (response.data['programs'][i][1]);
                    degreeNames.push(response.data[i][1]);
                }

                setDegrees (degreeNames);
                
            })
            .catch(err => {
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            });
        }
    }

    const handleCourseSelect = (e) => {
        setcourseInput(e.target.value)
        if (e.target.value == "") {
            setsearchCourse(false)
        } else {
            setsearchCourse(true)
        }
        
    }

    const handleDegreeSelect = (e) => {
        setdegreeInput(e.target.value)
        if (e.target.value == "") {
            setsearchDegree(false)
        } else {
            setsearchDegree(true)
        }
    }

    const clearInfo = () => {
        setuniversityInput('');
        setcourseInput('');
        setdegreeInput('');
        setsearchDegree(false);
        setsearchCourse(false);
        $("#universitySelect").val('');
        $("#courseSelect").val('');
        $("#degreeSelect").val('');
        $('#uiError').hide();
        $('#uniError').hide();

        let new_chart_data = {}
                
        new_chart_data["nodes"] = [];
        new_chart_data["links"] = [];

        setData(new_chart_data);
    }

    const submitSearch = () => {

        $('#uiError').hide();
        $('#uniError').hide();

        var search_term_degree = degreeInput;
        var search_term_department = courseInput;
        // console.log ("This is the degree to search: "+ search_term_degree);
        
        if(universityInput == "") {
            $('#uniError').show();
        } else if (universityInput === "University of Guelph") {

            //axios call to search for a degree and get all the courses for that degree into a graph
            if (search_term_degree != ""){
                axios.get('https://131.104.49.103:80/searchDegreeProgram?searchDegree='+search_term_degree, {
                headers: { "Access-Control-Allow-Origin": "*" }
                })
                .then((response) => {

                    // console.log (response.data);

                    var listCoursesDegree = [];
                    // console.log("What is the listCoursesDegree \n" + listCoursesDegree);

                    // console.log (response.data["coursesInfo"]);
                    
                    for (let i = 0; i<response.data["coursesInfo"].length; i++){
                            listCoursesDegree.push (response.data["coursesInfo"][i]);
                            // console.log (response.data["coursesInfo"][i]);

                    }
                    // console.log ("THIS IS THE LIST OF COURSES FOR SELECTED DEGREE");
                    // for (let i=0; i<listCoursesDegree.length; i++){
                    //     console.log (listCoursesDegree[i]);
                    // }

                    var all_course_nodes = [];
                    let list_links = [];

                    //getting all the nodes for the graph from each course and prereq
                    
                    for (let i=0; i<listCoursesDegree.length; i++){

                        //adding the course to the list of nodes if it is not already there
                        if (all_course_nodes.indexOf(listCoursesDegree[i]["code"]) == -1){
                            all_course_nodes.push(listCoursesDegree[i]["code"]);
                        }

                        let current_course = listCoursesDegree[i]["code"];


                        //going through the prerequsites and adding them as well to the nodes list if they
                        //are not already there

                        console.log (listCoursesDegree[i]);

                        let current_prereqs = listCoursesDegree[i]["prereqs"];
                        console.log (current_prereqs);

                        let parsed_prereqs_and = []
                        let final_list_seperated_prerequisites = []


                        //splitting the prerequsiteds first by and
                        parsed_prereqs_and = current_prereqs.split(" | ");


                        for (let j = 0; j<parsed_prereqs_and.length; j++){
                            // console.log(parsed_prereqs_or[j]);

                            //now parsing by or

                            if (parsed_prereqs_and[j].includes(" or ")) {

                                let current_or_prerequisites = parsed_prereqs_and[j].split(" or ");

                                for (let x = 0; x< current_or_prerequisites.length; x++){

                                    let current_edited_prereq = '';
                                    
                                    current_edited_prereq = current_or_prerequisites[x].replace("(","");
                                    current_edited_prereq = current_edited_prereq.replace (")","");
                                    current_edited_prereq = current_edited_prereq.replace ("[","");
                                    current_edited_prereq = current_edited_prereq.replace ("]","");
                                    //dealing with the error of "|" without two spaces between
                                    // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                    if (!current_edited_prereq.includes('none') && current_edited_prereq != '' && current_edited_prereq != null){
                                        console.log("entered the if for includes links");
                                        list_links.push({ source: current_edited_prereq, target: current_course , config:linkConfigOR})
                                    }


                                    final_list_seperated_prerequisites.push(current_or_prerequisites[x]);
                                }

                            }
                            else {

                                let current_edited_prereq = '';
                                    
                                current_edited_prereq = parsed_prereqs_and[j].replace("(","");
                                current_edited_prereq = current_edited_prereq.replace (")","");
                                current_edited_prereq = current_edited_prereq.replace ("[","");
                                current_edited_prereq = current_edited_prereq.replace ("]","");
                                //dealing with the error of "|" without two spaces between
                                // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                if (current_edited_prereq != 'none' && current_edited_prereq != '' && current_edited_prereq != null){
                        
                                    list_links.push({ source: current_edited_prereq, target: current_course, config:linkConfigAND})
                                }

                                final_list_seperated_prerequisites.push(parsed_prereqs_and[j]);

                            }
                            


                        }

                        //adding each of the prerequisites as nodes if they are unique

                        for (let j=0; j<final_list_seperated_prerequisites.length; j++){
                            
                            let current_edited_node = '';
                            current_edited_node = final_list_seperated_prerequisites[j].replace("(","");
                            current_edited_node = current_edited_node.replace(")", "");
                            current_edited_node = current_edited_node.replace("[", "");
                            current_edited_node = current_edited_node.replace("]", "");
                            //dealing with the error of "|" without two spaces between
                            // current_edited_node = current_edited_node.replace ("|"," and ");


                            


                            if (all_course_nodes.indexOf(current_edited_node) == -1 && current_edited_node != 'none' && current_edited_node != '' && current_edited_node != null){

                                all_course_nodes.push(current_edited_node);
                            }

                        }
                        // console.log(final_list_seperated_prerequisites);

                        


                    }

                    // console.log ("LIST OF ALL COURSE NODES");
                    // console.log (all_course_nodes);


                    //correctly formatting the nodes for the graph

                    let new_chart_data = {}

                    let list_nodes = [];
                    

                    for (let i =0; i<all_course_nodes.length; i++){

                        let h3_string = all_course_nodes[i]

                        list_nodes.push({id: all_course_nodes[i], label: h3_string, labelType: "string", labelStyle: "font-style: italic; text-decoration: underline;", config: {style: 'fill: #E3F09B'}});
                        console.log (all_course_nodes[i]);


                        // console.log (all_course_nodes[i]);
                    }

                    // for (let i =0; i<list_nodes.length; i++){

                    //     console.log(list_nodes[i]);
                    // }
                    
                    new_chart_data["nodes"] = list_nodes;
                    new_chart_data["links"] = list_links;

                    console.log (new_chart_data);

                    setData(new_chart_data);


                    // { id: "CIS*1300", label: "<h5>CIS*1300</h5>",labelType: "html"}
                })
                .catch(err => {
                    console.log(err.code);
                    console.log(err.message);
                    console.log(err.stack);
                });
            
            }

            if (search_term_department != ""){


                axios.get('https://131.104.49.103:80/?course=none&semester=none&credit=none&department=' + search_term_department + "&university=UofG", {
                headers: { "Access-Control-Allow-Origin": "*" }
                })
                .then((response) => {

                    console.log (response.data);

                    var listCoursesDegree = []

                    
                    for (let i = 0; i<response.data["departments"].length; i++){
                            listCoursesDegree.push (response.data["departments"][i]);

                    }
                    // console.log ("THIS IS THE LIST OF COURSES FOR SELECTED DEGREE");
                    // for (let i=0; i<listCoursesDegree.length; i++){
                    //     console.log (listCoursesDegree[i]);
                    // }

                    var all_course_nodes = [];
                    let list_links = [];

                    //getting all the nodes for the graph from each course and prereq
                    
                    for (let i=0; i<listCoursesDegree.length; i++){

                        //adding the course to the list of nodes if it is not already there
                        if (all_course_nodes.indexOf(listCoursesDegree[i]["code"]) == -1){
                            all_course_nodes.push(listCoursesDegree[i]["code"]);
                        }

                        let current_course = listCoursesDegree[i]["code"];

                        //going through the prerequsites and adding them as well to the nodes list if they
                        //are not already there

                        let current_prereqs = listCoursesDegree[i]["prereqs"];
                        // console.log (current_prereqs);

                        let parsed_prereqs_and = []
                        let final_list_seperated_prerequisites = []


                        //splitting the prerequsiteds first by and
                        parsed_prereqs_and = current_prereqs.split(" | ");

                        for (let j = 0; j<parsed_prereqs_and.length; j++){
                            // console.log(parsed_prereqs_or[j]);

                            //now parsing by or

                            if (parsed_prereqs_and[j].includes(" or ")) {

                                let current_or_prerequisites = parsed_prereqs_and[j].split(" or ");

                                for (let x = 0; x< current_or_prerequisites.length; x++){

                                    let current_edited_prereq = '';
                                    
                                    current_edited_prereq = current_or_prerequisites[x].replace("(","");
                                    current_edited_prereq = current_edited_prereq.replace (")","");
                                    current_edited_prereq = current_edited_prereq.replace ("[","");
                                    current_edited_prereq = current_edited_prereq.replace ("]","");
                                    //dealing with the error of "|" without two spaces between
                                    // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                    if (current_edited_prereq != 'none' && current_edited_prereq != '' && current_edited_prereq != null){
                            
                                        list_links.push({ source: current_edited_prereq, target: current_course , config:linkConfigOR})
                                    }


                                    final_list_seperated_prerequisites.push(current_or_prerequisites[x]);
                                }

                            }
                            else {

                                let current_edited_prereq = '';
                                    
                                current_edited_prereq = parsed_prereqs_and[j].replace("(","");
                                current_edited_prereq = current_edited_prereq.replace (")","");
                                current_edited_prereq = current_edited_prereq.replace ("[","");
                                current_edited_prereq = current_edited_prereq.replace ("]","");
                                //dealing with the error of "|" without two spaces between
                                // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                if (current_edited_prereq != 'none' && current_edited_prereq != '' && current_edited_prereq != null){
                        
                                    list_links.push({ source: current_edited_prereq, target: current_course, config:linkConfigAND})
                                }

                                final_list_seperated_prerequisites.push(parsed_prereqs_and[j]);

                            }
                            


                        }

                        //adding each of the prerequisites as nodes if they are unique

                        for (let j=0; j<final_list_seperated_prerequisites.length; j++){
                            
                            let current_edited_node = '';
                            current_edited_node = final_list_seperated_prerequisites[j].replace("(","");
                            current_edited_node = current_edited_node.replace(")", "");
                            current_edited_node = current_edited_node.replace("[", "");
                            current_edited_node = current_edited_node.replace("]", "");
                            //dealing with the error of "|" without two spaces between
                            // current_edited_node = current_edited_node.replace ("|"," and ");


                            


                            if (all_course_nodes.indexOf(current_edited_node) == -1 && current_edited_node != 'none' && current_edited_node != '' && current_edited_node != null){

                                all_course_nodes.push(current_edited_node);
                            }

                        }
                        // console.log(final_list_seperated_prerequisites);

                        


                    }

                    // console.log ("LIST OF ALL COURSE NODES");
                    // console.log (all_course_nodes);


                    //correctly formatting the nodes for the graph

                    let new_chart_data = {}

                    let list_nodes = [];
                    

                    for (let i =0; i<all_course_nodes.length; i++){

                        let h3_string = all_course_nodes[i]

                        // list_nodes.push({id: all_course_nodes[i], label: h3_string, labelType: "string", labelStyle: "font-style: italic; text-decoration: underline;", config: {style: 'fill: #afa'}});

                        list_nodes.push({id: all_course_nodes[i], label: h3_string, labelType: "string", labelStyle: "font-style: italic; text-decoration: underline;", config: {style: 'fill: #E3F09B'}});

                        // console.log (all_course_nodes[i]);
                    }

                    // for (let i =0; i<list_nodes.length; i++){

                    //     console.log(list_nodes[i]);
                    // }
                    
                    new_chart_data["nodes"] = list_nodes;
                    new_chart_data["links"] = list_links;

                    // console.log (new_chart_data);

                    setData(new_chart_data);


                    // { id: "CIS*1300", label: "<h5>CIS*1300</h5>",labelType: "html"}
                })
                .catch(err => {
                    console.log(err.code);
                    console.log(err.message);
                    console.log(err.stack);
                });

            

            }

            if (search_term_department == "" && search_term_degree == ""){
                $('#uiError').show();
            }

        } else {

            if (search_term_degree != ""){
                axios.get('https://131.104.49.103:80/searchDegreeProgramQueens?searchDegree='+search_term_degree, {
                headers: { "Access-Control-Allow-Origin": "*" }
                })
                .then((response) => {

                    console.log (response.data)

                    var listCoursesDegree = [];
                    // // console.log("What is the listCoursesDegree \n" + listCoursesDegree);

                    // // console.log (response.data["coursesInfo"]);
                    
                    for (let i = 0; i<response.data["coursesInfo"].length; i++){
                            listCoursesDegree.push (response.data["coursesInfo"][i]);
                            // console.log (response.data["coursesInfo"][i]);

                    }
                    // // console.log ("THIS IS THE LIST OF COURSES FOR SELECTED DEGREE");
                    for (let i=0; i<listCoursesDegree.length; i++){
                        console.log (listCoursesDegree[i]);
                    }

                    var all_course_nodes = [];
                    let list_links = [];

                    // //getting all the nodes for the graph from each course and prereq
                    
                    for (let i=0; i<listCoursesDegree.length; i++){

                        //adding the course to the list of nodes if it is not already there
                        if (all_course_nodes.indexOf(listCoursesDegree[i]["code"]) == -1){
                            all_course_nodes.push(listCoursesDegree[i]["code"]);
                        }

                        let current_course = listCoursesDegree[i]["code"];


                    //     //going through the prerequsites and adding them as well to the nodes list if they
                    //     //are not already there

                        console.log (listCoursesDegree[i]);

                        let current_prereqs = listCoursesDegree[i]["prereqs"];
                        console.log (current_prereqs);

                        let parsed_prereqs_and = []
                        let final_list_seperated_prerequisites = []


                    //     //splitting the prerequsiteds first by and
                        parsed_prereqs_and = current_prereqs.split(" | ");


                        for (let j = 0; j<parsed_prereqs_and.length; j++){
                            // console.log(parsed_prereqs_or[j]);

                            //now parsing by or

                            if (parsed_prereqs_and[j].includes(" or ")) {

                                let current_or_prerequisites = parsed_prereqs_and[j].split(" or ");

                                for (let x = 0; x< current_or_prerequisites.length; x++){

                                    let current_edited_prereq = '';
                                    
                                    current_edited_prereq = current_or_prerequisites[x].replace("(","");
                                    current_edited_prereq = current_edited_prereq.replace (")","");
                                    current_edited_prereq = current_edited_prereq.replace ("[","");
                                    current_edited_prereq = current_edited_prereq.replace ("]","");
                                    //dealing with the error of "|" without two spaces between
                                    // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                    if (!current_edited_prereq.includes('none') && current_edited_prereq != '' && current_edited_prereq != null){
                                        console.log("entered the if for includes links");
                                        list_links.push({ source: current_edited_prereq, target: current_course , config:linkConfigOR})
                                    }


                                    final_list_seperated_prerequisites.push(current_or_prerequisites[x]);
                                }

                            }
                            else {

                                let current_edited_prereq = '';
                                    
                                current_edited_prereq = parsed_prereqs_and[j].replace("(","");
                                current_edited_prereq = current_edited_prereq.replace (")","");
                                current_edited_prereq = current_edited_prereq.replace ("[","");
                                current_edited_prereq = current_edited_prereq.replace ("]","");
                                //dealing with the error of "|" without two spaces between
                                // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                if (current_edited_prereq != 'none' && current_edited_prereq != '' && current_edited_prereq != null){
                        
                                    list_links.push({ source: current_edited_prereq, target: current_course, config:linkConfigAND})
                                }

                                final_list_seperated_prerequisites.push(parsed_prereqs_and[j]);

                            }
                            


                        }

                    //     //adding each of the prerequisites as nodes if they are unique

                        for (let j=0; j<final_list_seperated_prerequisites.length; j++){
                            
                            let current_edited_node = '';
                            current_edited_node = final_list_seperated_prerequisites[j].replace("(","");
                            current_edited_node = current_edited_node.replace(")", "");
                            current_edited_node = current_edited_node.replace("[", "");
                            current_edited_node = current_edited_node.replace("]", "");
                            //dealing with the error of "|" without two spaces between
                            // current_edited_node = current_edited_node.replace ("|"," and ");


                            


                            if (all_course_nodes.indexOf(current_edited_node) == -1 && current_edited_node != 'none' && current_edited_node != '' && current_edited_node != null){

                                all_course_nodes.push(current_edited_node);
                            }

                        }
                    //     // console.log(final_list_seperated_prerequisites);

                        


                    }

                    console.log ("LIST OF ALL COURSE NODES");
                    console.log (all_course_nodes);


                    // correctly formatting the nodes for the graph

                    let new_chart_data = {}

                    let list_nodes = [];
                    

                    for (let i =0; i<all_course_nodes.length; i++){

                        let h3_string = all_course_nodes[i]

                        list_nodes.push({id: all_course_nodes[i], label: h3_string, labelType: "string", labelStyle: "font-style: italic; text-decoration: underline;", config: {style: 'fill: #E3F09B'}});
                        console.log (all_course_nodes[i]);


                        // console.log (all_course_nodes[i]);
                    }

                    // for (let i =0; i<list_nodes.length; i++){

                    //     console.log(list_nodes[i]);
                    // }
                    
                    new_chart_data["nodes"] = list_nodes;
                    new_chart_data["links"] = list_links;

                    console.log (new_chart_data);

                    setData(new_chart_data);
                })
                .catch(err => {
                    console.log(err.code);
                    console.log(err.message);
                    console.log(err.stack);
                });
            }
            if (search_term_department != ""){
                console.log(search_term_department)
                axios.get('https://131.104.49.103:80/?course=none&semester=none&credit=none&department=' + search_term_department + "&university=Queens", {
                headers: { "Access-Control-Allow-Origin": "*" }
                })
                .then((response) => {

                    console.log (response.data);

                    var listCoursesDegree = []

                    
                    for (let i = 0; i<response.data["departments"].length; i++){
                            listCoursesDegree.push (response.data["departments"][i]);

                    }
                    console.log ("THIS IS THE LIST OF COURSES FOR SELECTED DEGREE");
                    for (let i=0; i<listCoursesDegree.length; i++){
                        console.log (listCoursesDegree[i]);
                    }

                    var all_course_nodes = [];
                    let list_links = [];

                    //getting all the nodes for the graph from each course and prereq
                    
                    for (let i=0; i<listCoursesDegree.length; i++){

                        //adding the course to the list of nodes if it is not already there
                        if (all_course_nodes.indexOf(listCoursesDegree[i]["code"]) == -1){
                            all_course_nodes.push(listCoursesDegree[i]["code"]);
                        }

                        let current_course = listCoursesDegree[i]["code"];

                        //going through the prerequsites and adding them as well to the nodes list if they
                        //are not already there

                        let current_prereqs = listCoursesDegree[i]["prereqs"];
                        // console.log (current_prereqs);

                        let parsed_prereqs_and = []
                        let final_list_seperated_prerequisites = []


                        //splitting the prerequsiteds first by and
                        parsed_prereqs_and = current_prereqs.split(" | ");


                        for (let j = 0; j<parsed_prereqs_and.length; j++){
                            // console.log(parsed_prereqs_or[j]);

                            //now parsing by or

                            if (parsed_prereqs_and[j].includes(" or ")) {

                                let current_or_prerequisites = parsed_prereqs_and[j].split(" or ");

                                for (let x = 0; x< current_or_prerequisites.length; x++){

                                    let current_edited_prereq = '';
                                    
                                    current_edited_prereq = current_or_prerequisites[x].replace("(","");
                                    current_edited_prereq = current_edited_prereq.replace (")","");
                                    current_edited_prereq = current_edited_prereq.replace ("[","");
                                    current_edited_prereq = current_edited_prereq.replace ("]","");
                                    //dealing with the error of "|" without two spaces between
                                    // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                    if (current_edited_prereq != 'none' && current_edited_prereq != '' && current_edited_prereq != null){
                            
                                        list_links.push({ source: current_edited_prereq, target: current_course , config:linkConfigOR})
                                    }


                                    final_list_seperated_prerequisites.push(current_or_prerequisites[x]);
                                }

                            }
                            else {

                                let current_edited_prereq = '';
                                    
                                current_edited_prereq = parsed_prereqs_and[j].replace("(","");
                                current_edited_prereq = current_edited_prereq.replace (")","");
                                current_edited_prereq = current_edited_prereq.replace ("[","");
                                current_edited_prereq = current_edited_prereq.replace ("]","");
                                //dealing with the error of "|" without two spaces between
                                // current_edited_prereq = current_edited_prereq.replace ("|"," and ");

                                if (current_edited_prereq != 'none' && current_edited_prereq != '' && current_edited_prereq != null){
                        
                                    list_links.push({ source: current_edited_prereq, target: current_course, config:linkConfigAND})
                                }

                                final_list_seperated_prerequisites.push(parsed_prereqs_and[j]);

                            }
                            


                        }

                        //adding each of the prerequisites as nodes if they are unique

                        for (let j=0; j<final_list_seperated_prerequisites.length; j++){
                            
                            let current_edited_node = '';
                            current_edited_node = final_list_seperated_prerequisites[j].replace("(","");
                            current_edited_node = current_edited_node.replace(")", "");
                            current_edited_node = current_edited_node.replace("[", "");
                            current_edited_node = current_edited_node.replace("]", "");
                            //dealing with the error of "|" without two spaces between
                            // current_edited_node = current_edited_node.replace ("|"," and ");


                            


                            if (all_course_nodes.indexOf(current_edited_node) == -1 && current_edited_node != 'none' && current_edited_node != '' && current_edited_node != null){

                                all_course_nodes.push(current_edited_node);
                            }

                        }
                        // console.log(final_list_seperated_prerequisites);

                        


                    }

                    // console.log ("LIST OF ALL COURSE NODES");
                    // console.log (all_course_nodes);


                    //correctly formatting the nodes for the graph

                    let new_chart_data = {}

                    let list_nodes = [];
                    

                    for (let i =0; i<all_course_nodes.length; i++){

                        let h3_string = all_course_nodes[i]

                        // list_nodes.push({id: all_course_nodes[i], label: h3_string, labelType: "string", labelStyle: "font-style: italic; text-decoration: underline;", config: {style: 'fill: #afa'}});

                        list_nodes.push({id: all_course_nodes[i], label: h3_string, labelType: "string", labelStyle: "font-style: italic; text-decoration: underline;", config: {style: 'fill: #E3F09B'}});

                        // console.log (all_course_nodes[i]);
                    }

                    // for (let i =0; i<list_nodes.length; i++){

                    //     console.log(list_nodes[i]);
                    // }
                    
                    new_chart_data["nodes"] = list_nodes;
                    new_chart_data["links"] = list_links;

                    // console.log (new_chart_data);

                    setData(new_chart_data);
                })
                .catch(err => {
                    console.log(err.code);
                    console.log(err.message);
                    console.log(err.stack);
                });

            }
            
            if (search_term_department == "" && search_term_degree == ""){
                $('#uiError').show();
            }
        }

        // setData(newchart)
    }

    const onNodeClickFunction = (e) => {
        // console.log("This is the e returned when clicked");
        // console.log (e);

        console.log ("This should be the node");
        console.log (e.d3node);

        let node_label = e.d3node["label"];

        //testing recursive function to get all connected courses
        let list_courses_test = [];
        list_courses_test = getConnectedCourses (node_label, list_courses_test);

        // console.log ("This is a test of the list of courses recursion")
        // console.log (list_courses_test);

        

        //iterating through each of the links to determine what nodes are connected to the selected one

        let list_connected_courses = list_courses_test;



        console.log (list_connected_courses);

        //iterating through the nodes and changing the color of courses that can't be taken

        let temp_data = data;

        for(let j=0; j<temp_data.nodes.length; j++) {

            temp_data.nodes[j]["config"] = {style: 'fill: #E3F09B'}

            if(list_connected_courses.length == 0 && temp_data.nodes[j]["label"] === node_label) {
                temp_data.nodes[j]["config"] = {style: 'fill: #E1916E'}
            }
        }

        for (let i=0; i<list_connected_courses.length; i++){

            for (let j=0; j<temp_data.nodes.length; j++){

                if (temp_data.nodes[j]["label"] === list_connected_courses[i]){

                    temp_data.nodes[j]["config"] = {style: 'fill: #F7D08A'}
                }

                if (temp_data.nodes[j]["label"] === node_label){

                    temp_data.nodes[j]["config"] = {style: 'fill: #E1916E'}
                }
            }


        }

        setData ({nodes: [], links: []});
        setData (temp_data);



    }

    const getConnectedCourses = (course_label, list_courses) => {

        // console.log ("Entered the function getConnectedCourses");

        let new_courses = []

        for (let i = 0; i<data.links.length; i++){

            if (data.links[i]["source"] == course_label && list_courses.indexOf(data.links[i]["target"]) == -1){
                list_courses.push(data.links[i]["target"]);
                new_courses.push(data.links[i]["target"]);
                // console.log("entered the -1 in recursion");
            }


        }

        for (let i=0; i<new_courses.length; i++){

            list_courses = getConnectedCourses (new_courses[i], list_courses);
        }

        return list_courses;

    }

    return(
        <div className="container-fluid">
            <Row>
                <Col sm={2} style={searchStyle}>
                    <Row>
                        <h2>Search Settings</h2>
                        <Form style={{textAlign:'left', padding:'15px'}}>
                            <Form.Group className="mb-2">
                                <Form.Label htmlFor='universitySelect'>University</Form.Label>
                                <Form.Select id="universitySelect" onChange={handleUniSelect}>
                                    <option></option>
                                    <option>University of Guelph</option>
                                    <option>Queens University</option>
                                </Form.Select>
                            </Form.Group>
                            <div className="alert alert-warning collapse" role="alert" id="uniError">Please select a university.</div>
                            <Form.Group className="mb-2">
                                <Form.Label htmlFor='courseSelect'>Department</Form.Label>
                                <Form.Select disabled={searchDegree} id="courseSelect" onChange={handleCourseSelect}>
                                    <option></option>
                                    {courses.map((course, index) => (
                                        <option key={index}>{course}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label htmlFor='degreeSelect'>Degree</Form.Label>
                                <Form.Select disabled={searchCourse} id="degreeSelect" onChange={handleDegreeSelect}>
                                    <option></option>
                                    {degrees.map((degree, index) => (
                                        <option key={index}>{degree}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <div className="alert alert-warning collapse" role="alert" id="uiError">Please select an department or degree.</div>
                            <Stack direction="horizontal" gap={3} width="100px">
                                <button type="button" className="btn btn-primary" onClick={submitSearch}>Submit</button>
                                <button type="button" className="btn btn-secondary" onClick={clearInfo}>Clear</button>
                            </Stack>
                            
                        </Form>

                        <Container style={{padding:'15px'}}>
                        <Card>
                            <Card.Header>Legend</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                Black arrows indicate "and"<br></br>
                                Blue arrows indicate "or"<br></br>
                                Red circles indicate selected course<br></br>
                                Orange circles indicate courses that can't be taken
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        </Container>
                    </Row>
                    <Row>
                        
                    </Row>
                </Col>

                <Col>
                    <DagreGraph
                        nodes={data.nodes}
                        links={data.links}
                        options={{
                            rankdir: 'LR',
                            align: 'UL',
                            ranker: 'tight-tree'
                        }}
                        width={'100%'}
                        height={'calc(100vh - 64px)'}
                        animate={1000}
                        shape='circle'
                        fitBoundaries="true"
                        zoomable
                        onNodeClick={onNodeClickFunction}
                        onRelationshipClick={e => console.log(e)}
                    />
                </Col>

            </Row>
        </div>
    )

}

export default GraphSearch