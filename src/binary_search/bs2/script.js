d3.select('body')
  .append('input')
  .attr('type', 'button')
  .attr('id', 'next_gen')
  .attr('value', 'button');

d3.select('body')
  .append('svg')
  .attr('width', 1500)
  .attr('height', 1500);

let dat = [{
  val: 520,
  left: 0,
  right: 991
}];

const scale = d3.scaleLinear()
  .domain([0, 990])
  .range([0, 990]);

const ticks = [0];
//for (let i = 0; i <= 900; i += 100){
//  ticks.push(i);
//  if (i == 500) ticks.push(520);
//}
ticks.push(990);
const axis = d3.axisBottom(scale)
  .tickValues(ticks);


const svg = d3.select('svg');
const showData = (y) => {
  const g = svg.append('g');
  const translate = `translate(30, ${y})`;
  g.append('g')
    .attr('transform', translate)
    .call(axis)
  g.append('rect')
    .data(dat)
    .attr('transform', translate)
    .attr('y', -2.5)
    .attr('x', (d) => d.left)
    .attr('fill', 'green')
    .attr('width', (d) => (d.val - d.left))
    .attr('height', 5);
  g.append('rect')
    .data(dat)
    .attr('transform', translate)
    .attr('y', -2.5)
    .attr('x', (d) => d.val)
    .attr('fill', 'red')
    .attr('width', (d) => d.right - d.val)
    .attr('height', 5);
  let circle = g.append('g')
    .attr('transform', translate)
    .attr('font-size', 10)
  circle.append('circle')
    .data(dat)
    .attr('fill', 'yellow')
    .attr('stroke', 'black')
    .attr('r', 4)
    .attr('cx', (d) => scale(Math.floor((d.left + d.right)/2)))
  circle.append('text')
    .data(dat)
    .attr('fill', '#000')
    .attr('x', (d) => scale(Math.floor((d.left + d.right)/2)))
    .attr('dx', '-1em')
    .attr('y', 9)
    .attr('dy', '0.71em')
    .text((d) => Math.floor((d.left + d.right)/2));
};

let y = 30;

d3.select('#next_gen')
  .on('click', () => {
  let mid = Math.floor((dat[0].left + dat[0].right) / 2);
  if (mid <= dat[0].val) dat[0].left = mid;
  else dat[0].right = mid;
  y += 50;
  showData(y);
  //console.log({l, mid, r});
});
showData(y);
