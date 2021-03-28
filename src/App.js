import React, {Component} from 'react';
import {Tree, expandTreeBranch, collapseTreeBranch} from './Tree';
import {TabPane, createTabPaneData, selectTab} from './TabPane';
import {SplitPane} from './SplitPane';
import {DemoGrid} from './DemoGrid';
import './App.scss';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeInfo: {
        title: "root",
        items: [
          {
            title: "first child",
            items: [
              {title: "level 3 -- 1"},
              {title: "level 3 -- 2",
               items: [
                 {title: "lev4 ->22"},
                 {title: "lev4 ->24"}
               ]},
              {title: "level 3 -- 2"}
            ]
          },
          {
            title: "second child",
            items: [
              { title: "petit enfant one" },
              { title: "petit enfant deux" }
            ]
          }
        ]
      },
      tabPaneInfo: createTabPaneData(["Description", "Features", "Screen shots"]),
    };
    this.expandTree = this.expandTree.bind(this);
    this.collapseTree = this.collapseTree.bind(this);
    this.updateSelectedTab = this.updateSelectedTab.bind(this);
  }

  expandTree(path) {
    this.setState({
      treeInfo: expandTreeBranch(this.state.treeInfo, path)
    });
  }

  collapseTree(path) {
    this.setState({
      treeInfo: collapseTreeBranch(this.state.treeInfo, path)
    });
  }

  updateSelectedTab(tabIndex) {
    this.setState({
      tabPaneInfo: selectTab(this.state.tabPaneInfo, tabIndex)
    });
  }

  render() {
    return (
      <TabPane tabPaneData={this.state.tabPaneInfo} onTabSelected={this.updateSelectedTab}>
        <div>first tab panel</div>
        <Tree treeData={this.state.treeInfo} onExpand={this.expandTree} onCollapse={this.collapseTree} />
        <SplitPane>
          <DemoGrid/>
          <div style={{padding: "6px"}}>app right sided!!</div>
        </SplitPane>
      </TabPane>
    );
  }
}

export default App;
