"use strict"

class GraphEditor {
  constructor(svg, isDirected) {
    this.r = 10;
    this.nodeLinkSep = 2;
    this.nodeMarkerSep = 5;
    this.markerWidth = 5;
    this.markerHeight = 5;
    this.chargeStrength = -1000;
    this.linkDistance = 200;

    const [svgWidth, svgHeight] = [svg.attr('width'), svg.attr('height')];
    this.svg = svg;
    this.nodes = {};
    this.links = {};
    this.nodeIdHead = 0;
    this.linkIdHead = 0;
    this.g = svg.append('g')
      .attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    this.node = this.g.append('g')
      .selectAll('.node')
      .data(this.nodes);
    this.link = this.g.append('g')
      .selectAll('.link')
      .data(this.links);

    this.simulation = d3.forceSimulation();
    this.initSimulation();
    if (isDirected) {
      this.makeArrow();
      this.simulation.on('tick', this.tickedDirected.bind(this));
    }
  }

  get nodesArr() {
    return d3.values(this.nodes);
  }
  get linksArr() {
    return d3.values(this.links);
 }
  
  initSimulation() {
    this.simulation = this.simulation.nodes(this.nodesArr)
      .force('charge', d3.forceManyBody().strength(this.chargeStrength))
      .force('link', d3.forceLink(this.linksArr).distance(this.linkDistance))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .alphaTarget(1)
      .on('tick', this.ticked.bind(this)); // NOT this.ticked (pay attention to the action of 'this'.)
  }
  makeArrow() {
    const marker = svg.append('defs')
      .append('marker')
      .attr('id', 'gedit_arr')
      .attr('markerUnits', 'strokeWidth')
      .attr('markerWidth', this.markerWidth)
      .attr('markerHeight', this.markerHeight)
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('orient', 'auto');
    const path = marker.append('path')
      .attr('d', `M0,0 L5,5 0,10 10,5`);
  }
  addNode(obj) {
    this.nodes[this.nodeIdHead] = obj;
    return this.nodeIdHead++;
  }
  addLink(obj) {
    this.links[this.linkIdHead] = obj;
    return this.linkIdHead++;
  }
  removeNode(id) {
    return delete this.nodes[id];
  }
  removeLink(id) {
    return delete this.links[id]
  }

  restart() {
    this.node = this.node.data(this.nodesArr, d => d.id);
    this.node.exit().remove();
    const nodeEnter = this.node.enter()
      .append('g')
      .attr('class', 'node');
    nodeEnter.append('circle')
      .attr('r', this.r);
    nodeEnter.append('text')
      .text(d => d.name);
    this.node = nodeEnter.merge(this.node);

    this.link = this.link.data(this.linksArr, d => d.id);
    this.link.exit().remove;
    const linkEnter = this.link.enter()
      .append('path')
      .attr('class', 'link')
      .attr('marker-end', 'url(#gedit_arr)');
    this.link = linkEnter.merge(this.link);

    this.simulation.nodes(this.nodesArr);
    this.simulation.force('link').links(this.linksArr);
    this.simulation.alpha(1).restart();
  }

  ticked() {
    this.node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    this.link.attr('d', d => { 
      const r = this.r + this.nodeLinkSep;
      const [sx, sy] = [d.source.x, d.source.y];
      const [tx, ty] = [d.target.x, d.target.y];
      const [dx, dy] = [tx - sx, ty - sy];
      const dist = Math.sqrt(dx*dx + dy*dy);
      const [ex, ey] = [dx / dist, dy / dist];
      return `M${sx + r*ex},${sy + r*ey} L${tx - r*ex},${ty - r*ey}`
    });
  }
  tickedDirected() {
    this.node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    this.link.attr('d', d => { 
      const rstart = this.r + this.nodeLinkSep;
      const rend = this.r + this.nodeMarkerSep;
      const [sx, sy] = [d.source.x, d.source.y];
      const [tx, ty] = [d.target.x, d.target.y];
      const [dx, dy] = [tx - sx, ty - sy];
      const dist = Math.sqrt(dx*dx + dy*dy);
      const [ex, ey] = [dx / dist, dy / dist];
      return `M${sx + rstart*ex},${sy + rend*ey} L${tx - rend*ex},${ty - rend*ey}`
    });
  }
}
