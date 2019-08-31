const [svgWidth, svgHeight] = [800, 600];
const svg = d3.select('svg')  
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const g = svg.append('g');
g.append('g')
  .classed('vertex', true);
g.append('g')
  .classed('edge', true);

const applyMatrix = (shape, mat) => {
  const ret = [];
  for (const v of shape.vertex) {
    const vec = new Matrix([v]).transpose();
    ret.push(mul(mat, vec).transpose().data[0]);
  }
  return ret;
};

const getSelections = (shape, mat) => {
  const vec = applyMatrix(shape, mat);

  const vert = g.select('g.vertex')
    .selectAll('g')
    .data(vec);
  const vertEnter = vert.enter()
    .append('g')
  vertEnter.append('circle');
  vertEnter.append('text');
  vert.exit()
    .remove();

  const path = g.select('g.edge')
    .selectAll('path')
    .data(shape.edge.map(d => [vec[d[0]], vec[d[1]]]));
  const pathEnter = path.enter()
    .append('path');
  path.exit()
    .remove();

  return [vertEnter.merge(vert), pathEnter.merge(path)];
};

const putVertex = vertEdge => {
  [vert, path] = vertEdge;
  const xScale = d3.scaleLinear()
    .domain([-1.0, 1.0])
    .range([0, svgWidth]);
  const yScale = d3.scaleLinear()
    .domain([-1.0, 1.0])
    .range([svgHeight, 0]);
  vert.attr('transform', d => `translate(${xScale(d[0]/d[3])}, ${yScale(d[1]/d[3])})`);
  vert.select('circle')
    .attr('r', 2)
    .attr('fill', '#fff');
  vert.select('text')
    .attr('fill', '#fff')
    .text((d, i) => i);
    
  path.attr('d', d3.line()
    .x(d => xScale(d[0]/d[3]))
    .y(d => yScale(d[1]/d[3])))
    .attr('fill', 'none')
    .attr('stroke', '#fff');
};

const cube = new Shape(
  [
    [0, 0, 0, 1], [1, 0, 0, 1], [0, 1, 0, 1], [1, 1, 0, 1],
    [0, 0, 1, 1], [1, 0, 1, 1], [0, 1, 1, 1], [1, 1, 1, 1]
  ],
  [
    [0, 1], [1, 3], [3, 2], [2, 0],
    [4, 5], [5, 7], [7, 6], [6, 4],
    [2, 6], [3, 7], [0, 4], [1, 5]
  ]
);

const sphere = genSphere(0.5, 6, 6);
let deg = 0, phi = 0, theta = 0;
d3.interval(() => {
  const mat = identityMatrix(4, 4);
  mat.mul(projectionMatrix(2));
  mat.mul(translate(0, 0, 1.0));
  mat.mul(rotateX(theta * Math.PI/180));
  mat.mul(rotateZ(phi * Math.PI/180));
  mat.mul(rotateY(deg * Math.PI/180));
  mat.mul(scale(1.0, 2.0, 1.0));
  putVertex(getSelections(sphere, mat));
  deg++;
});


let [px, py] = [0, 0];
const dragstarted = () => {
  [px, py] = [d3.event.x, d3.event.y];
};
const dragged = () => {
  phi += d3.event.x - px;
  theta += d3.event.y - py;
  [px, py] = [d3.event.x, d3.event.y];
};

svg.call(d3.drag()
  .on('start', dragstarted)
  .on('drag', dragged));
