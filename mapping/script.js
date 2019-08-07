const body = d3.select('body');
const flexContainer = body.select('div.flex-container');
const menuContainer = flexContainer.select('div.menu-container');
const mainContainer = flexContainer.select('div.main-container');
const svg = mainContainer.select('svg');
const [svgWidth, svgHeight] = [800, 500];
svg.attr('width', svgWidth)
  .attr('height', svgHeight);

const [rectWidth, rectHeight] = [40, 40];
function update(data) {
  const startX = (svgWidth - rectWidth*data.length)/2;
  const g = svg.append('g')
    .attr('transform', `translate(${startX}, ${svgHeight/2})`);
  let elem = g.selectAll('g.elem')
    .data(data);
  elem.exit().remove();
  const elemEnter = elem.enter()
    .append('g');
  elemEnter.append('rect');
  elemEnter.append('text');
  elem = elemEnter.merge(elem);

  elem.attr('transform', (d, i) => `translate(${rectWidth*i}, 0)`);
  elem.select('rect')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('fill', '#fff')
    .attr('stroke', '#000');
  elem.select('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'center')
    .attr('dx', rectWidth/2)
    .attr('dy', rectHeight/2+5)
    .text(d => d);
  elem.select('rect')
    .transition()
    .delay((d, i) => i*500)
    .duration(1000)
    .attr('fill', 'orangered');
}
