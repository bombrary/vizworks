const [svgWidth, svgHeight] = [800, 500];
const svg = d3.select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const arrPad = 50;
const g = svg.append('g') 
  .attr('transform', `translate(${svgWidth/2}, ${svgHeight/2 - arrPad})`);
g.append('g') 
  .classed('pies', true);
g.append('g')
  .classed('ticks', true);
g.append('g')
  .classed('array', true);

let innerRadius = 70, outerRadius = 150;
const update = (queue) => {
  updateRingBuffer(queue);
  updateArray(queue);
};

const q = new Queue(20);

const menu = d3.select('.menu-left');
const textarea = menu.append('textarea');


class Iterator {
  constructor(data) {
    this.data = data;
    this.cnt = 0;
  }
  hasNext() {
    return this.cnt < this.data.length;
  }
  next() {
    this.cnt++;
  }
  get now() {
    return this.data[this.cnt];
  }
}
let itr;
const queryButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'generate')
  .on('click', () => {
    const input = d3.merge(textarea.property('value')
        .split('\n')
        .map(d => d.split(' '))
    ).map(d => Number(d));
    console.log(input);
    itr = new Iterator(input);
    updateQueryInfo();
  });
const randomButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'random')
  .on('click', () => {
    const rand = d3.randomUniform(-99, 100);
    const input = [...Array(20)].map(() => Math.floor(rand()));
    itr = new Iterator(input)
    updateQueryInfo();
  });
const pushButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'push')
  .on('click', () => {
    if (itr.hasNext()) {
      q.push(itr.now);
      itr.next();
      update(q);
      updateQueryInfo();
    }
  });
const popButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'pop')
  .on('click', () => {
    q.pop();
    update(q);
  });
const queryInfoArea = menu.append('ul')
  .classed('query-info', true);
const updateQueryInfo = () => {
  const li = queryInfoArea.selectAll('li')
    .data(itr.data.slice(itr.cnt));
  li.exit().remove();
  li.enter().append('li')
    .merge(li)
    .text(d => d);
};

const updateRingBuffer = (queue) =>  {
  const { data, head, tail, size, capacity } = queue.queueInfo;
  const pie = d3.pie()
    .value(1)
    .sort(null);
  const arc = d3.arc()
    .outerRadius(innerRadius)
    .innerRadius(outerRadius);
  const pieGroup = g.select('g.pies')
    .selectAll('.pie')
    .data(pie(data));
  pieGroup.exit().remove();
  const pieGroupEnter = pieGroup.enter()
    .append('g')
    .classed('pie', true);
  pieGroupEnter.append('path');
  pieGroupEnter.append('g')
    .append('text');
  pieGroupEnter.merge(pieGroup)
    .select('path')
    .transition()
    .duration(1000)
    .attr('fill', (d) => {
      if (d.data === undefined) return '#aaa';
      else return '#fff';
    })
    .attr('stroke', 'black')
    .attr('d', arc);
  pieGroupEnter.merge(pieGroup)
    .select('g')
    .attr('transform', d => `translate(${arc.centroid(d)})`)
    .select('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text(d => d.data === undefined ? '?' : d.data);

  const tickArc = d3.arc()
    .outerRadius(1.5*outerRadius + 50)
    .innerRadius(innerRadius);
  const tick = g.select('g.ticks')
    .selectAll('.tick')
    .data(pie(d3.range(0, capacity)));
  tick.exit().remove();
  const tickEnter = tick.enter()
    .append('g')
    .classed('tick', true);
  tickEnter.append('text');
  tickEnter.merge(tick)
    .attr('transform', d => `translate(${tickArc.centroid(d)})`)
    .select('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text(d => d.data);
};

const [rectWidth, rectHeight] = [30, 30];
const updateArray = (queue) => {
  const data = queue.toArray();

  const arrGroup = svg.select('.array')
    .attr('transform', `translate(${-rectWidth*data.length/2}, ${outerRadius + arrPad})`);
  const elem = arrGroup.selectAll('.elem')
    .data(data, d => d.id);
  elem.exit().remove();
  const elemEnter = elem.enter().append('g')
    .classed('elem', true);
  elemEnter.append('rect');
  elemEnter.append('text');

  const elemMerge = elemEnter
    .merge(elem)
    .transition()
    .duration(1000);
  elemMerge.attr('transform', (d, i) => `translate(${i*rectWidth}, ${0})`);
  elemMerge.select('rect')
    .attr('fill', (d) => {
      if (d.val === undefined) return '#aaa';
      else return '#fff';
    })
    .attr('stroke', '#000')
    .attr('width', rectWidth)
    .attr('height', rectHeight);
  elemMerge.select('text')
    .attr('dx', rectWidth/2)
    .attr('dy', rectHeight/2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text(d => d.val);
};
