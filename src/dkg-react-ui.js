import React, {Component} from 'react';
import './dkg-react-ui.scss';


/*========================= TabPane =========================*/

export class TabPane extends Component {
  constructor(props) {
    super(props);
    this.tabClicked = this.tabClicked.bind(this);
  }

  tabClicked(tabIndex) {
    this.props.onTabSelected(tabIndex)
  }

  tabPaneChildren() {
    if (Array.isArray(this.props.children))
      return this.props.children;
    else if (this.props.children === undefined)
      return [];
    else
      return [this.props.children]
  }

  render() {
    let tabPaneChildren = this.tabPaneChildren();
    let tabPaneData = this.props.tabPaneData;
    let extraClassName = this.props.className !== undefined ? this.props.className : "";

    return (
      <div className={`tabs ${extraClassName}`}>
        <header>
          {
            tabPaneData.labels.map(
              (label, index) => (
                <Tab
                  key={`tab${index}`}
                  label={label} index={index}
                  selectedTab={tabPaneData.selectedTab}
                  onTabSelected={this.tabClicked} />
              )
            ) 
          }
        </header>
        <section className="panels">
          {
            tabPaneData.labels.map(
              (label, index) => (
                <div className="panel" key={`panel${index}`} active={isActive(index, tabPaneData.selectedTab)}>
                  {index < tabPaneChildren.length ? tabPaneChildren[index] : ""}
                </div>
              )
            ) 
          }
        </section>
      </div>
    );
  }
}

class Tab extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this, this.props.index);
  }

  handleClick(index, e) {
    this.props.onTabSelected(index);
  }

  render() {
    return (
      <div
        className="tab"
        key={`tab${this.props.index}`}
        active={isActive(this.props.index, this.props.selectedTab)}
        onClick={this.handleClick}>
          {this.props.label}
      </div>
    );
  }
}

const isActive = (tabIndex, selectedTab) => (tabIndex === selectedTab ? "yes" : "no");

export const createTabPaneData = (labels, selectedTab = 0) => ({labels: labels, selectedTab: selectedTab});

export const selectTab = (tabPaneData, tabIndex) => Object.assign(tabPaneData, {selectedTab: tabIndex});


/*========================= SplitPane =========================*/

export class SplitPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resizing: false,
      startMouseX: -1,
      startLeftSideWidth: -1,
      leftSideWidth: -1
    };

    this.leftSideRef = React.createRef();

    this.startResizing = this.startResizing.bind(this);
    this.resize = this.resize.bind(this);
    this.endResizing = this.endResizing.bind(this);
  }

  startResizing(e) {
    let leftSideWidth = this.leftSideRef.current.getBoundingClientRect().width;

    e.persist();
    this.setState((prevState, props) => {
      return Object.assign(prevState, {
        resizing: true,
        startMouseX: e.nativeEvent.pageX,
        startLeftSideWidth: leftSideWidth,
        leftSideWidth: leftSideWidth
      });
    });
  }

  resize(e) {
    if (this.state.resizing === true) {
      let mouseDeltaX = e.nativeEvent.pageX - this.state.startMouseX;

      e.preventDefault();

      e.persist();
      this.setState((prevState, props) => {
        return Object.assign(prevState, {
          leftSideWidth: (prevState.startLeftSideWidth + mouseDeltaX)
        });
      });
    }
  }

  endResizing(e) {
    this.setState((prevState, props) => {
      return Object.assign(prevState, {resizing: false});
    });
  }

  splitPaneChildren() {
    if (Array.isArray(this.props.children))
      return this.props.children;
    else if (this.props.children === undefined)
      return [];
    else
      return [this.props.children]
  }

  render() {
    let children = this.splitPaneChildren();
    let leftSideElement = (children.length > 0) ? children[0] : "";
    let rightSideElement = (children.length > 1) ? children[1] : "";
    let leftSideStyles = (this.state.leftSideWidth === -1) ? {} : {width: `${this.state.leftSideWidth}px`};

    return (
      <div className="splitpane" onMouseMove={this.resize} onMouseUp={this.endResizing}>
        <section className="leftside" style={leftSideStyles} ref={this.leftSideRef}>
            {leftSideElement}
        </section>
        <div className="resizer" onMouseDown={this.startResizing}></div>
        <section className="rightside">
            {rightSideElement}
        </section>
      </div>
    );
  }
}


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


/*========================= Grid =========================*/

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


/*========================= MediaViewer =========================*/

export class MediaViewer extends Component {
  constructor(props) {
    super(props);
    this.mediaClicked = this.mediaClicked.bind(this);
    this.magnifiedMediaClicked = this.magnifiedMediaClicked.bind(this);
  }

  mediaClicked(index) {
    this.props.onMediaSelected(index);
  }

  magnifiedMediaClicked() {
    this.props.onMagnifiedMediaHidden();
  }

  render() {
    return (
      <div className="media-viewer">
        {this.props.mediaViewerData.mediaList.map((media, index) => (
          <Media
            key={index}
            index={index}
            selectedIndex={this.props.mediaViewerData.selectedMedia}
            media={media}
            mediaFolder={this.props.mediaFolder}
            onMediaClicked={this.mediaClicked} />
        ))}
        {this.props.mediaViewerData.selectedMedia !== -1 &&
          <MagnifiedMedia
            media={this.props.mediaViewerData.mediaList[this.props.mediaViewerData.selectedMedia]}
            mediaFolder={this.props.mediaFolder}
            onMediaClicked={this.magnifiedMediaClicked} />
        }
      </div>
    );
  }
}
  
class Media extends Component {
  constructor(props) {
    super(props);
    this.mediaClicked = this.mediaClicked.bind(this, this.props.index);
  }

  mediaClicked(index) {
    this.props.onMediaClicked(index);
  }

  render() {
    let classNameSelected = (this.props.selectedIndex === this.props.index) ? "selected" : "";
    let mediaName = fullMediaName(this.props.mediaFolder, this.props.media.name);

    return (
      this.props.media.name.endsWith(".mp4")
        ? <video className={classNameSelected} onClick={this.mediaClicked}>
            <source src={mediaName} type="video/mp4"/>
          </video>
        : <img
            className={classNameSelected}
            src={mediaName} 
            alt={this.props.media.caption}
            onClick={this.mediaClicked} />
    );
  }
}

class MagnifiedMedia extends Component {
  constructor(props) {
    super(props);
    this.coverClicked = this.coverClicked.bind(this);
  }

  coverClicked(e) {
    e.preventDefault();
    this.props.onMediaClicked();
  }

  render() {
    let mediaName = fullMediaName(this.props.mediaFolder, this.props.media.name);

    return (
      <div className="magnified-media">
        <div className="cover" onClick={this.coverClicked}></div>
        {this.props.media.name.endsWith(".mp4")
          ? <video controls>
              <source src={mediaName} type="video/mp4"/>
            </video>
          : <img src={mediaName} alt={this.props.media.caption} />
        }
      </div>
    );
  }    
}

const fullMediaName = (mediaFolder, mediaName) => (mediaFolder + "/" + mediaName);

export const createMediaViewerData = (mediaList, selectedMedia = -1) => ({mediaList: mediaList, selectedMedia: selectedMedia});

export const selectMedia = (mediaViewerData, mediaIndex) => Object.assign(mediaViewerData, {selectedMedia: mediaIndex});

export const unselectCurrentMedia = (mediaViewerData) => Object.assign(mediaViewerData, {selectedMedia: -1});
