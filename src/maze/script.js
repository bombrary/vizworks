const [width, height] = [800, 500];
const body = d3.select('body');
const flexContainer = body.select('div.flex-container')
const menu = flexContainer.select('div.menu-left')
const main = flexContainer.select('div.main-container')
const textarea = menu.append('textarea')
  .style('height', height - 20);

const table = main.append('table');
const [tdw, tdh] = [30, 30];

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
    .style('text-align', 'center')
    .style('background-color', d => d.col)
    .html(d => d.text);
}

function strToMazeFormat(str) {
  const tmp = str.split('\n');
  const mp = tmp.slice(1)
    .map(d => d.split(''));
  const start = tmp.slice(0, 1)[0]
    .split(' ')
    .map(d => Number(d));
  return [mp, start];
}

let mazeitr;
const genButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'generate')
  .on('click', () => {
    const input = textarea.property('value');
    const [mp, start] = strToMazeFormat(input);
    mazeitr = new MazeHistoryIterator(solveMaze(mp, start));
    update(mazeitr.now());
  });
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

let timerEnabled = false;
const playButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'play')
  .on('click', () => {
    if (!timerEnabled) {
      timerEnabled = true;
      const t = d3.interval(() => {
        if (mazeitr.hasNext()) {
          update(mazeitr.now());
          mazeitr.next();
        } else {
          mazeitr.reset();
          t.stop();
          timerEnabled = false;
        }
      }, 100);
    }
  });


const testcase02 = "\
1 1\n\
########\n\
#......#\n\
#.######\n\
#..#...#\n\
#..##..#\n\
##.....#\n\
########";

const testcase01 = "\
0 1\n\
#.######.#\n\
......#..#\n\
.#.##.##.#\n\
.#........\n\
##.##.####\n\
....#....#\n\
.#######.#\n\
....#.....\n\
.####.###.\n\
....#....#"

const testcaseButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'testcase')
  .on('click', () => {
    textarea.property('value', testcase01);
  });
const mazeGen = new MazeGenerator(21, 21);
const randomButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'random')
  .on('click', () => {
    const mp = mazeGen.generate(1, 1);
    textarea.property('value', '1 1\n' + mp.map(d => d.join('')).join('\n'));
    mazeitr = new MazeHistoryIterator(solveMaze(mp, [1, 1]));
    update(mazeitr.now());
  });
