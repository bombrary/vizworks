"use strict"

class GraphEditor {
  constructor(svg, isDirected) {
    this.r = 10;
    this.nodeLinkSep = 2;
    this.nodeMarkerSep = 5;
    this.markerWidth = 10;
    this.markerHeight = 10;
    this.chargeStrength = -1000;
    this.linkDistance = 200;

    this.nodes = {};
    this.links = {};
    this.nodeIdHead = 0;
    this.linkIdHead = 0;

    this.svg = svg;
    const [svgWidth, svgHeight] = [svg.attr('width'), svg.attr('height')];
    this.g = svg.append('g')
      .attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    this.node = this.g.append('g')
      .selectAll('.node')
    this.link = this.g.append('g')
      .selectAll('.link')

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
      .attr('viewBox', '0 0 2 2')
      .attr('refX', 1)
      .attr('refY', 1)
      .attr('orient', 'auto');
    const path = marker.append('path')
      .attr('d', `M0,0 L1,1 0,2 2,1`);
  }
  addNode(obj) {
    this.nodes[this.nodeIdHead] = Object.assign({id: this.nodeIdHead}, obj);
    return this.nodeIdHead++;
  }
  addLink(obj) {
    this.links[this.linkIdHead] = Object.assign({id: this.linkIdHead}, obj);
    return this.linkIdHead++;
  }
  removeNode(id) {
    this.getLinksAdjacent(id).forEach((d) => {
      delete this.links[d.id];
    });
    delete this.nodes[id];
  }
  removeLink(id) {
    delete this.links[id]
  }

  getLinksAdjacent(id) {
    return this.linksArr.filter((d) => 
      d.source.id === id || d.target.id === id);
  }
  getLinksIncoming(id) {
    return this.linksArr.filter((d) => d.target.id === id);
  }
  getLinksOutcoming(id) {
    return this.linksArr.filter((d) => d.source.id === id);
  }

  restart() {
    this.node = this.node.data(this.nodesArr, d => d.id);
    this.node.exit().remove();
    const nodeEnter = this.node.enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag()
          .on('start', this.dragstarted.bind(this))
          .on('drag', this.dragged.bind(this))
          .on('end', this.dragended.bind(this)));
    nodeEnter.append('circle')
      .attr('r', this.r)
    nodeEnter.append('text')
      .text(d => d.name);
    this.node = nodeEnter.merge(this.node);

    this.link = this.link.data(this.linksArr, d => d.id);
    this.link.exit().remove();
    const linkEnter = this.link.enter()
      .append('g')
      .attr('class', 'link');
    linkEnter.append('path')
      .attr('marker-end', 'url(#gedit_arr)');
    this.link = linkEnter.merge(this.link);

    this.simulation.nodes(this.nodesArr);
    this.simulation.force('link').links(this.linksArr);
    this.simulation.alpha(1).restart();
  }

  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  ticked() {
    this.node.attr('transform', d => `translate(${d.x}, ${d.y})`);
    this.link.selet('path')
      .attr('d', d => { 
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
    this.link.select('path')
      .attr('d', d => { 
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
