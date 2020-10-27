import React, { Component, useState,useEffect } from 'react';
import cookie from 'react-cookies'


function Signup(){
    const [email,setemail] = useState()
    const [username,setusername] = useState()
    const [firstname,setfirstname] = useState()
    const [lastname,setlastname] = useState()
    const [password,setpassword] = useState()
    const [confirmation,setconfirmation] = useState()

    function submit(){
        if(cookie.load("t")!==""){
            return(<></>)
        }
        if(confirmation != password){
            alert("confirmation should be same as password")
            return 1
        }
        var re = {
            "username": username,
            "password": confirmation,
            "email": email,
            "first_name": firstname,
            "last_name": lastname
        }
        fetch('http://127.0.0.1:8000/user/register/',{method:"post",
        body:JSON.stringify(re),
        headers: {
                'Content-Type':'application/json'
        }
        
    }).then(res => res.json()).then((data =>{
            console.log(data)
            if(data.message ){
                alert("Successful sign up")
            }
        })).
        catch(error => {
            if (error.status === 404) {
                console.log(error.status + error.statusText)
            } else if (error.status === 403) {
                console.log(error.status + error.statusText)
            }
        })
    }

    return(
        <>
        <h1>SignUP </h1>
        <ul>
            <li>
            <label>Email</label>
            <input onChange={event => setemail(event.target.value)}></input>
            </li>
            <li>
            <label>User Name</label>
            <input onChange={event =>setusername(event.target.value)}></input>
            </li>
            <li>
            <label>First Name</label>
            <input onChange={event => setfirstname(event.target.value)}></input>
            </li>
            <li>
            <label>Last Name</label>
            <input onChange={event => setlastname(event.target.value)}></input>
            </li>
            <li>
            <label>Password</label>
            <input onChange={event => setpassword(event.target.value)}></input>
            </li>
            <li>
            <label>Confirm Password</label>
            <input onChange={event => setconfirmation(event.target.value)}></input>
            </li>
        </ul>
        <div>
            <button onClick={submit}>
                Sign Up
            </button>
            
        </div>
        </>
    );
}
export default Signup;