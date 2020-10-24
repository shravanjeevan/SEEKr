import React, { Component, useState,useEffect } from 'react';
import { render } from 'react-dom';
import cookie from 'react-cookies'


function Login(t){
    const [username,setusername] = useState()
    const [password,setpassword] = useState()
    const [token,settoken] = useState()
    var show = "visible"

    useEffect(() =>{        
        console.log(cookie.load("t"))
    }

    )
    function submit(){
        var re={
            "username": username,
            "password": password
        }
        fetch('http://127.0.0.1:8000/auth/login',{method:"post",
        body:JSON.stringify(re),
        headers: {
                'Content-Type':'application/json'
        }
        
    }).then(res => res.json()).then((data =>{
            console.log(data)
            if(data.token ){
                settoken(data.token)
                cookie.remove("t",token,{path:"/"})
                cookie.save("t",data.token,{path:"/"})
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
        <div id="loginbox" >        
        <h1>Sign in</h1>
        <label>User Name</label>
        <input onChange={event =>setusername(event.target.value)}></input>
        <label>Password</label>
        <input onChange={event => setpassword(event.target.value)}></input>
        <button onClick={submit}>
            Sign in
        </button>
        {token}</div>

        </>
    )


}
export default Login;
