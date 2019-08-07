const body = d3.select('body');
const flexContainer = body.select('div.flex-container');
const menuContainer = flexContainer.select('div.menu-container');
const mainContainer = flexContainer.select('div.main-container');
const svg = mainContainer.select('svg');
const [svgWidth, svgHeight] = [800, 500];
svg.attr('width', svgWidth)
  .attr('height', svgHeight);

(() => {
  const marker = svg.append('defs')
    .append('marker')
    .attr('id', 'm_arr')
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 5)
    .attr('refY', 5)
    .attr('orient', 'auto');
  const path = marker.append('path')
    .attr('fill', '#000')
    .attr('d', `M0,0 L5,5 0,10 10,5`);
  svg.append('g')
    .attr('class', 'data-elem');
  svg.append('g')
    .attr('class', 'data-image');
})();

const [rectWidth, rectHeight] = [40, 40];
function update(data, dataIm) {
  const startX = (svgWidth - rectWidth*data.length)/2;
  const g = svg.select('g.data-elem')
    .attr('transform', `translate(${startX}, ${svgHeight/4})`);
  const elem = g.selectAll('g')
    .data(data);
  console.log(elem.exit());
  elem.exit().remove();
  const elemEnter = elem.enter()
    .append('g');
  elemEnter.append('rect');
  elemEnter.append('text');
  elemEnter.append('path');

  const elemMerge = elemEnter.merge(elem);
  elemMerge.attr('transform', (d, i) => `translate(${rectWidth*i}, 0)`);
  elemMerge.select('rect')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('fill', '#fff')
    .attr('stroke', '#000');
  elemMerge.select('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('dx', rectWidth/2)
    .attr('dy', rectHeight/2)
    .text(d => d);

  const [transStartY, transEndY] = [rectHeight + 10, svgHeight/2 - 10];
  elemMerge.select('path')
    .attr('stroke-width', 1.5)
    .attr('marker-end', 'url(#m_arr)')
    .attr('stroke', '#000')
    .attr('d', `M${rectWidth/2} ${transStartY} L${rectWidth/2} ${transStartY+10}`);
  const elemTransition = elemMerge.transition()
    .delay((d, i) => i*500)
    .duration(1000)
  elemTransition.select('path')
    .attr('d', `M${rectWidth/2} ${transStartY}, L${rectWidth/2} ${transEndY}`);

  const gIm = svg.select('g.data-image')
    .attr('transform', `translate(${startX}, ${3*svgHeight/4})`);
  const elemIm = gIm.selectAll('g')
    .data(dataIm);
  elemIm.exit().remove();
  const elemImEnter = elemIm.enter()
    .append('g');
  elemImEnter.append('rect');
  elemImEnter.append('text');

  const elemImMerge = elemImEnter.merge(elemIm);
  elemImMerge.attr('transform', (d, i) => `translate(${rectWidth*i}, 0)`);
  elemImMerge.select('rect')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('fill', '#fff')
    .attr('stroke', '#000');
  elemImMerge.select('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .attr('dx', rectWidth/2)
    .attr('dy', rectHeight/2)
    .attr('fill', '#fff')
    .text(d => d);

  const elemImTransition = elemImMerge.transition()
    .delay((d, i) => i*500)
    .duration(1000)
  elemImTransition.select('text')
    .attr('fill', '#000');
}

const testcase01 = [1, 2, 10, 6 ,2];
update(testcase01, testcase01.map(x => x*x));
