import React, { Component, useState, useEffect } from 'react';
import Header from '../components/layout/Header-withoutBody';
import Footer from '../components/layout/Footer-withoutLinks';
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
import { ClipLoader } from 'react-spinners';
import { Progress } from 'reactstrap';

function Matchlist() {
    const h = useHistory()
    const [userdata, setuserdata] = useState()
    const [joblist, setjoblist] = useState()
    const [visibleterm, setvisibleterm] = useState(10)
    const [feedbacktoggle, setfeedbacktoggle] = useState(false)
    const [feedback, setfeedback] = useState()
    const [detailtoggle, setdetailtoggle] = useState(false)
    const [detail, setdetail] = useState()
    const [waittoggle, setwaittoggle] = useState(true)

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
            if(Object.keys(data.seekr).length!=0){
                fetch('http://localhost:8000/job_match/list/' + data.account.id, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + cookies.load("t")
                    }
                }).then(res => res.json()).then((data => {
                    console.log(data)
                    data.list.sort((a,b)=> parseFloat( b.job.PercentageMatch) - parseFloat( a.job.PercentageMatch))
                    console.log(data)
                    setjoblist(data.list)
                    setwaittoggle(false)
    
                })).
                    catch(error => {
                        if (error.status === 404) {
                            console.log(error.status + error.statusText)
                        } else if (error.status === 403) {
                            console.log(error.status + error.statusText)
                        }
                    })
            }else{
                h.push("/account")
            }
            
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
        setwaittoggle(true)
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
                data.list.sort((a,b)=> parseFloat( b.job.PercentageMatch) - parseFloat( a.job.PercentageMatch))
                setjoblist(data.list)
                setwaittoggle(false)

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

    function renderdetail(item) {
        setdetailtoggle(!detailtoggle)
        setdetail(item)
    }

    function rendertable() {
        console.log(joblist)
        if (!joblist) {
            return (<>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin:"50px"
                }}>
                    <ClipLoader
                        //css={override}
                        size={150}
                        color={"#123abc"}
                        loading={waittoggle}
                    />
                loading
        </div>
            </>)
        } else {
            
            var table = joblist.slice(visibleterm - 10, visibleterm)
            //console.log(table)
            return (<>
                 <div style={{
                    backgroundColor: '#afcde3',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
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
                                            <td onClick={() => renderdetail(table[element])}>{table[element].detial.Name}</td>

                                            <td onClick={() => renderdetail(table[element])}>{table[element].company.Name}</td>
                                            <td onClick={() => renderdetail(table[element])}>{table[element].detial.SalaryUp}</td>

                                            <td onClick={() => renderdetail(table[element])}> {table[element].job.JobListingId}</td>
                                        </>
                                    }
                                    {(table[element].job.Status != -1) &&

                                        <td onClick={() => renderfeedback(table[element])}>
                                        <Progress color="success" value={table[element].job.PercentageMatch * 100}>{table[element].job.PercentageMatch * 100}</Progress>
                                        </td>
                                    }
                                    {(table[element].job.Status == 0) &&
                                        <td>Not Apply</td>
                                    }
                                    {(table[element].job.Status == 1) &&
                                        <td>Applied</td>
                                    }
                                    {(table[element].job.Status == 0) &&

                                        <td><button onClick={() => applyjob(table[element], 1)} type="button" class="btn btn-primary">Apply</button>  <button onClick={() => applyjob(table[element], -1)} type="button" class="btn btn-danger"> Reject</button></td>

                                    }
                                    {(table[element].job.Status == 1) &&
                                        <td><button onClick={() => applyjob(table[element], 0)} type="button" class="btn btn-secondary" >unApply</button></td>
                                    }
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>
                </div>
                    <br></br>
                    <button onClick={() => setvisibleterm(visibleterm - 10)} type="button" > Previous Page </button>

                    <button onClick={() => setvisibleterm(visibleterm + 10)} type="button" > Next Page </button>
                     
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
                    <div class="modal-footer">

                    <button onClick={() => setdetailtoggle(!detailtoggle)} class="btn btn-info">back</button>
                    </div>
                </Modal>

                <Modal isOpen={feedbacktoggle}>
                    <ModalHeader>
                        Feedback
                    </ModalHeader>
                    {(feedback) &&
                        <>
                            <p>{feedback.message.split(".")[0]}</p>
                            <p>{feedback.message.split(".")[1]}</p>
                            <p>{feedback.message.split(".")[2]}</p>
                            <p>{feedback.message.split(".")[3]}<br />{feedback.message.split(".")[4]}</p>

                        </>
                    }
                    <div class="modal-footer">
                    <button onClick={() => setfeedbacktoggle(!feedbacktoggle)} class="btn btn-info">back</button>
                    </div>
                </Modal>
                <Modal isOpen={waittoggle}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin:"50px"
                }}>
                <ClipLoader
                        //css={override}
                        size={150}
                        color={"#123abc"}
                        loading={waittoggle}
                    /> 
                    <p><strong>Action may takes a few seconds</strong>.</p>

                </div>
                    </Modal>
            </>)
        }

    }

    return (<>

        <div>
            <Header />
            {rendertable()}
             <Footer />
        </div>

    </>)
}

export default Matchlist;