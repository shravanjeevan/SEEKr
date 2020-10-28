import React, { Component, useState,useEffect } from 'react';
import { render } from 'react-dom';
import cookie from 'react-cookies'
import { useHistory  } from 'react-router-dom'


function Login(t){
    const [username,setusername] = useState()
    const [password,setpassword] = useState()
    const [token,settoken] = useState()
    var show = "visible"
    const h = useHistory()

    useEffect(() =>{        
        console.log(cookie.load("t"))
        console.log(username)
        console.log(password)

    }

    )
    function submit(){
        var re={
            "username": username,
            "password": password
        }
        
        if(username===""||password===""||username===undefined||password===undefined){
            alert("Username or Password can not be empty")
            return 
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
                alert("Successful log in")
                h.push("/account")
            }else{
                alert(data.non_field_errors[0])
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
        <h2> <a href="/register"> Does not have a account?</a></h2>
        <label>User Name</label>
        <input onChange={event =>setusername(event.target.value)}></input>
        <label>Password</label>
        <input onChange={event => setpassword(event.target.value)}></input>
        <button onClick={submit}>
            Sign in
        </button>
        {token}</div>
        <button><a href="/">back</a>
                
                </button>
        </>
    )


}
export default Login;
