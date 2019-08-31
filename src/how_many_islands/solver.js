
function cpArr(arr) {
  let ret = []
  for (let i = 0; i < arr.length; i++) {
    ret.push([]);
    for (let j = 0; j < arr[i].length; j++) {
      ret[i].push(arr[i][j]);
    }
  }
  return ret;
}

function solveHowManyIslands(mp, gridFill) {
  const col = (i) => {
    if (i === 0) return 'white';
    else if (i === 1) return 'black';
    else if (i === 2) return 'orangered';
    else  return 'yellow';
  };
  ret = new History(col);
  let ans = 0;
  for (let i = 0; i < mp.length; i++) {
    for(let j = 0; j < mp[i].length; j++) {
      ret.push(cpArr(mp), [i, j]);
      if (mp[i][j] == 1) {
        mp[i][j] = 2;
        gridFill(ret, mp, i, j);
        //deleteRedBlock(mp);
        ret.push(cpArr(mp), [i, j]);
        ans++;
      }
    }
  }
  ret.push(cpArr(mp), [-1, -1]);
  return ret;
}

function deleteRedBlock(mp) {
  for (let i = 0; i < mp.length; i++) {
    for (let j = 0; j < mp[0].length; j++) {
      if (mp[i][j] === 2) mp[i][j] = 0;
    }
  }
}

const dy = [-1, 0, 1, 0]
const dx = [0, 1, 0, -1];
function dfs(ret, mp, y, x) {
  for (let i = 0; i < 4; i++) {
    const [ny, nx] = [y + dy[i], x + dx[i]];
    if (ny < 0 || mp.length <= ny || nx < 0 || mp[0].length <= nx) continue;
    ret.push(cpArr(mp), [ny, nx]);
    if (mp[ny][nx] == 1) {
      mp[ny][nx] = 2;
      dfs(ret, mp, ny, nx);
      //ret.push(cpArr(mp), [ny, nx]); // 戻っていくところまでみる
    }
  }
}

function bfs(ret, mp, y, x) {
  q = new Queue();
  q.push([y, x]);
  while (!q.empty()) {
    const [ty, tx] = q.front(); q.pop();
    for (let i = 0; i < 4; i++) {
      const [ny, nx] = [ty + dy[i], tx + dx[i]];
      if (ny < 0 || mp.length <= ny || nx < 0 || mp[0].length <= nx) continue;
      ret.push(cpArr(mp), [ny, nx]);
      if (mp[ny][nx] == 1) {
        mp[ny][nx] = 2;
        q.push([ny, nx]);
        ret.push(cpArr(mp), [ny, nx]);
      }
    }
  }
}


function cpArrByUF(mp, uf) {
  let ret = [];
  for (let i = 0; i < mp.length; i++) {
    ret.push([]);
    for (let j = 0; j < mp[0].length; j++) {
      if (mp[i][j] === 0) ret[i].push([-1, -1]);
      else ret[i].push(uf.find([i, j]));
    }
  }
  return ret;
}
function solveHowManyIslandsByUF(mp) {
  // Clojure
  const colorGenerator = () => {
    //const colorScale = d3.scaleOrdinal(d3.schemeSet1.concat(d3.schemeSet2.concat(d3.schemeSet3)));
    const rand = d3.randomUniform(0,256);
    const colorSet = {};
    for (let i = 0; i < mp.length; i++) {
      for (let j = 0; j < mp[0].length; j++) {
        if (mp[i][j] === 1) {
          colorSet[[i,j]] = d3.rgb(rand(), rand(), rand());
        }
      }
    }
    return d => {
      if (d.toString() === [-1,-1].toString()) return 'white';
      else if (d.toString() === '3') return 'red';
      else return colorSet[d];
    };
  }
  
  ret = new History(colorGenerator());
  const uf = new UnionFind(mp.length, mp[0].length);
  for (let y = 0; y < mp.length; y++) {
    for(let x = 0; x < mp[y].length; x++) {
      ret.push(cpArrByUF(mp, uf), [y, x]);
      if (mp[y][x] === 1) {
        for (let i = 0; i < 4; i++) {
          const [ny, nx] = [y + dy[i], x + dx[i]];
          if (ny < 0 || mp.length <= ny || nx < 0 || mp[0].length <= nx) continue;
          if (mp[ny][nx] === 1) uf.unite([y, x], [ny, nx]);
        }
      }
    }
  }
  ret.push(cpArrByUF(mp, uf), [-1, -1]);
  return ret;
}

