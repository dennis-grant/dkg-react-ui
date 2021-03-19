import React, {Component} from 'react';    // exclude from merge
import './Tree.scss';                      // exclude from merge


/*========================= Tree =========================*/

export class Tree extends Component {
  render() {
    return this._renderTree(this.props.treeData, 1, []);
  }

  _renderTree(treeData, level, path) {
    let isLeaf = (treeData.items === undefined);
    let showItems = (isLeaf === false && treeData.expanded === true);
    let pathStr = path.join(":");

    return (
      <Collapsable
        key={pathStr}
        title={treeData.title}
        expanded={treeData.expanded === true}
        level={level}
        path={path}
        isLeaf={isLeaf}
        onExpand={this.props.onExpand}
        onCollapse={this.props.onCollapse}>
          {(showItems === true)
            ? treeData.items.map(
                (item, index) => this._renderTree(item, level + 1, path.concat([index]))
              )
            : []
          }
      </Collapsable>
    );
  }
}

class Collapsable extends Component {
  constructor(props) {
    super(props);
    this.expandClicked = this.expandClicked.bind(this, this.props.path);
    this.collapseClicked = this.collapseClicked.bind(this, this.props.path);
  }

  expandClicked(p, e) {
    this.props.onExpand(p);
  }

  collapseClicked(p, e) {
    this.props.onCollapse(p);
  }

  render() {
    let isLeafClassName = (this.props.isLeaf === true) ? "isLeaf" : "";
    let expandedClassName = (this.props.expanded === true) ? "expanded" : "collapsed";

    return (
      <div className={`collapsable ${expandedClassName} ${isLeafClassName}`}>
        <header>
          <div className="showdetails" onClick={this.expandClicked}>[+]</div>
          <div className="hidedetails" onClick={this.collapseClicked}>[-]</div>
          <title>{this.props.title}</title>
        </header>
        <section>
          {this.props.children}
        </section>
      </div>
    );
  }
}

export const collapseTreeBranch = (treeData, path) => updateTreeBranch(treeData, [...path], {expanded: false});

export const expandTreeBranch = (treeData, path) => updateTreeBranch(treeData, [...path], {expanded: true});

const updateTreeBranch = (treeData, path, updateInfo) => {
  if (path.length === 0) {
    return Object.assign(treeData, updateInfo);
  }
  else {
    let itemIndex = path[0];

    path.shift();

    return Object.assign(treeData, {
      items: [].concat(
        treeData.items.slice(0, itemIndex),
        [updateTreeBranch(treeData.items[itemIndex], path, updateInfo)],
        treeData.items.slice(itemIndex + 1)
      )
    });
  }
};
