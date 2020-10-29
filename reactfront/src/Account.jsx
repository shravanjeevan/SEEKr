import React, { Component, useState,useEffect } from 'react';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory  } from 'react-router-dom'


function Account(){
    const h = useHistory()
    const [token,settoken] = useState()
    var [username,setusername] =useState()
    var [email,setemail] = useState()
    var [firstname,setfirstname] = useState()
    var [lastname,setlastname] = useState()


    useEffect(()=>{
        settoken( cookies.load("t"))
        if (cookies.load("t")===""||cookies.load("t")===undefined){
            h.push("/login")
        }
        console.log(cookies.load("t"))
        fetch('http://127.0.0.1:8000/user/info/',{method:"get",
            headers: {
                    'Content-Type':'application/json',
                    'Authorization': "Token "+ cookies.load("t")
            }    
        }).then(res => res.json()).then((data =>{
                console.log(data)
                setusername(data.username)
                setfirstname(data.first_name)
                setlastname(data.last_name)
                setemail(data.email)

            })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    },[])
    function submit(){
        
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
    <div>USER NAME: {username}</div>
    <div>FIRST NAME: {firstname}</div>
    <div>LAST NAME: {lastname}</div>
    <div>EMAIL: {email}</div>
    <button onClick={submit} > get</button>
    
    <button onClick={logout}> Log out </button>
    <button><a href="/">back</a></button>
    </>
    
    )
}

export default Account;