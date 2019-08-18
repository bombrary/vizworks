const [svgWidth, svgHeight] = [800, 600];
const pad = 100;
const menu = d3.select('section.menu-left');
const svg = d3.select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const h = new HeapTree(15, (a, b) => a > b);

svg.append('g')
  .classed('links', true);
svg.append('g')
  .classed('nodes', true);
const update = (heapData, transitionEnabled) => {
  const t = d3.transition()
    .duration(500);
  const data = heapData.data;
  const startY = -heapData.rootY;
  const links = svg.select('g.links')
    .attr('transform', `translate(${pad}, ${startY + pad/2})`)
    .selectAll('path')
    .data(data.slice(1));
  const linksExit = links.exit()
      .transition(t);
  linksExit.attr('d', d => `M${d.parent.x},${d.parent.y} L${d.parent.x},${d.parent.y}`);
  linksExit.remove();

  let linksEnter = links.enter()
    .append('path');
  linksEnter.attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('d', d => `M${d.parent.x},${d.parent.y} L${d.parent.x},${d.parent.y}`);
  if (transitionEnabled) {
    linksEnter = linksEnter.transition(t);
  }
  linksEnter.attr('d', d => `M${d.parent.x},${d.parent.y} L${d.x},${d.y}`);
  links.attr('d', d => `M${d.parent.x},${d.parent.y} L${d.x},${d.y}`);

  const nodes = svg.select('g.nodes')
    .attr('transform', `translate(${pad}, ${startY + pad/2})`)
    .selectAll('g')
    .data(data, d => d.id);

  const nodesExit = nodes.exit()
    .transition(t);
  nodesExit.attr('transform', d => `translate(${d.x}, ${d.y - 10})`);
  nodesExit.select('circle')
    .style('opacity', 0);
  nodesExit.select('text')
    .style('opacity', 0);
  nodesExit.remove();

  const nodesEnter = nodes.enter()
    .append('g');
  nodesEnter.append('circle')
    .attr('fill', '#fff')
    .attr('stroke', '#000');
  nodesEnter.append('text')
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text(d => d.val);
  let nodesMerge = nodesEnter.merge(nodes);
  if (transitionEnabled) {
      nodesMerge = nodesMerge.transition(t)
  }
  nodesMerge.attr('transform', d => `translate(${d.x},${d.y})`)
    .select('circle')
    .attr('r', heapData.radius);
}


const paddingRightContainer = menu.append('div')
  .classed('input-container', true);
const paddingRightSlider = paddingRightContainer.append('input')
  .attr('type', 'range')
  .attr('min', 0)
  .attr('max', 100)
  .attr('value', h.paddingRight)
const paddingRightSliderSpan = paddingRightContainer.append('span') 
  .text(h.paddingRight);
const changePaddingRight = () => {
  h.paddingRight = Number(paddingRightSlider.property('value'));
  update(h.toPosition(), false);
  paddingRightSliderSpan.text(h.paddingRight);
};
paddingRightSlider.on('input', changePaddingRight);
paddingRightSlider.on('change', changePaddingRight);

const paddingBottomContainer = menu.append('div')
  .classed('input-container', true);
const paddingBottomSlider = paddingBottomContainer.append('input')
  .attr('type', 'range')
  .attr('min', 0)
  .attr('max', 300)
  .attr('value', h.paddingBottom)
const paddingBottomSliderSpan = paddingBottomContainer.append('span') 
  .text(h.paddingBottom);
const changePaddingBottom = () => {
  h.paddingBottom = Number(paddingBottomSlider.property('value'));
  update(h.toPosition(), false);
  paddingBottomSliderSpan.text(h.paddingBottom);
};
paddingBottomSlider.on('input', changePaddingBottom);
paddingBottomSlider.on('change', changePaddingBottom);

const radiusContainer = menu.append('div')
  .classed('input-container', true);
const radiusSlider = radiusContainer.append('input')
  .attr('type', 'range')
  .attr('min', 0)
  .attr('max', 100)
  .attr('value', h.radius)
const radiusSliderSpan = radiusContainer.append('span') 
  .text(h.radius);
const changeRadius = () => {
  h.radius = Number(radiusSlider.property('value'));
  update(h.toPosition(), false);
  radiusSliderSpan.text(h.radius);
};
radiusSlider.on('input', changeRadius);
radiusSlider.on('change', changeRadius);

class Iterator {
  constructor(data) {
    this.cnt = 0;
    this.data = data;
  }
  get now() { return this.data[this.cnt]; }
  get hasNext() { return this.cnt < this.data.length; }
  next() { this.cnt++; }
};

let queries = new Iterator([]);
const testcase1 = '4 1 3 2 16 9 10 14 8 7';

const textarea = menu.append('textarea')
  .property('value', testcase1);
const pushQueriesButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'push queue')
  .on('click', () => {
    const input = d3.merge(textarea.property('value')
      .split('\n')
      .map(d => d.split(' ')))
      .map(d => Number(d));
    queries = new Iterator(input);
    console.log(`Queries: ${queries.data}`);
    updateQueryInfo();
  });

const pushButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'push')
  .on('click', () => {
    if (queries.hasNext) {
      pushButton.property('disabled', true);
      const arr = h.push(queries.now);
      if (arr === undefined) {
        pushButton.property('disabled', false);
        return;
      }
      console.log(`pushed: ${queries.now}`);
      queries.next();
      updateQueryInfo();
      let i = 0;
      const timer = d3.interval(() => {
        if (i < arr.length) {
          update(arr[i], true);
          i++;
        } else {
          timer.stop();
          pushButton.property('disabled', false);
        }
      }, 500);
    }
  });
const popButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'pop')
  .on('click', () => {
    popButton.property('disabled', true);
    const arr = h.pop();
    if (arr === undefined) {
      popButton.property('disabled', false);
      return;
    }
    console.log(`poped: ${h.front()}`);
    let i = 0;
    const timer = d3.interval(() => {
      if (i < arr.length) {
        update(arr[i], true);
        i++;
      } else {
        timer.stop();
        popButton.property('disabled', false);
      }
    }, 500);
  });
const randomButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'random')
  .on('click', () => {
    const rand = d3.randomUniform(-99, 100);
    queries = new Iterator([...Array(20)].map(d => Math.floor(rand())));
    updateQueryInfo();
  });
const heapCapNumberContainer = menu.append('div')
  .classed('heapCapNumber-contaner', true);
heapCapNumberContainer.append('label')
  .text('Capacity: ');
const heapCapNumber = heapCapNumberContainer.append('input')
  .attr('type', 'number')
  .attr('value', 15)
  .on('change', () => {
    h.resize(Number(heapCapNumber.property('value')));
    update(h.toPosition(), false);
  });
update(h.toPosition(), false);

const queryInfo = menu.append('div')
  .classed('query-info', true)  
  .append('ul');
const updateQueryInfo = () => {
  const span = queryInfo.selectAll('li')
    .data(queries.data.slice(queries.cnt));
  span.exit().remove();
  span.enter()
    .append('li')
    .merge(span)
    .text(d => d);
};
