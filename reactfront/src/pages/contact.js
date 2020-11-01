import React from 'react';
import Layout from '../layouts/index';
import Hello from '../components/Hello';
import mytable from '../components/mytable';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Demo from '../components/Demo';
import { MDBBtn, MDBDataTable } from 'mdbreact';
import 'bootstrap/dist/css/bootstrap.css';


const ContactPage= () => {
  const data = {
    columns: [
      {
        label: '',
        field: 'name',
        sort: 'asc',
        width: 150
      },
      {
        label: '',
        field: 'position',
        sort: 'asc',
        width: 270
      },
      {
        label: '',
        field: 'age',
        sort: 'asc',
        width: 100
      }
    ],
    rows: [
      {
        name: 'Data Analyst',
        position: '90%',
        age: <Demo color="purple" size="sm">Apply</Demo>
       
      },
      {
        name: 'Project Manager',
        position: '82%',
        age: <Demo color="purple" size="sm">Apply</Demo>
      },
      {
        name: 'Hip-Hop dancer',
        position: '32%',
        age: <Demo color="purple" size="sm">Apply</Demo>
      },
      {
        name: 'Others',
        position: '10%',
        age: <Demo color="purple" size="sm">Apply</Demo>
      }
    ]
  };

  return (
  
  <Layout>
    <MDBDataTable style={{width:'650px',  marginleft : '-200', }}




      striped
      bordered
      small
      data={data}
    />
    </Layout>
  
  );
}




export default ContactPage;
