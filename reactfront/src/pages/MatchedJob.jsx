import React, { Component, useState, useEffect } from 'react';
import Footer from '../components/layout/Footer-withoutLinks';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory } from 'react-router-dom'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Add, Feedback } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import SelectSearch from 'react-select-search';
import "./lumen.css"
import { ClipLoader } from 'react-spinners';
import { Progress } from 'reactstrap';
import { Link } from 'react-router-dom';
import Logo from '../components/layout/Logo';

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
            if (Object.keys(data.seekr).length != 0) {
                fetch('http://localhost:8000/job_match/list/' + data.account.id, {
                    method: "get",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + cookies.load("t")
                    }
                }).then(res => res.json()).then((data => {
                    console.log(data)
                    data.list.sort((a, b) => parseFloat(b.job.PercentageMatch) - parseFloat(a.job.PercentageMatch))
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
            } else {
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

    function logout() {
        fetch('http://127.0.0.1:8000/auth/logout', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + cookies.load("t")
            }

        }).then(res => res.json()).then((data => {
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
        h.push('/signin')
    }

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
                data.list.sort((a, b) => parseFloat(b.job.PercentageMatch) - parseFloat(a.job.PercentageMatch))
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
                    margin: "50px"
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
                    backgroundColor: '#c4daf2',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <table class="table table-hover">
                        <thead style={{ background: "#b3c7eb", fontWeight: 'bold', textDecorationLine: 'underline' }}>
                            <tr>
                                <td>Role</td>
                                <td>Company</td>
                                <td>Salary (PM)</td>
                                <td>How well suited are you for this job?</td>
                                <td>Have you applied yet?</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(table).map(function (element) {
                                return (
                                    <tr key={element}>
                                        {(table[element].job.Status != -1) &&
                                            <>
                                                <td onClick={() => renderdetail(table[element])} style={{ textDecorationLine: 'underline' }}>{table[element].detial.Name}</td>

                                                <td onClick={() => renderdetail(table[element])}>{table[element].company.Name}</td>
                                                <td onClick={() => renderdetail(table[element])}>{table[element].detial.SalaryUp}</td>
                                            </>
                                        }
                                        {(table[element].job.Status != -1) &&

                                            <td onClick={() => renderfeedback(table[element])}>
                                                <Progress color="success" value={parseInt(table[element].job.PercentageMatch * 100)}>{parseInt(table[element].job.PercentageMatch * 100) + " %"}</Progress>
                                            </td>
                                        }
                                        {(table[element].job.Status == 0) &&
                                            <td>Haven't Applied</td>
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
                {(visibleterm>10) &&
                    <button class="btn btn-secondary" onClick={() => setvisibleterm(visibleterm - 10)} type="button" > Previous Page </button>

                }
                        <strong>PAGE : {visibleterm/10}</strong>
                <button class="btn btn-secondary" onClick={() => setvisibleterm(visibleterm + 10)} type="button" > Next Page </button>

                <Modal isOpen={detailtoggle}>
                    <ModalHeader>
                        <b>Job Details</b>
                    </ModalHeader>
                    <ModalBody>
                        {(detail) &&
                            <>
                                <p><b>Company:</b> {detail.company.Name}</p>
                                <p><b>Role:</b> {detail.detial.Name}</p>
                                <p><b>Job Description:</b> {detail.detial.Description}</p>
                                <p><b>Employment Type: </b>{detail.detial.Type}</p>
                                <p><b>Salary (PM): </b>{detail.detial.SalaryUp}</p>
                                <p><b>Education Required: </b>{detail.detial.Education}</p>
                            </>
                        }
                    </ModalBody>
                    <div class="modal-footer">

                        <button onClick={() => setdetailtoggle(!detailtoggle)} class="btn btn-info">Back to Jobs</button>
                    </div>
                </Modal>

                <Modal isOpen={feedbacktoggle}>
                    <ModalHeader>
                        <b>Feedback to improve your score</b>
                    </ModalHeader>
                    <ModalBody>
                        {(feedback) &&
                            <>
                                <p>SEEKr calculates your score based on the skills you share with a job and the similarity of your descriptions</p>
                                <p>{feedback.message.split(".")[0].split(":")[0].split("$")[0]}
                                    <strong> {feedback.message.split(".")[0].split(":")[0].split("$")[1]} </strong>
                                    {feedback.message.split(".")[0].split(":")[0].split("$")[2]} :
                                {feedback.message.split(".")[0].split(":")[1].split(",").map(function (element) {
                                        console.log(element)
                                        return (
                                            <>
                                                <span class="badge badge-primary" key={element}> {element}</span> &nbsp;
                                            </>
                                        )
                                    })
                                    }</p>
                                <p>{feedback.message.split(".")[1].split(":")[0].split("$")[0]}
                                    <strong> {feedback.message.split(".")[1].split(":")[0].split("$")[1]} </strong>
                                    {feedback.message.split(".")[1].split(":")[0].split("$")[2]} :
                                {feedback.message.split(".")[1].split(":")[1].split(",").map(function (element) {
                                        console.log(element)
                                        return (
                                            <>
                                                <span class="badge badge-info" key={element}> {element}</span> &nbsp;
                                            </>
                                        )
                                    })
                                    }</p>
                                <p>{feedback.message.split(".")[2].split(":")[0].split("$")[0]}
                                    <strong> {feedback.message.split(".")[2].split(":")[0].split("$")[1]} </strong>
                                    {feedback.message.split(".")[2].split(":")[0].split("$")[2]} :
                                {feedback.message.split(".")[2].split(":")[1].split(",").map(function (element) {
                                        console.log(element)
                                        return (
                                            <>
                                                <span class="badge badge-success" key={element}> {element}</span> &nbsp;
                                            </>
                                        )
                                    })
                                    }</p>
                                <p> <strong>AND</strong><br></br> {feedback.message.split(".")[3]}</p>
                            <p><strong>THEREFORE</strong><br></br>{feedback.message.split(".")[4].split("$")[0]}
                                <strong> {feedback.message.split(".")[4].split("$")[1]} </strong>
                                {feedback.message.split(".")[4].split("$")[2]}
                                </p>
                                <p>{feedback.message.split('.')[5]}</p>

                            </>
                        }
                    </ModalBody>
                    <div class="modal-footer">
                        <button onClick={() => setfeedbacktoggle(!feedbacktoggle)} class="btn btn-info">Back to Jobs</button>
                    </div>
                </Modal>
                <Modal isOpen={waittoggle}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: "50px"
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

        <nav                 style={{
                    padding: '10px',
                }}>
            <br></br>
            <div className="brand header-brand">
                <h1 className="m-0">
                    <Link to="/">
                        <Logo />
                  SEEKr
                </Link>
                </h1>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <button class="btn btn-secondary float-right" onClick={() => h.push("/account")}> My Account</button>
                </div>
            </div>
            <hr
                style={{
                    backgroundColor: '#F5F9FC',
                    height: 3
                }}
            />
        </nav>
        {rendertable()}

    </>)
}

export default Matchlist;