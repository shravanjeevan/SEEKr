import React, { useState } from "react";
import "./styles.css";
import MaterialTable from "material-table";
import DeleteIcon from "@material-ui/icons/Delete";
import SearchIcon from "@material-ui/icons/Search";
import SaveIcon from "@material-ui/icons/Save";
import { Button } from "@material-ui/core";

export default function App() {
  const [dataStore, setDataStore] = useState([
    { name: "Jon", job: "Software Dev", age: 29 }
  ]);

  return (
    <div className="App">
      <h1>Material-Table Demo</h1>
      <a href="https://medium.com/better-programming/intro-to-material-table-for-react-74db0fbd2d32">
        Click here for an intro to material-table
      </a>
      <div style={{ maxWidth: "100%", paddingTop: "12px" }}>
        <MaterialTable
          columns={[
            {
              title: "Name",
              field: "name",
              headerStyle: {
                backgroundColor: "green"
              }
            },
            {
              title: "Occupation",
              field: "job",
              headerStyle: {
                backgroundColor: "blue"
              }
            },
            {
              title: "Age",
              field: "age",
              type: "numeric",
              headerStyle: {
                backgroundColor: "red"
              }
            }
          ]}
          data={dataStore}
          title="Material-Table Demo"
          icons={{
            Clear: (props) => <DeleteIcon />,
            Search: (props) => <SearchIcon />,
            ResetSearch: (props) => <DeleteIcon />
          }}
          actions={[
            {
              icon: () => <SaveIcon />,
              tooltip: "Save User",
              onClick: (event, rowData) => alert("You saved " + rowData.name)
            }
          ]}
          components={{
            Action: (props) => (
              <Button
                onClick={(event) => props.action.onClick(event, props.data)}
                color="primary"
                variant="text"
                style={{ textTransform: "none" }}
                size="small"
              >
                Save
              </Button>
            )
          }}
          options={{
            headerStyle: {
              backgroundColor: "#01579b",
              color: "#FFF"
            }
          }}
        />
      </div>
    </div>
  );
}

