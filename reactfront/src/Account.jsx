import React, { Component, useState,useEffect } from 'react';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory  } from 'react-router-dom'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import './styles.css'

function Account(){
    const h = useHistory()
    const [token,settoken] = useState()
    const [username,setusername] =useState()
    const [email,setemail] = useState()
    const [firstname,setfirstname] = useState()
    const [lastname,setlastname] = useState()
    const [accountstatus,setaccountstatus] = useState()
    const [accountsetup,setaccountsetup] = useState()
    const closeModal = () => setaccountsetup(false);
    const [type,settype] = useState()
    const [uid,setuid] = useState()
    const [latitude,setlatitude] = useState()
    const [longtitude,setlongtitude] = useState()
    const [description,setdescription] = useState()
    const [edu,setedu]=useState()


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
                setusername(data.account.username)
                setfirstname(data.account.first_name)
                setlastname(data.account.last_name)
                setemail(data.account.email)
                setuid(data.account.id)
                if(Object.keys(data.company).length !== 0){
                    setaccountstatus("Company account")
                    setaccountsetup(false)

                }
                else if(Object.keys(data.seekr).length !== 0){
                    setaccountstatus("Seeker account")
                    setaccountsetup(false)

                }else{
                    setaccountstatus("Account not set up")
                    setaccountsetup(true)

                }


            })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    },[])

    // useEffect(()=>{
    //     if(accountstatus === "Account not set up"){
    //         setaccountsetup(true)
    //     }else{
   //         setaccountsetup(false)
    //     }
    //     console.log(accountsetup)
    // })
    function fancyfuntion(){

    }

    
    function accounttype(){
        if(type === "company"){
            return(<div>
                <label>company</label><br></br>        
                <button onClick={save}>Save</button>
                </div>)
        }else if(type === "seekr"){
            return(<div>
                <label>seekr Detail</label><br></br>
                latitude <input onChange={event=>setlatitude(event.target.value)}/>    
                longtitude <input onChange={event=>setlongtitude(event.target.value)}/>    <br></br>
                Description <br></br> <textarea onChange={event=>setdescription(event.target.value)}/>   <br></br>
                Education <input onChange={event=>setedu(event.target.value)}/>    <br></br>
                <button onClick={save}>Save</button>
                </div>)
        }else{
            return(<div>Select an account type to do next</div>)
        }
    }

    function submit(){
        setaccountsetup(true)
    }

    function save(){
        if(type === "company"){

        }else if(type === "seekr"){
            var r = {
                "UserId":uid,
                "Description":description,
                "Education":edu,
                "Longitude":longtitude,
                "Latitude":latitude
            }
            console.log(r)
            fetch('http://127.0.0.1:8000/job_seeker/details/',{method:"post",
                headers: {
                    'Content-Type':'application/json',
                    'Authorization': "Token "+ token
                },
                body:JSON.stringify(r)
            }).then(res => res.json()).then((data =>{
                if(data.Latitude==="A valid number is required."||data.Longtitude==="A valid number is required."){
                    alert("Latitude and Longtitude must be numbers")
                }else{
                    closeModal()
                    window.location.reload(false)
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
    <div>Account status: {accountstatus} </div>

    {fancyfuntion()}
    <button onClick={logout}> Log out </button>
    <button><a href="/">back</a></button>
    
    <Popup position="right center" open={accountsetup} modal nested onClose={closeModal}>

        <div className="header">Set your account now</div>
        <div className="modal">
            <a className="close" onClick={closeModal}>
                &times;
            </a>
        </div>
        <form>
                <input type='radio' name="account type" onChange={()=>settype("company") } /> Comapny
                <input type='radio' name="account type"onChange={()=>settype("seekr")}/> Job Seekr

        </form>
        {accounttype()}



    </Popup>
    <Modal isOpen={accountstatus==="Account not set up"} >

        <ModalHeader>set up your account now</ModalHeader>
        <ModalBody>
        <button onClick={submit} > Set up now</button>

        </ModalBody>

        </Modal>


    </>
    
    )
}

export default Account;