const [svgWidth, svgHeight] = [800, 800];
const article = d3.select('article');
const menu = article.select('section.menu-left');
const main = article.select('section.content');
const table = main.append('table');
const svg = main.append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const formatData = data => data.map(row => {
  row.str += ' ';
  const col = row.str.split('')
    .map((d, i) => {
      const ret = {};
      ret['text'] = d;
      if (i === row.spos) ret['color'] = 'orangered';
      else if (i === row.pos) ret['color'] = 'lightgreen';
      else ret['color'] = 'white';
      return ret;
    });
  return d3.merge([[{text: row.name, color: 'white'}], col]);
});

const pad = 100;
const update = (data) => {
  svg.selectAll('*').remove();
  const root = d3.hierarchy(data);
  const tree = d3.tree()
    .size([svgWidth, svgHeight-pad]);
  tree(root);
  
  const g = svg.append('g')
    .attr('transform', d => `translate(${0}, ${pad/2})`);

  const [rectWidth, rectHeight] = [80, 30];


  const linksData = root.links().map(d => {
    const ret = {
      source: { x: d.source.x, y: d.source.y },
      target: { x: d.target.x, y: d.target.y }
    };
    ret.source.x += rectWidth/2;
    ret.source.y += rectHeight;
    ret.target.x += rectWidth/2;
    return ret;
  });

  const link = g.selectAll('path')
    .data(linksData)
    .enter()
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('d', 
      d3.linkVertical()
        .x(d => d.x)
        .y(d => d.y)
    );

  const elem = g.selectAll('g')
    .data(root.descendants())
    .enter()
    .append('g')
    .attr('transform', d => `translate(${d.x}, ${d.y})`);

  elem.append('rect')
    .attr('width', rectWidth)
    .attr('height', rectHeight)
    .attr('fill', (d) => {
      if (d.data.name === 'atom' || d.data.name === 'number') {
        return '#fff';
      } else {
        return '#ccc';
      }
    })
    .attr('stroke', '#000');
  elem.append('text')
    .attr('dx', rectWidth/2)
    .attr('dy', rectHeight/2)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'central')
    .text((d) => {
      if (d.data.name === 'atom' || d.data.name === 'number') {
        return d.data.text;
      } else {
        return d.data.name;
      }
    })

}

const testcase01 = '1+2+3';
const testcase02 = '4-2*3';
const testcase03 = '4*(8+4+3)';
const testcase04 = '(1+(2+(3*4)+1))+4';

const textarea = menu.append('textarea')
  .property('value', testcase03);

let itr = null;
const genButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'generate')
  .on('click', () => {
    const input = textarea.property('value')
      .split('\n')[0];
    const p = new Parser(input);
    update(p.execute());
  });

const p1 = new Parser(testcase04);
update(p1.execute());
