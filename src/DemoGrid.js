import React, {Component} from 'react';
import {Grid, createGridData, createGridColumn, GridModel, DefaultGridRenderer} from './Grid';


const rowSelectionChange = (indices) => {
  console.log(Array.from(indices));
};


class TestInput extends Component {
  nullOnChange = e => {}

  render() {
    return (
      <input type="text" value={this.props.v} onChange={this.nullOnChange} style={{width: "calc(100% - 4px)"}}/>
    );
  }
}


class TestRenderer extends DefaultGridRenderer {
  renderData(data, rowIndex, columnIndex) {
    return (columnIndex === 2) ? <TestInput v={data}/> : data;
  }
}


class TestGridModel extends GridModel {
  constructor() {
    super(new Set([3,7]));
    this._columns = [
      createGridColumn(3),
      createGridColumn(2),
      createGridColumn(3),
      createGridColumn(2)
    ];
    this._headers = ["ColA", "Age", "DOB", "Hobby"];
  }

  get columnCount() {
    return this._columns.length;
  }

  column(columnIndex) {
    return this._columns[columnIndex]
  }

  get hasHeader() {
    return true;
  }

  header(columnIndex) {
    return this._headers[columnIndex];
  }

  get rowCount() {
    return 10;
  }

  data(columnIndex, rowIndex) {
    return `row:${rowIndex} col:${columnIndex}`;
  }
}


export class DemoGrid extends Component {
  constructor(props) {
    super(props);
    /*
    this._model = createGridData(
      [1, 3, 1],
      [
        ["Last Name", "First Name", "Hobby"],
        ["a", "c", "b"],
        ["Grant", "Dennis", "Soccer"],
        ["Brown", "Carla", "Sing"],
        ["Shuster", "Wayne", "Acting"]
      ]
    );
    */
    this._model = new TestGridModel();
    this._renderer = new TestRenderer();
  }

  render() {
    return (
      <Grid gridData={this._model} renderer={this._renderer} multiSelect={true} onRowSelectionChange={rowSelectionChange} />
    )
  }
}
