import React, { useState } from 'react';
import Layout from '../layouts/index';
import Header from '../components/layout/Header-withoutBody';
import Footer from '../components/layout/Footer';
import Hello from '../components/Hello';
import Container from '@material-ui/core/Container';
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
//import faker from "faker";
import { Delete } from "@material-ui/icons";

import 'bootstrap/dist/css/bootstrap.css';
import tableIcons from "./TableIcons.js";
import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import { forwardRef } from 'react';


const MatchingJobPage= () => {
  const { useState } = React;

  const [columns, setColumns] = useState([

    { title: 'Job Title', field: 'job' , headerStyle: {
                backgroundColor: "#FDF6F7", fontSize: 16
              } },
    {
      title: 'Skills',
      field: 'skills',
      lookup: { 1: 'Project Management', 2: 'Data Analysis', 3: 'Organisation', 4: 'Time Management', 5: 'Communication' },
    },

      {
      title: 'Location',
      field: 'location',
      lookup: { 1: 'NSW', 2: 'ACT', 3: 'Victoria', 4: 'WA', 5: 'QLD' },
    },


    {
      title: 'Salary',
      field: 'salary',
      lookup: { 1: '40K', 2: '50K', 3: '60K', 4: '70K', 5: '80K+' },
    },
    

  ]);

  const [data, setData] = useState([
    { job: 'Data Analyst', skills: 2, location: 1, salary: 5},
  ]);


  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
  };
 

  return (
  <div>
  <Header />
  <br></br>
  <br></br>
  <br></br>
  <Container fixed>
    <MaterialTable
          title = "Job Postings"
          columns={columns}
          data={data}
          options={{
            headerStyle: {
              backgroundColor: "#FDF6F7",
              fontSize: 16
            }
          }}
          editable={{
            onRowAdd: newData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  setData([...data, newData]);
                  
                  resolve();
                }, 1000)
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...data];
                  const index = oldData.tableData.id;
                  dataUpdate[index] = newData;
                  setData([...dataUpdate]);

                  resolve();
                }, 1000)
              }),
            onRowDelete: oldData =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...data];
                  const index = oldData.tableData.id;
                  dataDelete.splice(index, 1);
                  setData([...dataDelete]);
                  
                  resolve()
                }, 1000)
              }),
          }}
          icons={tableIcons}
           detailPanel={[
        {

          tooltip: 'Show Name',
          render: rowData => {
            return (
              <div
                style={{
                  fontSize: 50,
                  textAlign: 'center',
                  backgroundColor: "#FDF6F7b",
                  color: '#FDF6F7',
                  
                }}
              >
                {rowData.name}
              </div>
            )
          },
        }
      ]}
   
      />
      </Container>
    <Footer />
    </div>
    
    );
  }




export default MatchingJobPage;
