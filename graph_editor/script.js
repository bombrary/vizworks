const [svgWidth, svgHeight] = [800, 600];
const article = d3.select('body')
  .select('article');
const menu = article.select('section.menu-left');
const svg = article.select('section.content')
  .select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);

const genButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'generate');

const gEdit = new GraphEditor(svg, true);
gEdit.addNode({name: 0});
gEdit.addNode({name: 1});
gEdit.addNode({name: 2});
gEdit.addLink({source: 0, target: 2});
gEdit.restart();
