const [graphWidth, graphHeight] = [300, 300];
const pad = 20;
const r = 100;
const [cx, cy] = [graphHeight/2 + pad, graphWidth/2 + pad];
const svgLength = 2*pad + graphWidth + graphHeight;
const article = d3.select('article');
const svg = article.select('section.content')
  .select('svg')
  .attr('width', svgLength)
  .attr('height', svgLength);

const update = (cosData, sinData, theta) => {
  svg.selectAll('*').remove();
  const cosArea = svg.append('g');
  const sinArea = svg.append('g');
  const circleArea = svg.append('g')
    .attr('transform', `translate(${cx}, ${cy})`);

  const px = r * Math.cos(-theta / 180 * Math.PI);
  const py = r * Math.sin(-theta / 180 * Math.PI);
  circleArea.append('circle')
    .attr('r', r)
    .attr('fill', '#fff')
    .attr('stroke', '#000');
  circleArea.append('circle')
    .attr('r', 1)
    .attr('fill', '#000')
    .attr('stroke', '#000');
  circleArea.append('circle')
    .attr('r', 1)
    .attr('cx', px)
    .attr('cy', py)
    .attr('fill', '#000')
    .attr('stroke', '#000');

  const xScaleSin = d3.scaleLinear()
    .domain(d3.extent(sinData, d => d[0]))
    .range([0, graphWidth]);
  const yScaleSin = d3.scaleLinear()
    .domain([-1, 1])
    .range([2*r, 0]);

  sinArea.append('g')
    .attr('transform', `translate(${graphHeight + pad}, ${graphHeight/2 + pad})`)
    .call(d3.axisBottom(xScaleSin).ticks(5));
  sinArea.append('g')
    .attr('transform', `translate(${graphHeight + pad}, ${pad + graphHeight/2 - r})`)
    .call(d3.axisLeft(yScaleSin).ticks(5));
  sinArea.append('g')
    .attr('transform', `translate(${graphHeight + pad}, ${pad + graphHeight/2 - r})`)
    .append('path')
    .datum(sinData)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('d', d3.line()
        .x(d => xScaleSin(d[0]))
        .y(d => yScaleSin(d[1])));

  const xScaleCos = d3.scaleLinear()
    .domain(d3.extent(cosData, d => d[0]))
    .range([0, graphWidth]);
  const yScaleCos = d3.scaleLinear()
    .domain([-1, 1])
    .range([0, 2*r]);

  cosArea.append('g')
    .attr('transform', `translate(${pad + graphHeight/2}, ${pad + graphHeight})`)
    .call(d3.axisRight(xScaleCos).ticks(5));
  cosArea.append('g')
    .attr('transform', `translate(${pad + graphHeight/2 - r}, ${pad + graphHeight})`)
    .call(d3.axisTop(yScaleCos).ticks(5));
  cosArea.append('g')
    .attr('transform', `translate(${pad + graphHeight/2 - r}, ${pad + graphHeight})`)
    .append('path')
    .datum(cosData)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('d', d3.line()
        .x(d => yScaleCos(d[1]))
        .y(d => xScaleCos(d[0])));

  circleArea.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('d', `M${px},${py} L${px},${pad + graphHeight - cy}`);
  circleArea.append('path')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('d', `M${px},${py} L${pad + graphHeight - cx},${py}`);
};


let theta = 0;
const x = d3.range(0, 2*Math.PI, 0.01);
const timer = d3.interval(() => {
  const cosData = x.map(d => [d, Math.cos(d + theta/180 * Math.PI)]);
  const sinData = x.map(d => [d, Math.sin(d + theta/180 * Math.PI)]);
  update(cosData, sinData, theta);
  theta = (theta + 1) % 360;
});

