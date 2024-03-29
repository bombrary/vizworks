const [svgWidth, svgHeight] = [800, 800];
const svg = d3.select('.content')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const pad = 15;
const update = (data) => {
  const {extent, histories, val} = data;
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
  unitEnter.selectAll('path.edge')
    .data(d => [[d.l, val], [val, d.r]])
    .enter()
    .append('path')
    .classed('edge', true)
    .attr('stroke-width', 5)
    .attr('stroke', (d, i) => i === 0 ? 'green' : 'red')
    .attr('fill', 'none')
    .attr('d', d => `M${scale(d[0])},${2.5} L${scale(d[1])},${2.5}`)
  unitEnter.append('circle')
    .datum(d => d.mid)
    .attr('r', 2)
    .attr('cx', d => scale(d))
    .attr('fill', 'yellow')
    .attr('stroke', 'black');

}

const binarySearch = (extent, val) => {
  const ret = new BsHistory(extent, val);
  let l = extent[0], r = extent[1];
  let mid = Math.floor((r + l) / 2);
  ret.push(l, r, mid);
  while (r - l > 1) {
    mid = Math.floor((r + l) / 2);
    if (mid <= val) l = mid;
    else r = mid;
    ret.push(l, r, mid);
  }
  return ret;
};

const putButton = (name) => d3.select('.menu-left')
    .append('input')
    .attr('type', 'button')
    .attr('value', name);

let itr;
putButton('generate')
  .on('click', () => {
    const rnd = d3.randomUniform(0, 990);
    const rand = () => Math.floor(rnd());
    const x = rand();

    itr = new Iterator(binarySearch([0, 990], x));
    svg.selectAll('*').remove();
    update(itr.now);
    d3.selectAll('.value')
      .text(x);
  });
putButton('iterate')
  .on('click', () => {
    itr.next();
    update(itr.now);
  });
