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
        if (!userskills) {
            return (
                <div>
                </div>)
        } else {
            console.log(userskills)
            var table = userskills.skills
            return (
                <div>

                    <table className="MyClassName">
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
                                        <td><button>remove</button></td>
                                    </tr>
                                )
                            })
                            }
                        </tbody>
                    </table>
                </div>)
        }

    }


    //Give different functions dependent on account type
    function fancyfuntion() {
        if (accountstatus == "Company account") {
            // if account is company return this
            // show company infomation from data that recieved
            return (<div>
                <div>Company NAME: {data.company.Name}</div>
                <div>Description: {data.company.Description}</div>
                <div>Industry: {data.company.Industry}</div>
                {/* toggle post new job medal out  */}
                <button onClick={() => setnewjobtoggle(!newjobtoggle)} > post new jobs</button> <br></br>

                <button onClick={jobmanagement}> jobs</button> <br></br>
                <Modal isOpen={newjobtoggle}
                >
                    <ModalHeader>Post a New Job</ModalHeader>
                    <ModalBody>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Job Name"
                            onChange={(event) => setjobname(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Description"
                            onChange={(event) => setjobdescription(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Type"
                            onChange={(event) => setjobtype(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Education"
                            onChange={(event) => setedu(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Salary"
                            onChange={(event) => setsalary(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Longitude"
                            onChange={(event) => setlongtitude(event.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Latitude"
                            onChange={(event) => setlatitude(event.target.value)}
                        />
                        <button onClick={addjob}> Add Job </button>

                    </ModalBody>
                    <button onClick={() => setnewjobtoggle(!newjobtoggle)}> Back </button>

                </Modal>
                <Modal isOpen={viewjobstoggle}>
                    {}
                    <button onClick={() => setviewjobstoggle()}> Back </button> <br></br>

                </Modal>
            </div>)
        } else if (accountstatus == "Seeker account") {
            return (<div>
                <div>Education: {data.seekr.Education}</div>
                <div>Description: {data.seekr.Description}</div>
                <div>Longtitude: {data.seekr.Longitude}</div>
                <div>Latitude: {data.seekr.Latitude}</div>

                <button onClick={() => h.push('/matched-jobs')}> give me jobs</button> <br></br>
                <button onClick={skill_mangement}>My skills</button>
                <Modal isOpen={skills}
                >
                    <ModalHeader>My skill list</ModalHeader>

                    <ModalBody>
                        {showskills()}

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="New skill"
                            onChange={(event) => setnewskills(event.target.value)}
                        />
                        <button onClick={addskill}>add </button>
                    </ModalBody>
                    <button onClick={() => setskills(!skills)}> Back </button>

                </Modal>

            </div>)
        } else {
            return (<div><button onClick={submit}>set up account</button></div>)
        }

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
        })).
            catch(error => {
                if (error.status === 404) {
                    console.log(error.status + error.statusText)
                } else if (error.status === 403) {
                    console.log(error.status + error.statusText)
                }
            })
    }

    function addskill() {
        if (newskills === undefined || newskills === "") {
            alert("skill can not be empty")
            return (1)
        }
        console.log(newskills.toUpperCase()
        )
        fetch('http://127.0.0.1:8000/seeker_skill/add/', {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Token " + token
            },
            body: JSON.stringify({
                'UserId': uid,
                'Skills': newskills.toUpperCase()
            })

        }).then(res => res.json()).then((data => {
            console.log(data)
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

    function accounttype() {
        if (type === "company") {
            return (<div>
                <label>company</label><br></br>
                Name<input onChange={event => setcname(event.target.value)} />    <br></br>
                Description <br></br> <textarea onChange={event => setdescription(event.target.value)} />   <br></br>
                Industry <input onChange={event => setedu(event.target.value)} />    <br></br>
                <button onClick={save}>Save</button>
            </div>)
        } else if (type === "seekr") {
            return (<div>
                <label>seekr Detail</label><br></br>
                latitude <input onChange={event => setlatitude(event.target.value)} />
                longtitude <input onChange={event => setlongtitude(event.target.value)} />    <br></br>
                Description <br></br> <textarea onChange={event => setdescription(event.target.value)} />   <br></br>
                Education <input onChange={event => setedu(event.target.value)} />    <br></br>
                <button onClick={save}>Save</button>
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
        <div>USER NAME: {username}</div>
        <div>FIRST NAME: {firstname}</div>
        <div>LAST NAME: {lastname}</div>
        <div>EMAIL: {email}</div>
        <div>Account status: {accountstatus} </div>

        {fancyfuntion()}
        <button onClick={logout}> Log out </button>
        <button><a href="/">back</a></button>

        {/* <Popup position="right center" open={accountsetup} modal nested onClose={closeModal}>

            <div className="header">Set your account now</div>
            <div className="modal">
                <a className="close" onClick={closeModal}>
                    &times;
            </a>
            </div>
            <form>
                <input type='radio' name="account type" onChange={() => settype("company")} /> Comapny
                <input type='radio' name="account type" onChange={() => settype("seekr")} /> Job Seekr

        </form>
            {accounttype()}



        </Popup> */}
        <Modal isOpen={accountsetup} >
            <div className="modal">
                <a className="close" onClick={closeModal}>
                    &times;
            </a>
            </div>
            <button onClick={submit} > Set up later</button>
            <ModalHeader>Your account is not set up yet!</ModalHeader>
            <ModalBody>
                <div className="header">Set your account now</div>
                <div className="modal">
                    <a className="close" onClick={closeModal}>
                        &times;
            </a>
                </div>
                <form>
                    <input type='radio' name="account type" onChange={() => settype("company")} /> Comapny
                <input type='radio' name="account type" onChange={() => settype("seekr")} /> Job Seekr

        </form>
                {accounttype()}


            </ModalBody>

        </Modal>


    </>

    )
}
export default Account;