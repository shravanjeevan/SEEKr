import React, { Component } from 'react';
import Demo from "../components/Demo";

const table = [
 
];

const filterSearch = searchText => item => item.text.toLowerCase().includes(searchText.toLowerCase());

class Hello extends Component {
  constructor(props) {
    super(props);

    this.state = {
      table,
      searchText: ''
    }
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(event){
    this.setState({ searchText: event.target.value })
  }

  render() {
    const { table, searchText } = this.state;
    return (
      <div className="application">
        <input type="text" onChange={this.onSearch} />
        {table.filter(filterSearch(searchText)).map(item => 
          <li>{item.text}</li>
        )}
      </div>
    );
  }
}

export default Hello;
