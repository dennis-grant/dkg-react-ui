import React, {Component} from 'react';
import './App.scss';
import {Tree, expandTreeBranch, collapseTreeBranch, TabPane, createTabPaneData, selectTab, SplitPane, Grid, createGridData} from './dkg-react-ui';


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
      gridInfo: createGridData(
        [1, 3, 1],
        [
          ["Last Name", "First Name", "Hobby"],
          ["a", "c", "b"],
          ["Grant", "Dennis", "Soccer"],
          ["Brown", "Carla", "Sing"],
          ["Shuster", "Wayne", "Acting"]
        ]
      )
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
          <Grid gridData={this.state.gridInfo} />
          <div>app right sided!!</div>
        </SplitPane>
      </TabPane>
    );
  }
}

export default App;
