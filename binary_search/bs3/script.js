d3.select('body')
  .append('input')
  .attr('type', 'button')
  .attr('id', 'smaller_button')
  .attr('value', '以上である');

d3.select('body')
  .append('input')
  .attr('type', 'button')
  .attr('id', 'bigger_button')
  .attr('value', '未満である');

d3.select('body')
  .append('svg')
  .attr('width', 1500)
  .attr('height', 1500);

let dat = [{
  val: 520,
  left: 0,
  mid: 495,
  right: 990
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
    .attr('width', (d) => (d.right - d.left + 1))
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

d3.select('#smaller_button')
  .on('click', () => {
    dat[0].left = dat[0].mid;
    dat[0].mid = (dat[0].left + dat[0].right) / 2;
    y += 50;
    showData(y);
  });

d3.select('#bigger_button')
  .on('click', () => {
    dat[0].right = dat[0].mid;
    dat[0].mid = (dat[0].left + dat[0].right) / 2;
    y += 50;
    showData(y);
  });
showData(y);
