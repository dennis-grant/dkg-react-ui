import React, {Component} from 'react';
import './SplitPane.scss';


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
