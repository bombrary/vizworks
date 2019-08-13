const [svgWidth, svgHeight] = [800, 600];
const article = d3.select('body')
  .select('article');
const menu = article.select('section.menu-left');
const svg = article.select('section.content')
  .select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight);
const textarea = menu.select('textarea');
const genButton0 = menu.select('input#gen_button0');
const genButton1 = menu.select('input#gen_button1');

const gEdit = new GraphEditor(svg, true);

genButton0.on('click', () => {
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
    if (link.length >= 2) {
      gEdit.addLink({source: link[0], target: link[1], label: link[2]});
    }
  }

  gEdit.restart();
});

genButton1.on('click', () => {
  gEdit.initGraph();
  const input = textarea.property('value')
    .split('\n')
    .map(d => d.split(' '))

  const nodeNum = input[0][0];
  for (let i = 0; i < nodeNum; i++) {
    gEdit.addNode({label: i+1});
  }

  const links = input.slice(1);
  for (const link of links) {
    if (link.length >= 2) {
      link[0]--;
      link[1]--;
      gEdit.addLink({source: link[0], target: link[1], label: link[2]});
    }
  }

  gEdit.restart();
});

const graphSetting = article.select('section.graph-setting');
graphSetting.select('input#chargeStrength_number')
  .attr('value', gEdit.chargeStrength)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.chargeStrength = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#linkDistance_number')
  .attr('value', gEdit.linkDistance)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.linkDistance = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#slfh_number')
  .attr('value', gEdit.selfLoopFarHeight)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.selfLoopFarHeight = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#slfb_number')
  .attr('value', gEdit.selfLoopFarBottom)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.selfLoopFarBottom = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#slch_number')
  .attr('value', gEdit.selfLoopCloseHeight)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.selfLoopCloseHeight = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#slcb_number')
  .attr('value', gEdit.selfLoopCloseBottom)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.selfLoopCloseBottom = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#r_number')
  .attr('value', gEdit.r)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.r = Number(input);
    gEdit.initSimulation();
    gEdit.restart();
  });
graphSetting.select('input#nodeLinkSep_number')
  .attr('value', gEdit.nodeLinkSep)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.nodeLinkSep = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#nodeMarkerSep_number')
  .attr('value', gEdit.nodeMarkerSep)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.nodeMarkerSep = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#markerSize_number')
  .attr('value', gEdit.markerSize)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.markerSize = Number(input);
    gEdit.initSimulation();
  });
graphSetting.select('input#adjacentLinkSep_number')
  .attr('value', gEdit.adjacentLinkSep)
  .on('change', function() {
    const input = d3.select(this).property('value');
    gEdit.adjacentLinkSep = Number(input);
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
  '5 4 23\n' +
  '0 0';
textarea.property('value', testcase01);
