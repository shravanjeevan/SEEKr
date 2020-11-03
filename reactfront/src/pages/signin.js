
//sign in template taken from https://github.com/mui-org/material-ui/tree/master/docs/src/pages/getting-started/templates

import React, { Component, useState, useEffect } from 'react';
import Header from '../components/layout/Header-withoutBody';
import Footer from '../components/layout/Footer-withoutLinks';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [username, setusername] = useState()
  const [password, setpassword] = useState()
  const [token, settoken] = useState()
  var show = "visible"
  const h = useHistory()

  useEffect(()=>{
    if (cookies.load("t") !== "" &&cookies.load("t") !== undefined) {
      h.push("/account")
    }
  },[])

  function submit() {
    var re = {
      "username": username,
      "password": password
    }
    console.log(re)
    if (username === "" || password === "" || username === undefined || password === undefined) {
      alert("Username or Password can not be empty")
      return
    }
    fetch('http://127.0.0.1:8000/auth/login', {
      method: "post",
      body: JSON.stringify(re),
      headers: {
        'Content-Type': 'application/json'
      }

    }).then(res => res.json()).then((data => {
      console.log(data)
      if (data.token) {
        settoken(data.token)
        cookies.remove("t", token, { path: "/" })
        cookies.save("t", data.token, { path: "/" })
        alert("Successful log in")
        h.push("/account")
      } else {
        alert(data.non_field_errors[0])
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
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  <br></br>
                  {"Don't have an account? Sign Up"}
                  <br></br>
                  <br></br>
                </Link>
              </Grid>
            </Grid>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              autoComplete="username"
              autoFocus
              onChange={event =>setusername(event.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={event => setpassword(event.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="contact" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
        </Box>
      </Container>
      <br></br>
      <br></br>
      <br></br>
      <Footer />
    </div>
  );
}