const main = d3.select('article')
  .select('section.content');
const menu = d3.select('article')
  .select('section.menu-left');
const table = main.append('table');

function update(data) {
  const dataWithIdx = [];
  for (let i = 0; i < data.length; i++) {
    dataWithIdx.push([]);
    for (let j = 0; j < data[i].length; j++) {
      dataWithIdx[i].push({i: i, j: j, alive: data[i][j]});
    }
  }
  const tr = table.selectAll('tr')
    .data(dataWithIdx);
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
    .style('background-color', d => d.alive ? 'black' : 'white')
    .on('click', function(d) {
      data[d.i][d.j] = data[d.i][d.j] ? false : true;
      d3.select(this)
        .style('background-color', data[d.i][d.j] ? 'black' : 'white');
    });
}

const randMap = (row, col) => {
  const rand = d3.randomUniform(0, 1);
  const ret = [...Array(row)];
  for (let i = 0; i < row; i++) {
    ret[i] = [...Array(col)].map(d => rand() < 0.5);
  }
  return ret;
};

const di = [-1, -1, 0, 1, 1, 1, 0, -1];
const dj = [0, 1, 1, 1, 0, -1, -1, -1];
const nextGen = (data) => {
  const ret = [];
  for (let i = 0; i < data.length; i++) {
    ret.push([...data[i]]);
  }
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      let cnt = 0;
      for (let k = 0; k < 8; k++) {
        const [ni, nj] = [i + di[k], j + dj[k]];
        if (ni < 0 || data.length <= ni) continue;
        if (nj < 0 || data[i].length <= nj) continue;
        if (data[ni][nj]) cnt++;
      }
      if (cnt === 3) ret[i][j] = true;
      else if (cnt <= 1 || 4 <= cnt) ret[i][j] = false;
    }
  }
  return ret;
};

let map = randMap(20, 20);
const genTimer = () => d3.interval(() => {
  map = nextGen(map);
  update(map);
}, 200);
let timer;

const rowInput = menu.append('p')
  .attr('class', 'number-form');
rowInput.append('label')
  .attr('for', 'row')
  .text('row: ');
rowInput.append('input')
  .attr('name', 'row')
  .attr('type', 'number')
  .attr('value', 20);
const colInput = menu.append('p')
  .attr('class', 'number-form');
colInput.append('label')
  .attr('for', 'col')
  .text('col: ');
colInput.append('input')
  .attr('name', 'col')
  .attr('type', 'number')
  .attr('value', 20);

menu.append('input')
  .attr('type', 'button')
  .attr('value', 'random')
  .on('click', () => {
    const row = rowInput.select('input')
      .property('value');
    const col = colInput.select('input')
      .property('value');
    map = randMap(Number(row), Number(col));
    update(map);
  });
const startButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'start')
const stopButton = menu.append('input')
  .attr('type', 'button')
  .attr('value', 'stop')
  .property('disabled', true);

startButton.on('click', () => {
  timer = genTimer();
  startButton.property('disabled', true);
  stopButton.property('disabled', false);
});
stopButton.on('click', () => {
  timer.stop();
  startButton.property('disabled', false);
  stopButton.property('disabled', true);
});

