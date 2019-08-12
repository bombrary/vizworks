const [svgWidth, svgHeight] = [800, 600];
const article = d3.select('body')
  .select('article');
const menu = article.select('section.menu-left');
const svg = article.select('section.content')
  .select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const textarea = menu.select('textarea');
const chargeStrengthP = menu.select('input#chargeStrength_number')
const linkDistanceP = menu.select('input#linkDistance_number')
const genButton = menu.select('input#gen_button');

const gEdit = new GraphEditor(svg, true);

genButton.on('click', () => {
  gEdit.initGraph();
  const input = textarea.property('value')
    .split('\n')
    .map(d => d.split(' '))

  const nodeNum = input[0][0];
  for (let i = 0; i < nodeNum; i++) {
    gEdit.addNode({label: i});
  }

  const links = input.slice(1);
  for (const link of links) {
    gEdit.addLink({source: link[0], target: link[1], label: link[2]});
  }

  gEdit.restart();
});
chargeStrengthP.attr('value', gEdit.chargeStrength)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.chargeStrength = Number(input);
    gEdit.initSimulation();
  });
linkDistanceP.attr('value', gEdit.linkDistance)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.linkDistance = Number(input);
    gEdit.initSimulation();
  });

const testcase01 = 
  '6\n' +
  '0 1\n' +
  '0 2\n' +
  '1 2\n' +
  '1 3 Hello\n' +
  '1 4\n' +
  '2 4\n' +
  '3 4\n' +
  '3 5\n' +
  '4 5 10\n' +
  '5 4 23';
textarea.property('value', testcase01);
