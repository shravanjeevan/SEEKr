
//sign up template taken from https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates

import React, { Component, useState, useEffect } from 'react';
import './styles.css';
import RadioButtons from './new-buttons';
import history from './history';
import Radio from '@material-ui/core/Radio';
//import Layout from '../layouts/custom-index';
import Header from '../components/layout/Header-withoutBody';
import Footer from '../components/layout/Footer-withoutLinks';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import cookies from 'react-cookies'
import { useHistory } from 'react-router-dom'
// import Account from './Account';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const [email, setemail] = useState()
  const [username, setusername] = useState()
  const [firstname, setfirstname] = useState()
  const [lastname, setlastname] = useState()
  const [password, setpassword] = useState()
  const [confirmation, setconfirmation] = useState()
  const h = useHistory()
  const classes = useStyles();

  useEffect(()=>{
    if (cookies.load("t") !== "" &&cookies.load("t") !== undefined) {
      h.push("/account")
    }
  },[])
  
  function submit() {
    console.log("submit")

    if (confirmation !== password) {
      alert("confirmation should be same as password")
      return 1
    }
    var re = {
      "username": username,
      "password": confirmation,
      "email": email,
      "first_name": firstname,
      "last_name": lastname
    }
    console.log(re)
    if (password === undefined || password === "") {
      alert("Password field can not be empty")
      return 1
    } else if (username === undefined || username === "") {
      alert("username field can not be empty")
      return 1
    } else if (firstname === undefined || firstname === "") {
      alert("firstname field can not be empty")
      return 1
    } else if (lastname === undefined || lastname === "") {
      alert("lastname field can not be empty")
      return 1
    } else if (email === undefined || email === "") {
      alert("email field can not be empty")
      return 1
    }

    fetch('http://127.0.0.1:8000/user/register/', {
      method: "post",
      body: JSON.stringify(re),
      headers: {
        'Content-Type': 'application/json'
      }

    }).then(res => res.json()).then((data => {
      console.log(data)
      if (data.message) {
        alert("Successful sign up")
        h.push("/account")
      } else if (data.email) {
        alert(data.email)
      } else if (data.username) {
        alert(data.username)

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

  return (
    <div>
      <Header />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Get Started with SEEKr
            </Typography>
          <form className={classes.form} noValidate>
            <Grid container>
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
                  <br></br>
                  <br></br>
                <form>
                 <div class="my-style btn-group" data-toggle="buttons">
                <label class="btn btn-primary form-check-label active">
                  <input class="form-check-input" type="radio" name="options" id="option1" autocomplete="off" checked/>
                  I am looking for a job
                </label>
                <label class="btn btn-primary form-check-label">
                  <input class="form-check-input" type="radio" name="options" id="option2" autocomplete="off"/> I am looking for employees
                </label>
                 </div>
                 </form>
                <br></br>
                <br></br>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  autoFocus
                  onChange={event =>setfirstname(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoComplete="lname"
                  onChange={event => setlastname(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  onChange={event => setemail(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Your User Name"
                  autoComplete="current-password"
                  onChange={event =>setusername(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  onChange={event => setpassword(event.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  onChange={event => setconfirmation(event.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submit}
            >
              Sign Up
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              
            >
            <a href="/">back</a>
            </Button>
          </form>
        </div>
        <Box mt={5}>
        </Box>
      </Container>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}
