import React, {Component} from 'react';    // exclude from merge
import './TabPane.scss';                   // exclude from merge


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
