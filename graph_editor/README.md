# GraphEditor Class

## Methods

- GraphEditor(svgSelection[, isDirected]): constructor
- GraphEditor.addNode(obj): returns id of node. Node's label is put by property 'label'.
- GraphEditor.addLink(obj): returns id of edge, should has property of source and target. Edge label is put by property 'label'.
- GraphEditor.removeNode(id): removes node whose ID is id.
- GraphEditor.removeLink(id): removes link whose ID is id.
- GraphEditor.getLinksAdjacent(id): gets IDs of links which satisfies source is id or target is id.
- GraphEditor.restart(): updates graph data to view.
- GraphEditor.initGraph(): makes nodes and links empty.
- GraphEditor.initSimulation(): resets charge strength and link distance.

- getter: GraphEditor.

## Properties

- GraphEditor.r = 10; : Circle radius.
- this.nodeLinkSep = 2; : Separation between node and link.
- GraphEditor.nodeMarkerSep = 5; : Separation between node and arrow.
- GraphEditor.markerWidth = 10; : Arrow width.
- GraphEditor.markerHeight = 10; : Arrow height.
- GraphEditor.chargeStrength = -1000; : The value for force simulation.
- GraphEditor.linkDistance = 150; : The value for force simulation.
- GraphEditor.adjacentLinkSep = 3; : Link separation between bilateral links.
- GraphEditor.hasSelfLoop = true; : If it is true, self loop is drawn.
- GraphEditor.isDirected = true; : If it is true, directed graph is drawn.

## Data Structure

Node and link is structured by JavaScript Object.
Both is consited in the elements {id: obj}.
Example:
```js
// Assume svg element has already exist.
const gedit = new GraphEditor(d3.select('svg'));
gedit.addNode({id: 0, label: '0'});
gedit.addNode({id: 1, label: '1'});
gedit.addNode({id: 2, label: '2'});
gedit.addNode({id: 3, label: '3'});
console.log(this.nodes).
/*
{
  0: {label: '0'},
  1: {label: '1'},
  2: {label: '2'},
  3: {label: 'Hello'},
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
