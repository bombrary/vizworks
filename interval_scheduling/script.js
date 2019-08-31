const rand10 =  () => Math.floor(d3.randomUniform(0, 30)());
const [width, height] = [800, 400];

const div = d3.select('body')
  .append('div')
  .attr('class', 'flex-container');

const inputarea = div.append('div')
  .attr('class', 'input-container')
const textarea = inputarea.append('textarea')
  .style('width', '200px')
  .style('height', `${height}px`);
const button = inputarea.append('input')
  .attr('type', 'button')
  .attr('value', 'click')
  .on('click', () => {
    let input = textarea.property('value')
      .split('\n')
      .map(d => d.split(' '))
      .map(d0 => d0.map(d1 => Number(d1)));
    input = input.slice(1, input.length)
      .map(d => Object({"color": 'green', "pos": d}));
    update(input);
  });
let data;
let last_finished_time, idx;
const randButton = inputarea.append('input')
  .attr('type', 'button')
  .attr('value', 'random')
  .on('click', () => {
    data = [];
    last_finished_time = 0, idx = 0;
    for (let i = 0; i < 20; i++) {
      let [s, t] = [rand10(), rand10()];
      if (s > t) [s, t] = [t, s];
      data.push({color: 'green', pos: [s, t + 1]}); 
    }
    update(data, 0);
  });
const sortButton = inputarea.append('input')
  .attr('type', 'button')
  .attr('value', 'sort')
  .on('click', () => {
    data.forEach((d, i) => data[i].color = 'green');
    last_finished_time = 0, idx = 0;
    data.sort((a, b) => a.pos[1] - b.pos[1]);
    update(data, 0);
  });

const nextButton = inputarea.append('input')
  .attr('type', 'button')
  .attr('value', 'next')
  .on('click', () => {
    if (idx >= data.length) return;
    if (last_finished_time <= data[idx].pos[0]) {
      data[idx].color = 'red';
      last_finished_time = data[idx].pos[1];
    } else {
      data[idx].color = 'gray';
    }
    idx++;
    update(data, last_finished_time);
  });

const svg = div.append('svg')
  .attr("xmlns",'http://www.w3.org/2000/svg')
  .attr('width', width)
  .attr('height', height);
let g_axis = svg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(${0}, ${50})`)
let itv = svg.append('g')
  .attr('class', 'intervals');
let last_finished_divition = svg.append('g')
  .attr('class', 'last-finished-division')
  .attr('transform', `translate(${0}, ${50})`)
  .append('path');

function update(data, divpos) {
  let xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d3.max(d.pos)) + 1])
    .range([50, width - 50]);

  let axisx = d3.axisBottom(xScale)
    .ticks(d3.max(data, d => d3.max(d.pos)) + 1);

  g_axis.call(axisx);

  itv = svg.select('g.intervals')
    .selectAll('g')
    .data(data);
  let itv_enter = itv.enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0, ${15*i + 80})`);
  itv_enter.append('path')
    .attr("stroke-width", 1.5);
  itv_enter.merge(itv)
    .selectAll('circle')
    .data(d => d.pos)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('stroke', 'black')
    .attr('fill', (d, i) => i == 0 ? 'black':'white');

  itv_enter.merge(itv)
    .select('path')
    .attr('d', d => {
      let x0 = xScale(d.pos[0]);
      let x1 = xScale(d.pos[1]);
      return `M${x0},${0} L${x1},${0}`;
    })
    .attr("stroke", d => d.color)
    .attr('stroke-width', 3)
    .on('click', function(d) {
      d3.select(this)
        .attr('stroke', 'red');
    });
  itv_enter.merge(itv)
    .selectAll('circle')
    .attr('cx', d => xScale(d));
  
  itv.exit().remove()

  last_finished_divition.datum(last_finished_time)
    .attr("stroke", 'black')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5')
    .attr('d', d => `M${xScale(d)},0 L${xScale(d)},${15*(data.length + 2)}`);
}
