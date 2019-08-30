const [svgWidth, svgHeight] = [600, 800];
const menu = d3.select('.menu-left');
const svg = d3.select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const stackGroup = svg.append('g')
  .classed('stackarea', true);

const [rectWidth, rectHeight] = [30, 30];
const update = (stack) => {
  stackGroup.attr('transform', `translate(${svgWidth/2}, ${svgHeight/2})`);
  const {data, capacity, head, log} = stack;
  const wholeLength = rectHeight * capacity;
  const scale = d3.scaleLinear()
    .domain([0, capacity])
    .range([0, -wholeLength]);
  const elem = stackGroup.selectAll('g')
    .data(data);
  elem.exit().remove();
  const elemEnter = elem.enter()
    .append('g')
    .attr('transform', `translate(0, ${scale(capacity + 1)})`)
    .style('opacity', 0);
  elemEnter.append('rect');
  elemEnter.append('text');

  const t = d3.transition()
    .duration(1000);

  if (log === 'poped') {
    elem.each((d, i, node) => {
      if (i === head) {
        const target = d3.select(node[i]);
        const text = target.select('text').text();
        target.select('text')
          .text('');
        target.select('rect')
          .attr('fill', '#aaa');
        const tmp = stackGroup.append('g')
          .attr('transform', `translate(0, ${scale(i)})`);
        tmp.append('rect')
          .attr('fill', '#fff')
          .attr('stroke', '#000')
          .attr('width', rectWidth)
          .attr('height', rectHeight);
        tmp.append('text')
          .attr('dx', rectWidth/2)
          .attr('dy', rectHeight/2)
          .text(text);
        tmp.transition(t)
          .attr('transform', `translate(0, ${scale(capacity + 1)})`)
          .style('opacity', 0)
          .remove();
      }
    });
  }

  if (log === 'pushed') {
    elem.each((d, i, node) => {
      if (i === head - 1) {
        const tmp = stackGroup.append('g')
          .attr('transform', `translate(0, ${scale(capacity + 1)})`)
          .style('opacity', 0);
        tmp.append('rect')
          .attr('fill', '#fff')
          .attr('stroke', '#000')
          .attr('width', rectWidth)
          .attr('height', rectHeight);
        tmp.append('text')
          .attr('dx', rectWidth/2)
          .attr('dy', rectHeight/2)
          .text(d);
        tmp.transition(t)
          .attr('transform', `translate(0, ${scale(i)})`)
          .style('opacity', 1)
          .remove();
      }
    });
  }

  const elemMerge = elemEnter.merge(elem)
    .transition(t)
  elemMerge.attr('transform', (d, i) => `translate(0, ${scale(i)})`)
    .style('opacity', 1);
  elemMerge.select('rect')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('fill', d => {
      if (d === undefined) return '#aaa';
      else return '#fff';
    })
    .attr('stroke', '#000');
  elemMerge.select('text')
    .attr('dx', rectWidth/2)
    .attr('dy', rectHeight/2)
    .text(d => d);
};

const s = new Stack(10);
update(s);

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
      s.push(itr.now);
      itr.next();
      update(s);
      updateQueryInfo();
    }
  });
const popButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'pop')
  .on('click', () => {
    s.pop();
    update(s);
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
