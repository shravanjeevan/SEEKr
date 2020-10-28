import React, { Component, useState,useEffect } from 'react';
import { render } from 'react-dom';
import cookie from 'react-cookies'


function Account(){
    useEffect(()=>{
        window.open("/login")
    })
}