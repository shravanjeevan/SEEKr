import React, { Component, useState, useEffect } from 'react';
import { render } from 'react-dom';
import cookies from 'react-cookies'
import { useHistory } from 'react-router-dom'
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { Add } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';

function Job_detial(para){
    const [toggleview,settoggleview] = useState(para.toggle)


    return(
        <Modal isOpen={toggleview} ></Modal>
    )

}
export default Job_detial;