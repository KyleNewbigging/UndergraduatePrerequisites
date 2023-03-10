import React, { Component } from 'react'
import { useState } from 'react'
import $ from 'jquery';
import axios from 'axios';
import background from "./img/bg.png";


function Home() {

  const [showMessage, setShowMessage] = useState([
    false
  ])

  const [firstFlaskMessage, setFirstFlaskMessage] = useState([
    "DEFAULT"
  ])


  // this function is an example of how to do a JQuery to our flask server
  const flaskDemoFunc = () => {

    //   var demo_data;

    //   // make ajax calls syncronous
    //   $.ajaxSetup({ async: false });

    //   $.ajax({
    //     // type: 'get',            //Request type
    //     dataType: 'text',       //Data type - we will use JSON for almost everything
    //     url: "https://131.104.49.103:8443/",   //The server endpoint we are connecting to
    //     data: {
    //       data1: "Value 1",
    //       data2: 1234.56
    //     },
    //     success: function (data) {
    //         /*  Do something with returned object
    //             Note that what we get is an object, not a string,
    //             so we do not need to parse it on the server.
    //             JavaScript really does handle JSONs seamlessly
    //         */
    //         //We write the object to the console to show that the request was successful
    //         // console.log(data);
    //         demo_data = data;



    //       },
    //       fail: function (error) {
    //         // Non-200 return, do something with error
    //         // $('#blah').html("On page load, received error from server");
    //         console.log("There was an error it is: /n " + error);
    //       }
    //     });

    axios.get('https://131.104.49.103:80/', {
      headers: { "Access-Control-Allow-Origin": "*" }
    })
      .then((response) => {
        console.log(response);
        setFirstFlaskMessage(response.data);
        setShowMessage(!showMessage);


      })
      .catch(err => {
        console.log(err.code);
        console.log(err.message);
        console.log(err.stack);
      });


    //     console.log(demo_data);
    //     setFirstFlaskMessage(demo_data);
    //     setShowMessage(!showMessage);

  }





  return (
    <div style={{padding: '30px'}}>
      {/* <h2>Home</h2>
      <div>
        <button type="button" className="btn btn-primary" onClick={flaskDemoFunc}>Flask Test</button>
        <p hidden={showMessage}>{firstFlaskMessage}</p>
      </div>
    */}
      <div style={{padding: '100px'}}>
        Navigate to the Course Search or Graph Search tab to begin searching.
      </div>
    </div>
  )
}
//, backgroundImage: `url(${background})`
export default Home;
