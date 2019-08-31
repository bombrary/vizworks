const svg = d3.select('body')
  .select('article')
  .select('section.content')
  .append('svg');
const [svgWidth, svgHeight] = [640, 480];
svg.attr('width', svgWidth)
  .attr('height', svgHeight);

const triLen = 50;
const nodes = svg.append('g')
  .attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);

function update(data) {
  const node = nodes.selectAll('g.node')
    .data(data);
  const nodeEnter = node.enter()
    .append('g')
    .attr('class', 'node');

  const t = d3.transition()
    .duration(1000);

  const startX = triLen * data.length / 2 - triLen/2;
  nodes.transition(t)
    .attr('transform', `translate(${svgWidth/2 -startX}, ${svgHeight/2})`);

  nodeEnter.style('opacity', 0);
  nodeEnter.append('path')
  nodeEnter.append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')

  node.exit()
    .transition(t)
    .style('opacity', 0)
    .remove();

  const nodeMerge = nodeEnter.merge(node)
    .transition(t)
    .style('opacity', 1);
  nodeMerge.attr('transform', (d, i) => `translate(${i*triLen}, 0)`);
  nodeMerge.select('path')
    .attr('stroke', 'black')
    .attr('fill', 'white')

  nodeMerge.select('path')
    .attr('d', (d, i) => {
      const sign = d ? 1 : -1;
      return `M${-triLen/2},0 L${triLen/2},0 0,${sign * triLen*0.866} ${-triLen/2},0`;
    });
  nodeMerge.select('text')
    .attr('font-size', 28)
    .text(d => d ? '🤔 ': '😀')
    .attr('dy', (d, i) => {
      const sign = d ? 1 : -1;
      return sign * triLen * 0.289;
    });
}

const randBinaryN = (() => {
  const rand = d3.randomUniform(0, 2);
  return (n) => [...Array(n)].map(d => Math.floor(rand()));
})();
const randBinary = (() => {
  const rand10 = d3.randomUniform(1, 11);
  return () => randBinaryN(Math.floor(rand10()));
})();

const interval = d3.interval(() => {
  update(randBinary());
}, 1000);
