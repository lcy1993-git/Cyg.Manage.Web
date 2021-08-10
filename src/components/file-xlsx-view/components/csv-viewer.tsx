
import React, { Component } from 'react';

import ReactDataGrid from 'react-data-grid';
import CSV from 'comma-separated-values';

class CsvViewer extends Component {

  static parse(data) {
    const rows = [];
    const columns = [];
    console.log(new CSV(data).encode());
    
    new CSV(data).forEach((array) => {
      console.log(array);
      
      if (columns.length < 1) {
        array.forEach((cell, idx) => {

          
          columns.push({
            key: `key-${idx}`,
            name: cell,
            resizable: true,
            sortable: true,
            filterable: true,
          });
        });
      } else {
        const row = {};
        array.forEach((cell, idx) => {
          console.log(cell);
          row[`key-${idx}`] = cell;
        });
        rows.push(row);
      }
    },{},(e) =>{
      console.log(e);
      return e
      
    });

    return { rows, columns };
  }

  constructor(props) {
    super(props);

    
    this.state = CsvViewer.parse(props.data);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(CsvViewer.parse(nextProps.data));
  }

  render() {
    const { rows, columns } = this.state;

    console.log({rows});
    console.log({columns});

    return (
      <ReactDataGrid
        columns={columns}
        rows={rows}
        rowsCount={rows.length}
        rowGetter={i => rows[i]}
        // minHeight={this.props.height || 650}
      />
    );
  }
}

export default CsvViewer;
