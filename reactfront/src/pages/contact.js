import React, { useState } from 'react';
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
import {MDBContainer, MDBCol, MDBIcon, MDBBtn, MDBDataTable } from 'mdbreact';
import faker from "faker";
import { Delete } from "@material-ui/icons";

import 'bootstrap/dist/css/bootstrap.css';
import tableIcons from "./TableIcons.js";
import MaterialTable from "material-table";


const ContactPage= () => {
  const results = [...Array(50).keys()].map(i => {
  return {
    name: faker.name.findName(),
    state: faker.address.state(),
    account: faker.finance.account()
  };
});
  const [data, setData] = useState(results);
  const handleDeleteRows = (event, rowData) => {
    let _data = [...data];
    rowData.forEach(rd => {
      _data = _data.filter(t => t.tableData.id !== rd.tableData.id);
    });
    setData(_data);
  };
  

  return (
  
  <div>
  <h1> SEEKER </h1>
   
    <MaterialTable
      title="Select row(s) to get the option to delete"
      columns={[
        {
          title: "Name",
          field: "name"
        },
        {
          title: "State",
          field: "state"
        },
        {
          title: "Account",
          field: "account"
        }
      ]}
      data={data}
      options={{
        selection: true,
        pageSize: 10
      }}
      icons={tableIcons}
      actions={[
        {
          icon: () => <Delete />,
          tooltip: "Delete Rows",
          onClick: handleDeleteRows
        }
      ]}
    />
    
    
    
   </div>
  
  );
}




export default ContactPage;
