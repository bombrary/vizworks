const [width, height] = [800, 500];
const body = d3.select('body');
const flexContainer = body.select('div.flex-container')
const menu = flexContainer.select('div.menu-left')
const main = flexContainer.select('div.main-container')
const textarea = menu.append('textarea')
  .style('height', height - 20);

const table = main.append('table');
const [tdw, tdh] = [20, 20];

function update(data) {
  const tr = table.selectAll('tr')
    .data(data);
  tr.exit().remove();
  const td = tr.enter()
    .append('tr')
    .merge(tr)
    .selectAll('td')
    .data(d => d);
  td.exit().remove();
  td.enter()
    .append('td')
    .merge(td)
    .style('width', tdw)
    .style('height', tdh)
    .style('background-color', d => d.col)
    .html(d => d.text);
}

function strToMazeData(str) {
  return str.split('\n')
    .map(d => d.split(''));
}

const testcase01 = "\
########\n\
#......#\n\
#.######\n\
#..#...#\n\
#..##..#\n\
##.....#\n\
########\
";

const mazeitr = new MazeHistoryIterator(solveMaze(strToMazeData(testcase01), [1, 1]));
const itrButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'iterate')
  .on('click', () => {
    if (mazeitr.hasNext()) {
      update(mazeitr.now());
      mazeitr.next();
    } else {
      mazeitr.reset();
    }
  });
