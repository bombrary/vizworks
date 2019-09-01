const [svgWidth, svgHeight] = [800, 800];
const svg = d3.select('.content')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const pad = 15;
const update = (data) => {
  const {extent, histories} = data;
  const scale = d3.scaleLinear()
    .domain(extent)
    .range([pad, svgWidth - pad]);
  const unit = svg.selectAll('.unit')
    .data(histories);
  unit.exit().remove();
  const unitEnter = unit.enter()
    .append('g')
    .classed('unit', true)
    .attr('transform', (d, i) => `translate(0, ${50*i + pad})`);
  unitEnter.append('g')
    .classed('axis', true)
    .each((d, i, node) => {
      const ticks = [d.l, d.mid, d.r];
      const axis = d3.axisBottom(scale)
        .tickValues(ticks);
      d3.select(node[i])
        .call(axis)
        .selectAll('text')
        .attr('y', (d, j, node) => {
          const bbox = node[j].getBBox();
          if (j % 2 === 1) {
            return -bbox.y - 15*(j - 1)/2 - 5;
          } else {
            return bbox.y + 15*j/2;
          }
        });
    })
  unitEnter.append('path')
    .datum(d => [d.l, d.r])
    .classed('edge', true)
    .attr('stroke-width', 5)
    .attr('stroke', 'green')
    .attr('fill', 'none')
    .attr('d', d => `M${scale(d[0])},${2.5} L${scale(d[1])},${2.5}`)
  unitEnter.append('circle')
    .datum(d => d.mid)
    .attr('r', 3)
    .attr('cx', d => scale(d))
    .attr('cy', 1.5)
    .attr('fill', 'yellow')
    .attr('stroke', 'black');

}

const putButton = (name) => d3.select('.menu-left')
    .append('input')
    .attr('type', 'button')
    .attr('value', name);

let histories = [];
let extent = [0, 990];
let l = 0, r = 990, mid = Math.floor((l + r)/2);
histories.push({l, r, mid});
update({extent, histories});
d3.selectAll('.mid-val')
  .text(mid);
d3.select('#le_btn')
  .on('click', () => {
    l = mid;
    mid = Math.floor((l + r)/2);
    histories.push({l, r, mid});
    update({extent, histories});
    d3.selectAll('.mid-val')
      .text(mid);
  });
d3.select('#gt_btn')
  .on('click', () => {
    r = mid;
    mid = Math.floor((l + r)/2);
    histories.push({l, r, mid});
    update({extent, histories});
    d3.selectAll('.mid-val')
      .text(mid);
  });
putButton('Clear')
  .on('click', () => {
    histories = [];
    histories.push({l, r, mid});
    l = 0;
    r = 990;
    mid = Math.floor((l + r)/2);
    update({extent, histories});
    d3.selectAll('.mid-val')
      .text(mid);
  });
