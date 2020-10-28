import React, { Component } from 'react';

const list = [
  {text: 'Data Analyst'},
  {text: 'Project Manager'},
  {text: 'Hip Hop Dancer'},
  {text: 'Another world'},
];

const filterSearch = searchText => item => item.text.toLowerCase().includes(searchText.toLowerCase());

class Hello extends Component {
  constructor(props) {
    super(props);

    this.state = {
      list,
      searchText: ''
    }
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(event){
    this.setState({ searchText: event.target.value })
  }

  render() {
    const { list, searchText } = this.state;
    return (
      <div className="application">
        <input type="text" onChange={this.onSearch} />
        {list.filter(filterSearch(searchText)).map(item => 
          <li>{item.text}</li>
        )}
      </div>
    );
  }
}

export default Hello;
