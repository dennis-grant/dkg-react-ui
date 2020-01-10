import React, {Component} from 'react';
import './Grid.scss';


export class Grid extends Component {
  render() {
    let gridData = this.props.gridData;
    let hasHeaderClassName = gridData.hasHeader ? "has-header" : "";

    return (
      <div className={`grid ${hasHeaderClassName}`} style={{gridTemplateColumns: gridData.cols.join(" ")}}>
        {
          gridData.rows.map(
            (gridRowData, rowIndex) => {
              let evenOddClassName = (rowIndex % 2) === 0 ? "row-even" : "row-odd";
              return gridRowData.map((colData, columnIndex) => {
                return <div key={`${rowIndex}:${columnIndex}`} className={`row${rowIndex} ${evenOddClassName}`}>{colData}</div>
              })
            }
          )
        }
      </div>
    );
  }
}

const gridColumnSize = (size) => {
  if (size === undefined)
    return "auto";
  else if (Number.isInteger(size))
    return size + "fr";
  else
    return size;
};

export const createGridData = (columnSizes, data, hasHeader = true) => {
  return {
    hasHeader: hasHeader,
    cols: columnSizes.map(size => gridColumnSize(size)),
    rows: data
  }
};
