import React, { Component, useState,useEffect } from 'react';
import cookie from 'react-cookies'
import { useHistory  } from 'react-router-dom'


function Signup(){
    const [email,setemail] = useState()
    const [username,setusername] = useState()
    const [firstname,setfirstname] = useState()
    const [lastname,setlastname] = useState()
    const [password,setpassword] = useState()
    const [confirmation,setconfirmation] = useState()
    const h = useHistory()

    function submit(){
        console.log("submit")
        if(cookie.load("t")!==""){
            
        }
        if(confirmation !== password ){
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
        console.log(re)
        if(password===undefined|| password===""){
            alert("Password field can not be empty")
            return 1
        }else if(username===undefined||username===""){
            alert("username field can not be empty")
            return 1
        }else if(firstname===undefined||firstname===""){
            alert("firstname field can not be empty")
            return 1
        }else if(lastname===undefined||lastname===""){
            alert("lastname field can not be empty")
            return 1
        }else if(email===undefined||email===""){
            alert("email field can not be empty")
            return 1
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
                h.push("/account")
            }else if(data.email){
                alert(data.email)
            }else if(data.username){
                alert(data.username)

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
        <h2> <a href="/login">Already have a account?</a></h2>

        <ul>
            <li>
            <label>Email</label>
            <input type="email" onChange={event => setemail(event.target.value)}></input>
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
            <input type="password" onChange={event => setpassword(event.target.value)}></input>
            </li>
            <li>
            <label>Confirm Password</label>
            <input type="password" onChange={event => setconfirmation(event.target.value)}></input>
            </li>
        </ul>
        <div>
            <button onClick={submit}>
                Sign Up
            </button>
            <button><a href="/">back</a></button>
        </div>
        </>
    );
}
export default Signup;