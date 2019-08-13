# GraphEditor Class

## Methods

- GraphEditor(svgSelection[, isDirected])  
  constructor
- GraphEditor.addNode(obj):  
  returns id of node. Node's label is put by property 'label'.
- GraphEditor.addLink(obj):  
  returns id of edge, should has property of source and target. Edge label is put by property 'label'.
- GraphEditor.removeNode(id):  
  removes node whose ID is id.
- GraphEditor.removeLink(id):  
  removes link whose ID is id.
- GraphEditor.getLinksAdjacent(id):  
  gets IDs of links which satisfies source is id or target is id.
- GraphEditor.restart():  
  updates graph data to view.
- GraphEditor.initGraph():  
  makes nodes and links empty.
- GraphEditor.initSimulation():  
  resets charge strength and link distance.

## Properties

### Settings of drawing graph

- GraphEditor.r = 10; : circle radius.
- this.nodeLinkSep = 2; : separation between node and link.
- GraphEditor.nodeMarkerSep = 5; : separation between node and arrow.
- GraphEditor.markerWidth = 10; : arrow width.
- GraphEditor.markerHeight = 10; : arrow height.
- GraphEditor.chargeStrength = -1000; : the value for force simulation.
- GraphEditor.linkDistance = 150; : the value for force simulation.
- GraphEditor.adjacentLinkSep = 3; : link separation between bilateral links.
- GraphEditor.hasSelfLoop = true; : If it is true, self loop is drawn.
- GraphEditor.isDirected = true; : If it is true, directed graph is drawn.

### Data
- GraphEditor.nodes: node data.
- GraphEditor.links: link data.
- GraphEditor.nodesArr: (getter) node data as an array for binding data.
- GraphEditor.linksArr: (getter) link data as an array for binding data.

### Selection
- GraphEditor.svg: svg selection
- GraphEditor.node: node selection, which consist of circle and text.
- GraphEditor.link: link selection, which consist of path and text (textPath)
- GraphEditor.defs: defs selection for making arrow.

If you want to change styles of nodes and links, you may use GraphEditor.node and GraphEditor.link.
Example: Change fill of nodes red whose ID is odd.
```js
const gedit = new GraphEditor(d3.select('svg'));

/* Add some nodes ... */

gedit.node.select('circle')
  .style('fill', (d, i) => d.id % 2 ? 'red' : 'white');
```

## Data Structure

Node and link is structured by JavaScript Object.
Both is consited in the elements {id: obj}.
Example:
```js
// Assume svg element has already exist.
const gedit = new GraphEditor(d3.select('svg'));
gedit.addNode({label: '0'});
gedit.addNode({label: '1'});
gedit.addNode({label: '2'});
gedit.addNode({label: '3'});
console.log(this.nodes).
/*
{
  0: {id: 0, label: '0'},
  1: {id: 1, label: '1'},
  2: {id: 2, label: '2'},
  3: {id: 3, label: 'Hello'},
};
*/

gedit.addLink({source: 0, target: 1});
gedit.addLink({source: 1, target: 1});
gedit.addLink({source: 2, target: 1});
console.log(this.nodes).
/*
{
  0: {id: 0, source: 0, target: 1},
  1: {id: 1, source: 1, target: 1},
  2: {id: 2, source: 2, target: 1},
};
*/
```

So the time complexity is bellow:

- addNode(obj): O(1).
- addLink(obj): O(1).
- removeNode(id): O([number of links]) because of using getLinksAdjacent(id).
- removeLink(id): O(1).

If you use it more conveniently (e.g: making addLink and removeLink take arguments (from, to)), you may wrap GraphEditor.
