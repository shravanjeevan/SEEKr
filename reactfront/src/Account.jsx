import React, { Component, useState,useEffect } from 'react';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory  } from 'react-router-dom'


function Account(){
    const h = useHistory()
    const [token,settoken] = useState()

    useEffect(()=>{
        settoken( cookies.load("t"))
        if (cookies.load("t")===""||cookies.load("t")===undefined){
            h.push("/login")
        }

    })
    function submit(){
        fetch('http://127.0.0.1:8000/user/info/',{method:"get",
        headers: {
                'Content-Type':'application/json',
                'Authorization': "Token "+ token
        }
        
    }).then(res => res.json()).then((data =>{
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

    function logout(){
        fetch('http://127.0.0.1:8000/auth/logout',{method:"post",
        headers: {
                'Content-Type':'application/json',
                'Authorization': "Token "+ token
        }
        
    }).then(res => res.json()).then((data =>{
            console.log(data)

        })).
        catch(error => {
            if (error.status === 404) {
                console.log(error.status + error.statusText)
            } else if (error.status === 403) {
                console.log(error.status + error.statusText)
            }
        })
        cookies.remove("t", { domain: "localhost", path: '/' })
        h.push('/login')
    }
    return(<>
    <button onClick={submit} > get</button>
    
    <button onClick={logout}> Log out </button>
    </>
    )
}

export default Account;