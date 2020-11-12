import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory } from 'react-router-dom'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Add } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import MaterialTable from "material-table";
import SelectSearch from 'react-select-search';
import Select from 'react-select'
import './skillcss.css'
import { Link } from 'react-router-dom';
import Logo from '../components/layout/Logo';

import { ListGroup } from 'react-bootstrap';

function Account() {
    const h = useHistory()
    const [token, settoken] = useState()
    const [username, setusername] = useState()
    const [email, setemail] = useState()
    const [firstname, setfirstname] = useState()
    const [lastname, setlastname] = useState()
    const [accountstatus, setaccountstatus] = useState()
    const [accountsetup, setaccountsetup] = useState()
    const closeModal = () => setaccountsetup(false);
    const [type, settype] = useState()
    const [uid, setuid] = useState()
    const [latitude, setlatitude] = useState()
    const [longtitude, setlongtitude] = useState()
    const [description, setdescription] = useState()
    const [edu, setedu] = useState()
    const [cname, setcname] = useState()
    const [data, setdata] = useState()
    const [skills, setskills] = useState(false)
    const [newskills, setnewskills] = useState()
    const [userskills, setuserskills] = useState()
    const [newjobtoggle, setnewjobtoggle] = useState(false)
    const [viewjobstoggle, setviewjobstoggle] = useState(false)
    const [jobname, setjobname] = useState()
    const [jobdescription, setjobdescription] = useState()
    const [jobtype, setjobtype] = useState()
    const [salary, setsalary] = useState()
    const [joblist, setjoblist] = useState()
    const [showjobdetail, setshowjobdetail] = useState(false)
    const [jobdetail, setjobdetail] = useState()
    const [waitlist, setwaitlist] = useState([])
    const [skilllist, setskilllist] = useState([])
    const [possibleskilllist, setpossibleskilllist] = useState([])




    useEffect(() => {
        settoken(cookies.load("t"))
        if (cookies.load("t") === "" || cookies.load("t") === undefined) {
            h.push("/signin")
        }
        console.log(cookies.load("t"))
        fetch('http://127.0.0.1:8000/user/info/', {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + cookies.load("t")
            }
        }).then(res => res.json()).then((data => {
            console.log(data)
            setdata(data)
            setusername(data.account.username)
            setfirstname(data.account.first_name)
            setlastname(data.account.last_name)
            setemail(data.account.email)
            setuid(data.account.id)
            if (Object.keys(data.company).length !== 0) {
                setaccountstatus("Company")
                setaccountsetup(false)

            }
            else if (Object.keys(data.seekr).length !== 0) {
                setaccountstatus("Job Seeker")
                setaccountsetup(false)

            } else {
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


    }, [])

    function skill_mangement() {
        setskills(!skills)
        fetch('http://127.0.0.1:8000/seeker_skill/get/', {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
        }).then(res => res.json()).then((data => {
            setuserskills(data)
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
        fetch('http://127.0.0.1:8000/skills/add', {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
        }).then(res => res.json()).then((data => {
            console.log(data)
            let idModified = data.map(
                obj => {
                    return {
                        "value": obj.id,
                        "name": obj.Name,

                    }
                }
            );
            console.log(idModified)
            setskilllist(idModified)

        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })

    }

    // useEffect(()=>{
    //     if(accountstatus === "Account not set up"){
    //         setaccountsetup(true)
    //     }else{
    //         setaccountsetup(false)
    //     }
    //     console.log(accountsetup)
    // })

    function showskills() {
        console.log(newskills)
        if (!userskills) {
            return (
                <div>
                </div>)
        } else {
            var table = userskills.skills
            console.log(table)
            return (
                <div>
                <br></br>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(table).map(function (element) {
                                return (
                                    <tr key={element}>
                                        <td>{table[element].Name}</td>
                                        <td><button class="btn btn-danger  btn-sm" onClick={() => deleteskill(table[element])}>remove</button></td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>)
        }

    }

    function deleteskill(item) {
        console.log(item)
        fetch('http://127.0.0.1:8000/seeker_skill/remove/', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
            body: JSON.stringify({
                "UserId": uid,
                "SkillsId": item.id
            })
        }).then(res => res.json()).then((data => {
            setuserskills(data)
            console.log("remove and set")
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })


    }

    //Give different functions dependent on account type
    function fancyfuntion() {
        if (accountstatus == "Company") {
            // if account is company return this
            // show company infomation from data that recieved
            return (<>
                            <div>
                            <button class="btn btn-success" onClick={jobmanagement}>View All Posted Jobs</button> 
                            <button class="btn btn-success float-right" onClick={() => setnewjobtoggle(!newjobtoggle)} >Post New Job</button> 
                            </div>
                            <br></br>

                <div class="card border-primary mb-3" style={{ maxWidth: "100rem" }, { padding: "20px" }}>
                    <div class="card-header">My Company Information</div>
                    <div class="card-body">

                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Company Name: </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.company.Name}></input>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Description: </label>
                            <div class="col-sm-10">
                                <textarea type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.company.Description}></textarea>
                            </div>
                        </div>

                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Industry: </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.company.Industry}></input>
                            </div>
                        </div>
                    </div>
                    {/* toggle post new job medal out  */}

                </div>
                <Modal isOpen={newjobtoggle}
                >
                    <ModalHeader><b>Post a New Job</b></ModalHeader>
                    <ModalBody>
                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Job Name</label>
                            <input onChange={(event) => setjobname(event.target.value)} type="text" class="form-control" placeholder="Job Name"  ></input>
                        </div>
                        <div class="form-group">
                            <label class="col-form-label" for="exampleTextarea">Job Description</label>
                            <textarea onChange={(event) => setjobdescription(event.target.value)} class="form-control" id="exampleTextarea" rows="3" spellcheck="false"></textarea>
                        </div>

                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Employment Type</label>
                            <input onChange={(event) => setjobtype(event.target.value)} type="text" class="form-control" placeholder="Full Time, Part Time, etc."  ></input>
                        </div>
                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Education Experience</label>
                            <input onChange={(event) => setedu(event.target.value)} type="text" class="form-control" placeholder="Minimum amount required"  ></input>
                        </div>

                        <div class="form-group">
                            <label class="col-form-label">Salary</label>
                            <div class="form-group">
                                <div class="input-group mb-3">
                                    <input placeholder="Salary" onChange={(event) => setsalary(event.target.value)} type="text" class="form-control" aria-label="Amount (to the nearest dollar)"></input>
                                    <div class="input-group-append">
                                        <span class="input-group-text">$ per month</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="btn btn-primary" onClick={addjob}> Add Job </button>

                    </ModalBody>
                    <div class="modal-footer">

                        <button class="btn btn-info" onClick={() => setnewjobtoggle(!newjobtoggle)}> Back to Account </button>
                    </div>
                </Modal>
                <Modal isOpen={viewjobstoggle}>
                    <ModalHeader><b>Jobs Posted</b></ModalHeader>
                    {showjobs()}
                    <div class="modal-footer">

                        <button class="btn btn-info" onClick={() => setviewjobstoggle()}> Back to Account </button> <br></br>
                    </div>
                </Modal>
            </>)
        } else if (accountstatus == "Job Seeker") {
            return (<>
                <div class="card border-primary mb-3" style={{ maxWidth: "100rem" }, { padding: "20px" }}>
                    <div class="card-header">Job Related Information
                    </div>
                    <div class="card-body">
                             <div class="form-inline my-2 my-lg-0">
                        <div class="btn-group btn-group-toggle " data-toggle="buttons">
                         <button class="btn btn-primary float-right" onClick={() => h.push('/matched-jobs')}> View all my Matches</button> <br></br>
                            <button class="btn btn-success" onClick={skill_mangement}>My Skills</button>
                            </div>
                           <br></br>
                        </div>
                    </div>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Education:  </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Education}></input>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">My Goals  </label>
                            <div class="col-sm-10">
                                <textarea type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Description}></textarea>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Location - Longtitude: </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Longitude}></input>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Location - Latitude: </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Latitude}></input>
                            </div>
                        </div>

                    </div>

                <Modal isOpen={skills}
                >
                    <ModalHeader><b>My Skills</b></ModalHeader>

                    <ModalBody>
                        
                        <SelectSearch onChange={setnewskills}
                            options={skilllist} search
                            placeholder="Add a skill from this list"
                        /> 
                        <br></br>                    
                        <button  class="btn btn-primary btn-sm"  onClick={addskill}>Add</button>
                        <br></br>
                        {showskills()}

                    </ModalBody>

                    <div class="modal-footer">
                        <button class="btn btn-info" onClick={() => setskills(!skills)}> Back To Account Page </button>
                    </div>
                </Modal>

            </>)
        } else {
            return (<div><button class="btn btn-warning" onClick={submit}>set up account</button></div>)
        }

    }

    function addskill() {
        if (newskills === undefined || newskills === "") {
            alert("skill can not be empty")
            return (1)
        }

        fetch('http://127.0.0.1:8000/seeker_skill/add/', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
            body: JSON.stringify({
                'UserId': uid,
                'SkillsId': newskills
            })

        }).then(res => res.json()).then((data => {
            setuserskills(data)
            alert("New skill succesfull added")

        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    }

    function jobaddskill() {
        console.log(newskills)
        if (newskills === undefined || newskills === "") {
            alert("skill can not be empty")
            return (1)
        }
        fetch('http://127.0.0.1:8000/job_skill/add/', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
            body: JSON.stringify({
                "JobListingId": jobdetail.id,
                'SkillsId': newskills
            })

        }).then(res => res.json()).then((data => {
            setskilllist(data.skills)
            alert("New skill succesfull added")

        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    }

    function showjobs() {
        if (!joblist) {
            return (<></>)
        } else {
            var table = joblist
            console.log(table)
            return (<>
                <div>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <td><b>Job Name</b></td>
                                <td><b>Type</b></td>
                                <td><b>Education Required</b></td>

                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(table).map(function (element) {
                                return (
                                    <tr key={element}>
                                        <td onClick={() => Job_detail(table[element])}>{table[element].Name}</td>
                                        <td>{table[element].Type}</td>
                                        <td>{table[element].Education}</td>
                                        <td><button class="btn btn-danger  btn-sm" onClick={() => deletejobs(table[element])}>remove</button></td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    {render_Job_detail()}

                </div>
            </>)
        }

    }

    function render_Job_detail() {
        if (jobdetail && waitlist) {
            var table = waitlist
            var table2 = skilllist

            return (
                <Modal isOpen={showjobdetail} >
                    <ModalHeader>Job Detial: {jobdetail.Name}</ModalHeader>
                    <ModalBody>
                        Unique ID: {jobdetail.id}<br></br>
                            Company:{jobdetail.Company}<br></br>

                            Job:{jobdetail.Name}<br></br>
                            Description:{jobdetail.Description}<br></br>
                            Working type:{jobdetail.Type}<br></br>
                            Salary:{jobdetail.SalaryUp}<br></br>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <td>Skill needed</td>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(table2).map(function (element) {
                                    return (
                                        <tr key={element}>
                                            <td>{table2[element].Name}</td>
                                            <td><button class="btn btn-warning  btn-sm" onClick={() => jobdeleteskill(table2[element])}>remove</button></td>

                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                        <SelectSearch onChange={setnewskills}
                            options={possibleskilllist} search
                            placeholder="Add a skill"
                        />                        <button class="btn btn-primary btn-sm" onClick={jobaddskill}>add </button><br></br>

                            who applied:<br></br>
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <td>First Name</td>
                                    <td>Last Name</td>
                                    <td>Match Perentage</td>

                                    <td>Email</td>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(table).map(function (element) {
                                    return (
                                        <tr key={element}>
                                            <td title={table[element].extra.Description}> {table[element].info.first_name}</td>
                                            <td>{table[element].info.last_name}</td>
                                            <td>{table[element].score * 100 + " %"}</td>
                                            <td>{table[element].info.email}</td>
                                        </tr>
                                    )
                                })
                                }
                            </tbody>
                        </table>
                        <div class="modal-footer">


                            <button class="btn btn-info" onClick={() => setshowjobdetail(!showjobdetail)}>Back</button>
                        </div>
                    </ModalBody>
                </Modal>
            )
        } else {
            return (<></>)
        }

    }

    function jobdeleteskill(item) {
        console.log(item)
        console.log(jobdetail)
        fetch('http://127.0.0.1:8000/job_skill/remove/', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
            body: JSON.stringify({
                "JobListingId": jobdetail.id,
                "SkillsId": item.id
            })
        }).then(res => res.json()).then((data => {
            setskilllist(data.skills)
            console.log("remove and set")
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })


    }

    function Job_detail(item) {
        if (item) {
            setshowjobdetail(!showjobdetail)
            setjobdetail(item)
            console.log(item)
            if (jobdetail) {

                fetch('http://127.0.0.1:8000/job_skill/get/', {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + token
                    },
                    body: JSON.stringify({
                        "JobListingId": item.id
                    })
                }).then(res => res.json()).then((data => {
                    console.log(data)
                    setskilllist(data.skills)

                })).
                    catch(error => {
                        if (error.status === 404) {
                            console.log(error.status + error.statusText)
                        } else if (error.status === 403) {
                            console.log(error.status + error.statusText)
                        }
                    })

                fetch('http://127.0.0.1:8000/job_match/status/company', {
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': "Token " + token
                    },
                    body: JSON.stringify({
                        "id": item.id
                    })
                }).then(res => res.json()).then((data => {
                    console.log(data)
                    setwaitlist(data)

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

    }

    function deletejobs(item) {
        console.log(item)
        fetch('http://127.0.0.1:8000/job_list/delete/', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
            body: JSON.stringify({
                "Id": item.id,
                "Company": item.Company
            })
        }).then(res => res.json()).then((data => {
            console.log(data)
            setjoblist(data['job_list'])
            console.log("remove and set")
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    }

    //post job to backend
    function addjob() {
        var r = {
            "Name": jobname,
            "Company": data.company.id,
            "Description": jobdescription,
            "SalaryUp": salary,
            "SalaryDown": salary,
            "Type": jobtype,
            "Education": edu,
            "Latitude": latitude,
            "Longitude": longtitude
        }
        fetch('http://127.0.0.1:8000/job_list/add/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token

            },
            body: JSON.stringify(r)
        }).then(res => res.json()).then((data => {
            console.log(data)
            alert("Job added")
            setnewjobtoggle(!newjobtoggle)

        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    }

    //get joblist for the company
    function jobmanagement() {
        setviewjobstoggle(!viewjobstoggle)
        fetch('http://127.0.0.1:8000/job_list/get/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token

            },
            body: JSON.stringify({
                'Company': data.company.id
            })
        }).then(res => res.json()).then((data => {
            console.log(data)
            setjoblist(data)
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
        fetch('http://127.0.0.1:8000/skills/add', {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
        }).then(res => res.json()).then((data => {
            console.log(data)
            let idModified = data.map(
                obj => {
                    return {
                        "value": obj.id,
                        "name": obj.Name,

                    }
                }
            );
            console.log(idModified)
            setpossibleskilllist(idModified)

        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    }


    function accounttype() {
        if (type === "company") {
            return (<div>
                <span class="badge badge-primary">Company Detail</span>

                <div class="form-group">
                    <label class="col-form-label" for="inputDefault">Company Name</label>
                    <input onChange={event => setcname(event.target.value)} type="text" class="form-control" placeholder="Company Name"  ></input>
                </div>
                <div class="form-group">
                    <label for="exampleTextarea">Company Description</label>
                    <textarea placeholder="Tell us more about what makes your company special so we can find candidates best suited" onChange={event => setdescription(event.target.value)} class="form-control" id="exampleTextarea" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label class="col-form-label" for="inputDefault">Industry</label>
                    <input onChange={event => setedu(event.target.value)} type="text" class="form-control" placeholder="e.g.   Medical, IT, etc."  ></input>
                </div>
                <div class="modal-footer">

                    <button onClick={save} class="btn btn-success" >Save</button>
                </div>
            </div>)
        } else if (type === "seekr") {
            return (<div>
                <span class="badge badge-primary">Seekr Detail</span>
                <div class="form-group">
                    <label class="col-form-label" for="inputDefault">Latitude</label>
                    <input onChange={event => setlatitude(event.target.value)} type="text" class="form-control" placeholder="Optional"  ></input>
                </div>

                <div class="form-group">
                    <label class="col-form-label" for="inputDefault">Longitude</label>
                    <input onChange={event => setlongtitude(event.target.value)} type="text" class="form-control" placeholder="Optional"  ></input>
                </div>

                <div class="form-group">
                    <label class="col-form-label" for="inputDefault">Education</label>
                    <input onChange={event => setedu(event.target.value)} type="text" class="form-control" placeholder="What have you studied?"  ></input>
                </div>

                <div class="form-group">
                    <label for="exampleTextarea">Description</label>
                    <textarea placeholder="Write more about yourself so we can find a match for you" onChange={event => setdescription(event.target.value)} class="form-control" id="exampleTextarea" rows="3"></textarea>
                </div>

                <div class="modal-footer">

                    <button onClick={save} class="btn btn-success">Save</button>
                </div>
            </div>)
        } else {
            return (<div></div>)
        }
    }

    function submit() {
        setaccountsetup(!accountsetup)
    }

    function save() {
        if (type === "company") {
            var r = {
                "UserId": uid,
                "Name": cname,
                "Description": description,
                "Industry": edu,

            }
            fetch('http://127.0.0.1:8000/company/register/', {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + token
                },
                body: JSON.stringify(r)
            }).then(res => res.json()).then((data => {
                console.log(data)
                closeModal()
                window.location.reload(false)

            })).
                catch(error => {
                    if (error.status === 404) {
                        console.log(error.status + error.statusText)
                    } else if (error.status === 403) {
                        console.log(error.status + error.statusText)
                    }
                })

        } else if (type === "seekr") {
            var r = {
                "UserId": uid,
                "Description": description,
                "Education": edu,
                "Longitude": longtitude,
                "Latitude": latitude
            }

            fetch('http://127.0.0.1:8000/job_seeker/details/', {
                method: "post",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + token
                },
                body: JSON.stringify(r)
            }).then(res => res.json()).then((data => {
                if (data.Latitude === "A valid number is required." || data.Longtitude === "A valid number is required.") {
                    alert("Latitude and Longtitude must be numbers")
                } else {
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

    function erase() {
        //logout()
        console.log(data)
        fetch('http://127.0.0.1:8000/user/remove/', {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            }

        }).then(res => res.json()).then((data => {
            console.log(data)
            cookies.remove("t", { domain: "localhost", path: '/' })
            alert("Account deleted, you will now redierct to main page")
            h.push('/signin')
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })

    }

    function logout() {
        fetch('http://127.0.0.1:8000/auth/logout', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
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







    return (<>

       <nav>
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
                <button class="btn btn-secondary float-right" onClick={logout}> Log out </button>
            </div>
        </div>
           <hr 
            style={{
                backgroundColor: '#F5F9FC',
                height: 3
            }}
        />
      </nav>
        {fancyfuntion()}
        <div class="card border-primary mb-3" style={{ maxWidth: "100rem" }, { padding: "20px" }}>
            <div class="card-header"> My Profile</div>
            <div class="card-body">
                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Username:</label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={username}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">First Name: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={firstname}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Last Name: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={lastname}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Email Address: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={email}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Type of Account: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={accountstatus}></input>
                    </div>
                </div>
            </div>
                <div class="form-inline my-2 my-lg-0">
                    <Popup trigger={<button class="btn btn-danger"> Delete Account</button>} position="bottom">
                        <div>
                        <p>This will delete everything in or link to this account.</p>
                        <button class="btn btn-danger float-right" onClick={erase}>Delete everything I have </button>
                        </div>
                        </Popup>    &nbsp;  &nbsp;
                 </div>
        </div>


        <Modal isOpen={accountsetup} >
            <div className="modal">
                <a className="close" onClick={closeModal}>
                    &times;
            </a>
            </div>
            
            <ModalHeader>Set Up Your Account Today</ModalHeader>
            <ModalBody>
                <div className="header"><strong>Proceed by clicking on what type of user you are</strong></div>
                <br></br>
                <div className="modal">
                    <a className="close" onClick={closeModal}>
                        &times;
            </a>
                </div>
                 <div>
                <button onClick={submit} class="btn-sm" > Set up later</button>
                </div>
                <br></br>
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn btn-primary">
                        <input type='radio' name="account type" onChange={() => settype("company")} /> Company
                </label>
                    <label class="btn btn-primary">
                        <input type='radio' name="account type" onChange={() => settype("seekr")} /> Job Seeker
                </label>
                </div>
                <br></br>
                <div>
                </div>
                               {accounttype()}


            </ModalBody>

        </Modal>



    </>

    )
}
export default Account;