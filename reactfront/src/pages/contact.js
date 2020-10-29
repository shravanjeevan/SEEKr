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

import { MDBDataTable } from 'mdbreact';



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
        field: 'office',
        sort: 'asc',
        width: 200
      },
      {
        label: '',
        field: 'extra',
        sort: 'asc',
        width: 100
      },
      ,
      {
        label: '',
        field: 'extra1',
        sort: 'asc',
        width: 100
      },
      ,
      {
        label: '',
        field: 'extra2',
        sort: 'asc',
        width: 100
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
        office: '',
        extra: '',
        age: 'Apply'
       
      },
      {
        name: 'Project Manager',
        position: '82%',
        office: '',
        extra1: '',
        extra2: '',
        extra: '',
        age: 'Apply'
      },
      {
        name: 'Hip-Hop dancer',
        position: '32%',
        office: '',
        extra: '',
        extra1: '',
        extra2: '',
        age: 'Apply'
      },
      {
        name: 'Others',
        position: '10%',
        office: '',
        extra: '',
        extra1: '',
        extra2: '',
        age: 'Apply'
      }
    ]
  };

  return (
    <Layout>
    <MDBDataTable
      striped
      bordered
      large
      data={data}
    />
    </Layout>
  );
}




export default ContactPage;
