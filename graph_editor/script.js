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

for (let i = 0; i < 5; i++) gEdit.addNode({name: i});
for (let i = 0; i < 5; i++) {
  for (let j = i + 1; j < 5; j++) {
    gEdit.addLink({source: i, target: j});
  }
}
gEdit.restart();
