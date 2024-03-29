"use strict"

class GraphEditor {
  constructor(svg, isDirected) {
    this.r = 10;
    this.nodeLinkSep = 2;
    this.nodeMarkerSep = 5;
    this.markerSize = 10;
    this.adjacentLinkSep = 3;
    this.chargeStrength = -1000;
    this.linkDistance = 150;
    this.hasSelfLoop = true;
    this.isDirected = true;
    this.selfLoopCloseHeight = 16;
    this.selfLoopCloseBottom = 4;
    this.selfLoopFarHeight = 80;
    this.selfLoopFarBottom = 40;

    if (isDirected !== undefined) {
      this.isDirected = isDirected;
    }

    this.initGraph();

    this.svg = svg;
    const [svgWidth, svgHeight] = [svg.attr('width'), svg.attr('height')];
    this.g = svg.append('g')
      .attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
    this.node = this.g.append('g')
      .selectAll('.node')
    this.link = this.g.append('g')
      .selectAll('.link')
    this.defs = svg.append('defs');

    this.simulation = d3.forceSimulation();
    if (isDirected) {
      this.makeArrow();
    }
    this.initSimulation();
  }

  get nodesArr() {
    return d3.values(this.nodes);
  }
  get linksArr() {
    return d3.values(this.links);
  }

  initGraph() {
    this.nodes = {};
    this.links = {};
    this.nodeNum = 0;
    this.linkNum = 0;
  }
  initSimulation() {
    this.simulation = this.simulation.nodes(this.nodesArr)
      .force('charge', d3.forceManyBody().strength(this.chargeStrength))
      .force('link', d3.forceLink(this.linksArr).distance(this.linkDistance))
      .force('x', d3.forceX())
      .force('y', d3.forceY())
      .alphaTarget(1)
      .on('tick', this.ticked.bind(this)); // NOT this.ticked (pay attention to the action of 'this'.)
    if (this.isDirected) {
      this.simulation.on('tick', this.tickedDirected.bind(this));
      this.setMarkerSize();
    } else {
      this.simulation.on('tick', this.ticked.bind(this));
    }
    this.simulation.alpha(1).restart();
  }
  makeArrow() {
    const marker = this.defs
      .append('marker')
      .attr('id', 'gedit_arr')
      .attr('markerUnits', 'strokeWidth')
      .attr('viewBox', '0 0 2 2')
      .attr('refX', 1)
      .attr('refY', 1)
      .attr('orient', 'auto');
    const path = marker.append('path')
      .attr('d', `M0,0 L1,1 0,2 2,1`);
  }
  setMarkerSize() {
    this.defs.select('marker')
      .attr('markerWidth', this.markerSize)
      .attr('markerHeight', this.markerSize)
  }
  addNode(obj) {
    this.nodes[this.nodeNum] = Object.assign({id: this.nodeNum}, obj);
    return this.nodeNum++;
  }
  addLink(obj) {
    this.links[this.linkNum] = Object.assign({id: this.linkNum}, obj);
    return this.linkNum++;
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

  setNodeProperty(id, key, val) {
    this.nodes[id][key] = val;
  }
  setLinkProperty(id, key, val) {
    this.links[id][key] = val;
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
    nodeEnter.append('text')
    this.node = nodeEnter.merge(this.node)
    this.node.select('circle')
      .attr('r', this.r)
    this.node.select('text')
      .text(d => d.label !== undefined ? d.label : '');

    this.link = this.link.data(this.linksArr, d => d.id);
    this.link.exit().remove();
    const linkEnter = this.link.enter()
      .append('g')
      .attr('class', 'link');
    linkEnter.append('path')
      .attr('marker-end', 'url(#gedit_arr)')
      .attr('id', d => `path-${d.id}`);
    linkEnter.append('text')
      .attr('dx', this.linkDistance/4)
      .attr('dy', -2)
      .append('textPath')
      .attr('xlink:href', d => `#path-${d.id}`);
    this.link = linkEnter.merge(this.link);
    this.link.select('text')
      .select('textPath')
      .text(d => d.label !== undefined ? d.label : '');

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
    this.link.select('path')
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
        if (d.source.id === d.target.id) return this.drawSelfLoop(d);
        else return this.drawUsualPath(d);
      });
  }

  drawUsualPath(d) {
    const rstart = this.r + this.nodeLinkSep;
    const rend = this.r + this.nodeMarkerSep;
    const [sx, sy] = [d.source.x, d.source.y];
    const [tx, ty] = [d.target.x, d.target.y];
    const [dx, dy] = [tx - sx, ty - sy];
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 1e-9) {
      // for fear 0 division
      return `M${sx},${sy} L${tx},${ty}`;
    }
    const [ex, ey] = [dx / dist, dy / dist];
    const [iex, iey] = [ey, -ex];
    const alsep = this.adjacentLinkSep;
    return `M${sx + rstart*ex + alsep*iex},${sy + rend*ey + alsep*iey}` +
      `L${tx - rend*ex + alsep*iex},${ty - rend*ey + alsep*iey}`;
  }

  drawSelfLoop(d) {
    if (!this.hasSelfLoop) return '';

    const [x, y] = [d.source.x, d.source.y];
    const dist = Math.sqrt(x*x + y*y);

    let ex, ey
    if (dist < 1e-9) {
      // for fear 0 division
      [ex, ey] = [1, 0];
    } else {
      [ex, ey] = [x / dist, y / dist];
    }

    const [slch, slcb] = [this.selfLoopCloseHeight, this.selfLoopCloseBottom];
    const [xc, yc] = [x + slch*ex, y + slch*ey];
    const [xs, ys] = [xc + slcb*ey, yc - slcb*ex];
    const [xt, yt] = [xc - slcb*ey, yc + slcb*ex];

    const [slfh, slfb] = [this.selfLoopFarHeight, this.selfLoopFarBottom];
    const [xf, yf] = [x + slfh*ex, y + slfh*ey];
    const [x1, y1] = [xf + slfb*ey, yf - slfb*ex];
    const [x2, y2] = [xf - slfb*ey, yf + slfb*ex];

    return `M${xs},${ys} C${x1},${y1} ${x2},${y2} ${xt},${yt}`;
  }
}
