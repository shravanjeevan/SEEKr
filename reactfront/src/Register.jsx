import React, { Component, useState } from 'react';


function Signup(){
    const [email,setemail] = useState()
    function submit(){
        fetch('127.0.0.1:8000/skills/add/',{method:"get"}).then(res => res.json()).then((data =>{
            console.log(data)
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
            <input></input>
            </li>
            <li>
            <label>First Name</label>
            <input></input>
            </li>
            <li>
            <label>Last Name</label>
            <input></input>
            </li>
            <li>
            <label>Password</label>
            <input></input>
            </li>
            <li>
            <label>Confirm Password</label>
            <input></input>
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