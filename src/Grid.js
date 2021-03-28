import React, {Component} from 'react';    // exclude from merge
import './Grid.scss';                      // exclude from merge


/*========================= Grid =========================*/

class GridCheckBox extends Component {
  render() {
    return (
      <div className={"grid-checkbox"}>
        <input type="checkbox" checked={this.props.value === true} onClick={this.props.onClick} />
      </div>
    );
  }
}


export class Grid extends Component {
  constructor(props) {
    super(props);

    this.highlightRow = this.highlightRow.bind(this);
    this.unhighlightRow = this.unhighlightRow.bind(this);
    this.toggleSelectRow = this.toggleSelectRow.bind(this);
    this.toggleSelectAllRows = this.toggleSelectAllRows.bind(this);

    this.state = {
      highlightedRow: -1
    };

    this._gridData = this.props.gridData;
    this._renderer = this.props.renderer ?? new DefaultGridRenderer();
    if (this.props.multiSelect === true) {
      this._gridData = new MultiSelectGridModel(this._gridData);
      this._renderer = new MultiSelectGridRenderer(this._renderer, this.toggleSelectAllRows);
    }
  }

  highlightRow(rowIndex) {
    this.setState({highlightedRow: rowIndex});
  }

  unhighlightRow() {
    this.setState({highlightedRow: -1});
  }

  toggleSelectRow(rowIndex) {
    this._gridData.toggleRowSelection(rowIndex, this.props.multiSelect);
    if (this.props.onRowSelectionChange) {
      this.props.onRowSelectionChange(this._gridData.selectedRowIndices);
    }
  }

  toggleSelectAllRows() {
    this._gridData.toggleAllRowsSelection();
  }

  render() {
    const hasHeaderClass = this._gridData.hasHeader ? "has-header" : "";
    const multiSelectClass = (this.props.multiSelect === true) ? "multi-select" : "";
    const rowIndices = [...Array.from({length: this._gridData.rowCount}).keys()];
    const columnIndices = [...Array.from({length: this._gridData.columnCount}).keys()];
    const columnSizes = columnIndices.map(columnIndex => this._gridData.column(columnIndex).size).join(" ");

    return (
      <div className={`grid ${hasHeaderClass} ${multiSelectClass}`} style={{gridTemplateColumns: columnSizes}}>
        {
          this._gridData.hasHeader
          &&
          columnIndices.map(columnIndex => {
            const cellClass = `row0 column${columnIndex} row-even`;
            const cellStyle = {alignItems: this._gridData.column(columnIndex).alignItems};
            return (
              <div key={`0:${columnIndex}`} className={cellClass} style={cellStyle}>
                {this._renderer.renderHead(this._gridData.header(columnIndex), columnIndex)}
              </div>
            );
          })
        }
        {
          rowIndices.map(rowIndex => {
            let evenOddClass = ((rowIndex + 1) % 2) === 0 ? "row-even" : "row-odd";
            let highlightedClass = (rowIndex === this.state.highlightedRow) ? "highlighted-row" : "";
            let selectedClass = this._gridData.isSelected(rowIndex) ? "selected-row" : "";

            return columnIndices.map(columnIndex => {
              const cellClass = `row${rowIndex + 1} column${columnIndex} ${evenOddClass} ${highlightedClass} ${selectedClass}`;
              const cellStyle = {alignItems: this._gridData.column(columnIndex).alignItems};
              return (
                <div 
                   key={`${rowIndex + 1}:${columnIndex}`} 
                   className={cellClass}
                   onMouseEnter={this.highlightRow.bind(this, rowIndex)}
                   onMouseLeave={this.unhighlightRow}
                   onClick={this.toggleSelectRow.bind(this, rowIndex)}
                   style={cellStyle}>
                     {this._renderer.renderData(this._gridData.data(columnIndex, rowIndex), rowIndex, columnIndex)}
                </div>
              );
            })
          })
        }
        {this._gridData.rowCount === 0 && <div className={"no-items"}>No Items Available</div>}
      </div>
    );
  }
}

export const createGridData = (columnsInfo, rows, hasHeader = true, selectedRowIndices = []) => {
  selectedRowIndices = Number.isInteger(selectedRowIndices)
    ? (selectedRowIndices === -1 ? [] : [selectedRowIndices])
    : selectedRowIndices;
  const columns = columnsInfo.map(col => createGridColumn(col))
  return new DefaultGridModel(hasHeader, columns, rows, new Set(selectedRowIndices));
};

