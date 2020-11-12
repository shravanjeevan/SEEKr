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
                setaccountstatus("Company account")
                setaccountsetup(false)

            }
            else if (Object.keys(data.seekr).length !== 0) {
                setaccountstatus("Seeker account")
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

                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <td>my skills</td>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(table).map(function (element) {
                                return (
                                    <tr key={element}>
                                        <td>{table[element].Name}</td>
                                        <td><button class="btn btn-warning  btn-sm" onClick={() => deleteskill(table[element])}>remove</button></td>
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
        if (accountstatus == "Company account") {
            // if account is company return this
            // show company infomation from data that recieved
            return (<>

                <div class="card border-primary mb-3" style={{ maxWidth: "100rem" }, { padding: "20px" }}>
                    <div class="card-header">{accountstatus}</div>
                    <div class="card-body">
                        <span class="badge badge-success">Company</span>

                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Company NAME: </label>
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

                        <div class="btn-group btn-group-toggle" data-toggle="buttons">

                            <button class="btn btn-success" onClick={() => setnewjobtoggle(!newjobtoggle)} > post new jobs</button> <br></br>

                            <button class="btn btn-success" onClick={jobmanagement}> jobs</button> <br></br>
                        </div>
                    </div>
                    {/* toggle post new job medal out  */}

                </div>
                <Modal isOpen={newjobtoggle}
                >
                    <ModalHeader>Post a New Job</ModalHeader>
                    <ModalBody>
                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Job Name</label>
                            <input onChange={(event) => setjobname(event.target.value)} type="text" class="form-control" placeholder="Job Name"  ></input>
                        </div>
                        <div class="form-group">
                            <label for="exampleTextarea">Job Description</label>
                            <textarea onChange={(event) => setjobdescription(event.target.value)} class="form-control" id="exampleTextarea" rows="3" spellcheck="false"></textarea>
                        </div>

                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Type</label>
                            <input onChange={(event) => setjobtype(event.target.value)} type="text" class="form-control" placeholder="Type e.g. Full Time, Part Time, etc."  ></input>
                        </div>
                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Education</label>
                            <input onChange={(event) => setedu(event.target.value)} type="text" class="form-control" placeholder="e.g.  Primary, Secondary"  ></input>
                        </div>

                        <div class="form-group">
                            <label class="control-label">Salary</label>
                            <div class="form-group">
                                <div class="input-group mb-3">

                                    <input placeholder="Salary" onChange={(event) => setsalary(event.target.value)} type="text" class="form-control" aria-label="Amount (to the nearest dollar)"></input>
                                    <div class="input-group-append">
                                        <span class="input-group-text">$ per week</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Longitude</label>
                            <input onChange={(event) => setlongtitude(event.target.value)} type="text" class="form-control" placeholder="Leave 1 if you do not know"  ></input>
                        </div>
                        <div class="form-group">
                            <label class="col-form-label" for="inputDefault">Latitude</label>
                            <input onChange={(event) => setlatitude(event.target.value)} type="text" class="form-control" placeholder="Leave 1 if you do not know" id="Latitude"></input>
                        </div>

                        <button class="btn btn-primary" onClick={addjob}> Add Job </button>

                    </ModalBody>
                    <div class="modal-footer">

                        <button class="btn btn-info" onClick={() => setnewjobtoggle(!newjobtoggle)}> Back </button>
                    </div>
                </Modal>
                <Modal isOpen={viewjobstoggle}>
                    <ModalHeader>Job list</ModalHeader>
                    {showjobs()}
                    <div class="modal-footer">

                        <button class="btn btn-info" onClick={() => setviewjobstoggle()}> Back </button> <br></br>
                    </div>
                </Modal>
            </>)
        } else if (accountstatus == "Seeker account") {
            return (<>
                <div class="card border-primary mb-3" style={{ maxWidth: "100rem" }, { padding: "20px" }}>
                    <div class="card-header">{accountstatus}

                    </div>

                    <div class="card-body">
                        <span class="badge badge-success">Seekr</span>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Education:  </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Education}></input>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Description:  </label>
                            <div class="col-sm-10">
                                <textarea type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Description}></textarea>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Longtitude: </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Longitude}></input>
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="staticEmail" class="col-sm-2 col-form-label">Latitude: </label>
                            <div class="col-sm-10">
                                <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={data.seekr.Latitude}></input>
                            </div>
                        </div>

                    </div>
                    <div class="form-inline my-2 my-lg-0">
                        <div class="btn-group btn-group-toggle " data-toggle="buttons">

                            <button class="btn btn-primary" onClick={() => h.push('/matched-jobs')}> give me jobs</button> <br></br>
                            <button class="btn btn-success" onClick={skill_mangement}>My skills</button>
                        </div>
                    </div>
                </div>

                <Modal isOpen={skills}
                >
                    <ModalHeader>My skill list</ModalHeader>

                    <ModalBody>
                        {showskills()}
                        <SelectSearch onChange={setnewskills}
                            options={skilllist} search
                            placeholder="Add a skill"
                        />                        
                        <button  class="btn btn-primary btn-sm"  onClick={addskill}>add </button>

                    </ModalBody>

                    <div class="modal-footer">

                        <button class="btn btn-info" onClick={() => setskills(!skills)}> Back </button>
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
                                <td>Job Name</td>
                                <td>Type</td>
                                <td>Education</td>

                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(table).map(function (element) {
                                return (
                                    <tr key={element}>
                                        <td onClick={() => Job_detail(table[element])}>{table[element].Name}</td>
                                        <td>{table[element].Type}</td>
                                        <td>{table[element].Education}</td>
                                        <td><button class="btn btn-warning  btn-sm" onClick={() => deletejobs(table[element])}>remove</button></td>
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
                    <textarea placeholder="Describe your company" onChange={event => setdescription(event.target.value)} class="form-control" id="exampleTextarea" rows="3"></textarea>
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
                    <input onChange={event => setlatitude(event.target.value)} type="text" class="form-control" placeholder="Leave 1 if your do not know"  ></input>
                </div>

                <div class="form-group">
                    <label class="col-form-label" for="inputDefault">Longitude</label>
                    <input onChange={event => setlongtitude(event.target.value)} type="text" class="form-control" placeholder="Leave 1 if your do not know"  ></input>
                </div>

                <div class="form-group">
                    <label class="col-form-label" for="inputDefault">Education</label>
                    <input onChange={event => setedu(event.target.value)} type="text" class="form-control" placeholder="e.g.  Primary, Secondary, etc."  ></input>
                </div>

                <div class="form-group">
                    <label for="exampleTextarea">Description</label>
                    <textarea placeholder="CV style description. this will influence job recommendation results" onChange={event => setdescription(event.target.value)} class="form-control" id="exampleTextarea" rows="3"></textarea>
                </div>

                <div class="modal-footer">

                    <button onClick={save} class="btn btn-success">Save</button>
                </div>
            </div>)
        } else {
            return (<div>Select an account type to do next</div>)
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
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <a class="navbar-brand" href="/">SEEKR</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarColor01">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Account
          <span class="sr-only">(current)</span>
                        </a>
                    </li>
                    {(accountstatus == "Seeker account") &&
                        <>
                            <li class="nav-item" >
                                <a class="nav-link" href="/matched-jobs">Job Dashboard </a>
                            </li>
                        </>

                    }

                </ul>
                <div class="form-inline my-2 my-lg-0">
                    <Popup trigger={<button class="btn btn-danger"> Erase All</button>} position="bottom">
                        <div>
                            <p>This will delete everything in or link to this account.</p>
                            <button class="btn btn-danger" onClick={erase}>Delete everything I have </button>
                        </div>
                    </Popup> 	&nbsp;	&nbsp;
                    <button class="btn btn-warning" onClick={logout}> Log out </button>




                </div>
            </div>
        </nav>
        <div class="card border-primary mb-3" style={{ maxWidth: "100rem" }, { padding: "20px" }}>
            <div class="card-header"> Accounts page</div>
            <div class="card-body">
                <span class="badge badge-primary">Detail</span>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">USER NAME:</label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={username}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">FIRST NAME: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={firstname}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">LAST NAME: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={lastname}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">EMAIL: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={email}></input>
                    </div>
                </div>

                <div class="form-group row">
                    <label for="staticEmail" class="col-sm-2 col-form-label">Account status: </label>
                    <div class="col-sm-10">
                        <input type="text" readonly="" class="form-control-plaintext" id="staticEmail" value={accountstatus}></input>
                    </div>
                </div>
            </div>
        </div>

        {fancyfuntion()}


        <Modal isOpen={accountsetup} >
            <div className="modal">
                <a className="close" onClick={closeModal}>
                    &times;
            </a>
            </div>
            <button onClick={submit} class="btn btn-secondary" > Set up later</button>
            <ModalHeader>Your account is not set up yet!</ModalHeader>
            <ModalBody>
                <div className="header"><strong>Set your account now</strong></div>
                <div className="modal">
                    <a className="close" onClick={closeModal}>
                        &times;
            </a>
                </div>
                <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn btn-primary">
                        <input type='radio' name="account type" onChange={() => settype("company")} /> Comapny
                </label>
                    <label class="btn btn-primary">
                        <input type='radio' name="account type" onChange={() => settype("seekr")} /> Job Seekr
                </label>
                </div>
                {accounttype()}


            </ModalBody>

        </Modal>



    </>

    )
}
export default Account;