import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory } from 'react-router-dom'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Add, Feedback } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import SelectSearch from 'react-select-search';
import "./lumen.css"

function Matchlist() {
    const h = useHistory()
    const [userdata, setuserdata] = useState()
    const [joblist, setjoblist] = useState()
    const [visibleterm, setvisibleterm] = useState(20)
    const [feedbacktoggle, setfeedbacktoggle] = useState(false)
    const [feedback, setfeedback] = useState()
    const [detailtoggle, setdetailtoggle] = useState(false)
    const [detail,setdetail] = useState()


    useEffect(() => {
        if (cookies.load("t") === "" || cookies.load("t") === undefined) {
            h.push("/signin")
        }
        fetch('http://127.0.0.1:8000/user/info/', {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + cookies.load("t")
            }
        }).then(res => res.json()).then((data => {
            console.log(data)
            setuserdata(data.account.id)
            fetch('http://localhost:8000/job_match/list/' + data.account.id, {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + cookies.load("t")
                }
            }).then(res => res.json()).then((data => {
                console.log(data)
                setjoblist(data.list)


            })).
                catch(error => {
                    if (error.status === 404) {
                        console.log(error.status + error.statusText)
                    } else if (error.status === 403) {
                        console.log(error.status + error.statusText)
                    }
                })
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })

    }, [])

    function applyjob(item, status) {
        console.log(item)
        console.log(userdata)
        var r = {
            "UserId": userdata,
            "JobListingId": item.job.JobListingId,
            "Status": status
        }
        fetch('http://localhost:8000/job_match/status/update', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + cookies.load("t")
            },
            body: JSON.stringify(r)
        }).then(res => res.json()).then((data => {
            console.log(data)
            fetch('http://localhost:8000/job_match/list/' + userdata, {
                method: "get",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + cookies.load("t")
                }
            }).then(res => res.json()).then((data => {
                console.log(data)
                setjoblist(data.list)
            })).
                catch(error => {
                    if (error.status === 404) {
                        console.log(error.status + error.statusText)
                    } else if (error.status === 403) {
                        console.log(error.status + error.statusText)
                    }
                })
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })


    }


    function renderfeedback(item) {
        setfeedbacktoggle(!feedbacktoggle)
        fetch('http://localhost:8000/job_match/feedback/' + item.job.id, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + cookies.load("t")
            }
        }).then(res => res.json()).then((data => {
            //console.log(data)
            setfeedback(data)
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })

    }

    function renderdetail(item){
        setdetailtoggle(!detailtoggle)
        setdetail(item)
    }

    function rendertable() {
        console.log(joblist)
        if (!joblist) {
            return (<>
                loading
            </>)
        } else {

            var table = joblist.slice(visibleterm-20,visibleterm)
            //console.log(table)
            return (<>
                <button onClick={() => setvisibleterm(visibleterm - 20)} type="button" class="btn btn-primary btn-lg" > previous </button>
                <button onClick={() => setvisibleterm(visibleterm + 20)} type="button" class="btn btn-primary btn-lg" > next </button>

                <table class="table table-hover">
                    <thead >
                        <tr>
                            <td>Job Name</td>
                            <td>Company</td>

                            <td>Salary</td>

                            <td>JobListingId</td>
                            <td>PercentageMatch</td>
                            <td>Status</td>
                            <td>Action</td>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(table).map(function (element) {
                            return (
                                <tr key={element}>
                                    {(table[element].job.Status != -1) &&
                                    <>
                                        <td onClick={()=>renderdetail(table[element])}>{table[element].detial.Name}</td>

                                        <td onClick={()=>renderdetail(table[element])}>{table[element].company.Name}</td>
                                        <td onClick={()=>renderdetail(table[element])}>{table[element].detial.SalaryUp}</td>

                                        <td onClick={()=>renderdetail(table[element])}> {table[element].job.JobListingId}</td>
                                    </>
                                    }
                                    {(table[element].job.Status != -1) &&

                                        <td onClick={() => renderfeedback(table[element])}>{table[element].job.PercentageMatch * 100 + " %"}</td>
                                    }
                                    {(table[element].job.Status == 0) &&
                                        <td>Not Apply</td>
                                    }
                                    {(table[element].job.Status == 1) &&
                                        <td>Applied</td>
                                    }
                                    {(table[element].job.Status == 0) &&

                                        <td><button onClick={() => applyjob(table[element], 1)} type="button" class="btn btn-primary">Apply</button>  <button onClick={() => applyjob(table[element], -1)}  type="button" class="btn btn-danger"> Reject</button></td>

                                    }
                                    {(table[element].job.Status == 1) &&
                                        <td><button onClick={() => applyjob(table[element], 0)}  type="button" class="btn btn-secondary" >unApply</button></td>
                                    }
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
                <Modal isOpen={detailtoggle}>
                    <ModalHeader>
                        Job Detail
                    </ModalHeader>
                    <ModalBody>
                        {(detail) &&
                        <>
                            <p>Company: {detail.company.Name}</p>
                            <p>Company Description: {detail.company.Description}</p>
                            <p>Industry: {detail.company.Industry}</p>
                            <p>Job: {detail.detial.Name}</p>
                            <p>Job Description: {detail.detial.Description}</p>
                            <p>Job Type: {detail.detial.Type}</p>
                            <p>Salary:  {detail.detial.SalaryUp}</p>
                            <p>Education: {detail.detial.Education}</p>
                            <p>Latitude: {detail.detial.Latitude}</p>
                            <p>Longitude: {detail.detial.Longitude}</p>



                        </>
                        }
                    </ModalBody>

                <button onClick={() => setdetailtoggle(!detailtoggle)}>back</button>

                </Modal>

                <Modal isOpen={feedbacktoggle}>
                    {(feedback) &&
                        <>
                            <p>{feedback.message.split(".")[0]}</p>
                            <p>{feedback.message.split(".")[1]}</p>
                            <p>{feedback.message.split(".")[2]}</p>
                            <p>{feedback.message.split(".")[3]}<br />{feedback.message.split(".")[4]}</p>

                        </>
                    }
                    <button onClick={() => setfeedbacktoggle(!feedbacktoggle)}>back</button>
                </Modal>
            </>)
        }

    }

    return (<>
        
        <div>
        <h1> Job Dashboard</h1>


            {rendertable()}
        </div>
        <div>
            <button onClick={() => h.push("/account")}>Back</button>
        </div>

    </>)
}

export default Matchlist;