export const createGridColumn = (columnInfo) => {
  // undefined
  columnInfo = columnInfo ?? {};

  // support simple integer for size
  columnInfo = Number.isInteger(columnInfo)
    ? {size: `${columnInfo}fr`}
    : columnInfo;
  columnInfo.size = columnInfo.size !== undefined && Number.isInteger(columnInfo.size)
    ? `${columnInfo.size}fr`
    : columnInfo.size;

  // support use of align attribute
  columnInfo.align = (columnInfo.align === "left")
    ? "flex-start"
    : (columnInfo.align === "right")
      ? "flex-end"
      : columnInfo.align;
  columnInfo.alignItems = columnInfo.alignItems ?? columnInfo.align ?? "flex-start";

  return {size: "auto", ...columnInfo};
};


export class DefaultGridRenderer {
  renderHead(headData, columnIndex) {
    return headData;
  }

  renderData(data, rowIndex, columnIndex) {
    return data;
  }
}


class MultiSelectGridRenderer {
  constructor(renderer, onToggleSelectAllRows) {
    this._gridRender = renderer;
    this._onToggleSelectAllRows = onToggleSelectAllRows;
  }

  renderHead(headData, columnIndex) {
    return (columnIndex === 0)
      ? <GridCheckBox value={headData} onClick={this._onToggleSelectAllRows} />
      : this._gridRender.renderHead(headData, columnIndex - 1);
  }

  renderData(data, rowIndex, columnIndex) {
    return (columnIndex === 0)
      ? <GridCheckBox value={data} />
      : this._gridRender.renderData(data, rowIndex, columnIndex - 1);
  }
}


export class GridModel {
  constructor(selectedRowIndices) {
    this._selectedRowIndices = selectedRowIndices;
  }

  get rowCount() {
    return 0;
  }

  toggleRowSelection(index, multiSelect = false) {
    if (this._selectedRowIndices.has(index))
      this._selectedRowIndices.delete(index);
    else {
      if (multiSelect !== true)
        this._selectedRowIndices.clear();
      this._selectedRowIndices.add(index);
    }
  }

  toggleAllRowsSelection() {
    if (this.isAllSelected) {
      this._selectedRowIndices.clear();
    }
    else {
      const rowIndices = [...Array.from({length: this.rowCount}).keys()];
      rowIndices.forEach(index => {
        this._selectedRowIndices.add(index);
      });
    }
  }

  get selectedRowIndices() {
    return this._selectedRowIndices;
  }

  isSelected(rowIndex) {
    return this._selectedRowIndices.has(rowIndex);
  }

  get isAllSelected() {
    return (this.rowCount > 0 && this._selectedRowIndices.size === this.rowCount);
  }
}


class DefaultGridModel extends GridModel {
  constructor(hasHeader, columns, rows, selectedRowIndices) {
    super(selectedRowIndices);

    this._hasHeader = hasHeader;
    this._columns = columns;
    this._headerRow = (hasHeader === true) ? rows[0] : null;
    this._dataRows = (hasHeader === true) ? rows.slice(1) : rows;
  }

  get columnCount() {
    return this._columns.length;
  }

  column(columnIndex) {
    return this._columns[columnIndex]
  }

  get hasHeader() {
    return this._hasHeader;
  }

  header(columnIndex) {
    return this._headerRow[columnIndex];
  }

  get rowCount() {
    return this._dataRows.length;
  }

  data(columnIndex, rowIndex) {
    return this._dataRows[rowIndex][columnIndex];
  }
}


class MultiSelectGridModel {
  constructor(model) {
    this._gridModel = model;
  }

  get columnCount() {
    return this._gridModel.columnCount + 1;
  }

  column(columnIndex) {
    return (columnIndex > 0)
      ? this._gridModel.column(columnIndex - 1)
      : {size: "auto", align: "center"};
  }

  get hasHeader() {
    return this._gridModel.hasHeader;
  }

  header(columnIndex) {
    return (columnIndex > 0)
      ? this._gridModel.header(columnIndex - 1)
      : this._gridModel.isAllSelected;
  }

  get rowCount() {
    return this._gridModel.rowCount;
  }

  toggleRowSelection(index, multiSelect) {
    this._gridModel.toggleRowSelection(index, multiSelect);
  }

  toggleAllRowsSelection() {
    this._gridModel.toggleAllRowsSelection();
  }

  get selectedRowIndices() {
    return this._gridModel.selectedRowIndices;
  }

  isSelected(rowIndex) {
    return this._gridModel.isSelected(rowIndex);
  }

  get isAllSelected() {
    return this._gridModel.isAllSelected;
  }

  data(columnIndex, rowIndex) {
    return (columnIndex > 0)
      ? this._gridModel.data(columnIndex - 1, rowIndex)
      : this.isSelected(rowIndex);
  }
}
