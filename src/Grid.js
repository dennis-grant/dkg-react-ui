import React, {Component} from 'react';    // exclude from merge
import './Grid.scss';                      // exclude from merge


/*========================= Grid =========================*/

export class Grid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      highlightedRow: -1
    };

    this.highlightRow = this.highlightRow.bind(this);
    this.unhighlightRow = this.unhighlightRow.bind(this);
    this.selectRow = this.selectRow.bind(this);
  }

  highlightRow(rowIndex) {
    this.setState({highlightedRow: rowIndex});
  }

  unhighlightRow() {
    this.setState({highlightedRow: -1});
  }

  selectRow(rowIndex) {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(rowIndex);
    }
  }

  render() {
    const gridData = this.props.gridData;
    const hasHeaderClassName = gridData.hasHeader ? "has-header" : "";
    const hasNoItems = (gridData.rows.length === 1 && gridData.hasHeader) || (gridData.rows.length === 0);
    const colSizes = gridData.cols.map(col => col.size).join(" ");

    return (
      <div className={`grid ${hasHeaderClassName}`} style={{gridTemplateColumns: colSizes}}>
        {
          gridData.rows.map(
            (gridRowData, rowIndex) => {
              let evenOddClassName = (rowIndex % 2) === 0
                ? "row-even"
                : "row-odd";
              let highlightedClassName = (rowIndex === this.state.highlightedRow)
                ? "highlighted-row"
                : "";
              let selectedClassName = (rowIndex === gridData.selectedRow)
                ? "selected-row"
                : "";

              return gridRowData.map((colData, columnIndex) => {
                return (columnIndex < gridData.cols.length
                  ? <div 
                      key={`${rowIndex}:${columnIndex}`} 
                      className={`row${rowIndex} ${evenOddClassName} ${highlightedClassName} ${selectedClassName}`}
                      onMouseEnter={this.highlightRow.bind(this, rowIndex)}
                      onMouseLeave={this.unhighlightRow}
                      onClick={this.selectRow.bind(this, rowIndex)}
                      style={{textAlign: gridData.cols[columnIndex].align}}>
                        {colData}
                    </div>
                  : null
                );
              })
            }
          )
        }
        {hasNoItems && <div className={"no-items"}>No Items Available</div>}
      </div>
    );
  }
}

const gridColumnsInfo = (columnInfo) => {
  let info = (columnInfo !== undefined) ? {...columnInfo} : {size: "auto", align: "left"};

  if (Number.isInteger(info.size))
    info.size = info.size + "fr";

  if (info.align === undefined)
    info.align = "left";

  return info;
};

export const createGridData = (columnsInfo, data, hasHeader = true, selectedRow = -1) => {
  return {
    hasHeader,
    cols: columnsInfo.map(col => gridColumnsInfo(col)),
    rows: data,
    selectedRow
  }
};
