import React, { Component } from 'react'
import Table from 'react-bootstrap/Table'
import { Col, Container } from 'react-bootstrap'
import { Row } from 'react-bootstrap'
import { Stack } from 'react-bootstrap'
import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import $ from 'jquery';

const UniversitySearch = () => {

    const [departments, setDepartments] = useState(
        [""]
    )

    const [semesterVisible, setSemesterVisible] = useState (false);

    const [departmentInput, setdepartmentInput] = useState ("")
    const [courseInput, setcourseInput] = useState ("")
    const [semesterInput, setsemesterInput] = useState ("")
    const [creditInput, setcreditInput] = useState ("")
    const [universityInput, setuniversityInput] = useState ("")

    function hideAlerts() {

        $('#creditError').hide();
        $('#courseError').hide();
        $('#noFindError').hide();
        $('#uniError').hide();
        $('#departmentError').hide();
    
    }

    const handleUniSelect = (e) => {
        setuniversityInput(e.target.value)

        if (e.target.value === 'University of Guelph') {

            setSemesterVisible (false);

            axios.get('https://131.104.49.103:80/departmentlist?getlist=guelph', {
            headers: { "Access-Control-Allow-Origin": "*" }
            })
            .then((response) => {
                
                
                console.log(response.data['departments'])
                var departmentNames = []

                for (let i=0; i<response.data['departments'].length; i++ ){
                    departmentNames.push (response.data['departments'][i])
                }

                console.log(departmentNames)

                setDepartments(departmentNames)
                
            })
            .catch(err => {
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            });
        } else if (e.target.value == 'Queens University'){
            setSemesterVisible (true);
            $("#semesterTextInput").val('');
            setsemesterInput ("");

            axios.get('https://131.104.49.103:80/departmentlistqueens?getlist=queens', {
            headers: { "Access-Control-Allow-Origin": "*" }
            })
            .then((response) => {
                
                
                console.log(response.data['departments'])
                var departmentNames = []

                for (let i=0; i<response.data['departments'].length; i++ ){
                    departmentNames.push (response.data['departments'][i])
                }

                console.log(departmentNames)

                setDepartments(departmentNames)
                
            })
            .catch(err => {
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            });
        } else {
            var departmentNames = []
            setDepartments(departmentNames)
        }
    }

    var corsesFormatedForTable = []

    const [courses, setCourses] = useState([])

    const tableStyle = {
        marginTop: '50px',
    };

    const clearInfo = () => {
        setdepartmentInput('');
        setcourseInput('');
        setsemesterInput('');
        setcreditInput('');
        setuniversityInput('');
        $("#universitySelect").val('');
        $("#departmentSelect").val('');
        $("#coursecodeTextInput").val('');
        $("#semesterTextInput").val('');
        $("#creditTextInput").val('');
        setSemesterVisible (false);
        hideAlerts();
        setCourses([]);
    }

    const submitSearch = (event) => {

        hideAlerts();

        console.log(courseInput)
        console.log(semesterInput)
        console.log(creditInput)
        console.log(universityInput)
        
        let departmentLocalInput = departmentInput.trim()
        let courseLocalInput = courseInput.trim()
        let semesterLocalInput = semesterInput.trim()
        let creditLocalInput = creditInput.trim()
        let valid = true
        let uni = true

        if (!universityInput || universityInput == null) {
            $('#uniError').show();
            valid = false
            uni = false
        }
        if (!departmentLocalInput || departmentLocalInput == null) {
            departmentLocalInput = "none"
        }
        if (!courseLocalInput || courseLocalInput == null) {
            courseLocalInput = "none"
        } else if(uni) {

            if (departmentLocalInput === "none") {
                valid=false
                $('#departmentError').show()
            } else {
                if( (courseLocalInput.length !== 4 || isNaN(courseLocalInput)) && universityInput === "University of Guelph") {
                    $('#courseError').show();
                    valid = false;
                }else if ( (courseLocalInput.length !== 3 || isNaN(courseLocalInput)) && universityInput === "Queens University") {
                    $('#courseError').show();
                    valid = false;
                } else {
                    let tempCourse = courseLocalInput
                    courseLocalInput = (departmentLocalInput.substring(departmentLocalInput.indexOf("(") + 1,departmentLocalInput.indexOf(")"))).concat("*")
                    courseLocalInput = courseLocalInput.concat(tempCourse)
		    console.log(courseLocalInput)
                }
            }
        }
        if (!semesterLocalInput || semesterLocalInput == null) {
            semesterLocalInput = "none"
        }
        if (!creditLocalInput || creditLocalInput == null && parseFloat(creditLocalInput) != 0) {
            creditLocalInput = "none"
        } else if(universityInput === "University of Guelph") {

            if (parseFloat(creditLocalInput) == 0) {
                creditLocalInput = "0.00";
            } else if (parseFloat(creditLocalInput) == 0.25) {
                creditLocalInput = "0.25"
            } else if (parseFloat(creditLocalInput) == 0.5) {
                creditLocalInput = "0.50"
            } else if (parseFloat(creditLocalInput) == 0.75) {
                creditLocalInput = "0.75"
            } else if (parseFloat(creditLocalInput) == 1) {
                creditLocalInput = "1.00"
            } else if (parseFloat(creditLocalInput) == 2) {
                creditLocalInput = "2.00"
            } else {
                $('#creditError').show();
                valid = false
            }
            
        }
        else if(universityInput === "Queens University") {

            if (parseFloat(creditLocalInput) == 0) {
                creditLocalInput = "0.00";
            } else if (parseFloat(creditLocalInput) == 3) {
                creditLocalInput = "3.00"
            } else if (parseFloat(creditLocalInput) == 6) {
                creditLocalInput = "6.00"
            } else if (parseFloat(creditLocalInput) == 9) {
                creditLocalInput = "9.00"
            } else if (parseFloat(creditLocalInput) == 12) {
                creditLocalInput = "12.00"
            } else if (parseFloat(creditLocalInput) == 15) {
                creditLocalInput = "15.00"
            } else if (parseFloat(creditLocalInput) == 18) {
                creditLocalInput = "18.00"
            } else {
                $('#creditError').show();
                valid = false
            }
            
        }

        if (valid) {
            // console.log('https://131.104.49.103:80/?course=' + courseLocalInput + '&semester=' +semesterLocalInput +'&credit=' + creditLocalInput + '&department=' + departmentLocalInput + '&university=' + universityInput)
            console.log('&university=' + universityInput)
           
            axios.get('https://131.104.49.103:80/?course=' + courseLocalInput + '&semester=' +semesterLocalInput +'&credit=' + creditLocalInput + '&department=' + departmentLocalInput + '&university=' + universityInput, {
            headers: { "Access-Control-Allow-Origin": "*" }})
            .then((response) => {
                console.log(response.data);
                var listFoundCourses = response.data['departments'];
                console.log(typeof(listFoundCourses));
                console.log (listFoundCourses);
                console.log (listFoundCourses[4]);

                corsesFormatedForTable = [];
                
                for (let i=0; i<listFoundCourses.length; i++ ){
                    corsesFormatedForTable.push ([listFoundCourses[i]["code"], listFoundCourses[i]["name"], listFoundCourses[i]["semester"], listFoundCourses[i]["credit"]])
                }

                if(corsesFormatedForTable.length == 0) {
                    $('#noFindError').show();
                }

                setCourses (corsesFormatedForTable)

            })
            .catch(err => {
                console.log(err.code);
                console.log(err.message);
                console.log(err.stack);
            });
        }

    }

    return (
        <div className="container-fluid" style={{padding: '30px'}}>
            <h2>University Course Search</h2>
            <Container style={{border:'1px solid #cecece', width: '75%', textAlign:'left', padding:'15px'}}>

                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label htmlFor='universitySelect'>University</Form.Label>
                        <Form.Select id="universitySelect" onChange={handleUniSelect}>
                            <option></option>
                            <option>University of Guelph</option>
                            <option>Queens University</option>
                        </Form.Select>
                    </Form.Group>
                    <div className="alert alert-warning collapse" id="uniError">No university was selected</div>
                    <Row className='mb-2'>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor='departmentSelect'>Department</Form.Label>
                                <Form.Select id='departmentSelect' onChange={(e) => setdepartmentInput(e.target.value)}>
                                    <option></option>
                                    {departments.map((department, index) => (
                                        <option key={index}>{department}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <div className="alert alert-warning collapse" id="departmentError">Department must be selected</div>
                        </Col>
                        <Col>
                            <Form.Group>
                                <Form.Label htmlFor='coursecodeTextInput'>Course Code</Form.Label>
                                <Form.Control id='coursecodeTextInput' placeholder='Example: "1300"' onChange={(e) => setcourseInput(e.target.value)}/>
                            </Form.Group>

                            <div className="alert alert-warning collapse" id="courseError">Invalid course code entry</div>
                        </Col>
                    </Row>

                    <Form.Group className='mb-2'>
                        <Form.Label htmlFor='semesterTextInput'>Semester</Form.Label>
                        <Form.Select id="semesterTextInput" disabled={semesterVisible} onChange={(e) => setsemesterInput(e.target.value)}>
                            <option></option>
                            <option>Fall</option>
                            <option>Winter</option>
                            <option>Summer</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className='mb-4'>
                    <Form.Label htmlFor='creditTextInput'>Credit</Form.Label>
                        <Form.Control id='creditTextInput' placeholder='Example: "0.5"' onChange={(e) => setcreditInput(e.target.value)}/>
                    </Form.Group>
                    <div className="alert alert-warning collapse" id="creditError">Invalid credit entry</div>
                    
                    <Stack direction="horizontal" gap={3} width="100px">
                     
                            <button type="button" className="btn btn-primary btn-block" onClick={submitSearch}>Submit</button>
                            <button type="button" className="btn btn-secondary btn-block" onClick={clearInfo}>Clear</button>
                        
                        
                    </Stack>
                    
                </Form>

            </Container>

            <Container style={tableStyle}>
                <Row className="justify-content-md-center">
                    <div className="alert alert-warning collapse" role="alert" id="noFindError">No courses found</div>
                    <Table striped bordered hover style={{ fontSize: 20, alignItems: 'center', width: '85%'}}>
                        <thead>
                            <tr>
                                <th>Course</th>
                                <th>Course Name</th>
                                <th>Semester</th>
                                <th>Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                courses.map((course, index) => (
                                    <tr key={index}>
                                        <td>{course[0]}</td>
                                        <td>{course[1]}</td>
                                        <td>{course[2]}</td>
                                        <td>{course[3]}</td>
                                    </tr>
                                ))
                            }
                        </tbody>


                    </Table>
                </Row>
            </Container>
        </div>

    )
}

export default UniversitySearch
