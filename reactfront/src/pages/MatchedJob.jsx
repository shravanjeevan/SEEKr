import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory } from 'react-router-dom'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Add } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';


function Matchlist() {
    const h = useHistory()
    const [userdata, setuserdata] = useState()
    const [joblist, setjoblist] = useState()
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
                setjoblist(data)
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

    function rendertable() {
        if (!joblist) {
            return (<>
                loading
            </>)
        } else {
            var table = joblist
            console.log(table)
            return (<>
                <table className="MyClassName">
                    <thead>
                        <tr>
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
                                    <td>{table[element].JobListingId}</td>
                                    <td>{table[element].PercentageMatch}</td>
                                    <td>{table[element].Status}</td>
                                    {(table[element].Status==0) &&
                                    <td><button>Apply</button></td>
                                    }
                                    {(table[element].Status==1) &&
                                    <td><button>unApply</button></td>
                                    }
                                </tr>
                            )
                        })
                        }
                    </tbody>
                </table>                </>)
        }

    }

    return (<>
        <div>
            {rendertable()}
        </div>
        <div>
            <button onClick={() => h.push("/account")}>Back</button>
        </div>
    </>)
}

export default Matchlist;