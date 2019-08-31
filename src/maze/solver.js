
function solveMaze(mp, start) {
  const dist = new Array(mp.length);
  for (let i = 0; i < mp.length; i++) {
    dist[i] = new Array(mp[i].length).fill(Infinity);
  }

  const q = new Queue();
  const ret = new MazeHistory(mp);
  const dy = [-1, 0, 1, 0];
  const dx = [0, 1, 0, -1];
  const isValid = (y, x) => {
    if (y < 0 || y >= mp.length) return false;
    if (x < 0 || x >= mp[0].length) return false;
    return mp[y][x] === '.';
  }
  q.push(start);
  dist[start[0]][start[1]] = 0;
  while (!q.empty()) {
    const [y, x] = q.front(); q.pop();    
    for (let i = 0; i < 4; i++) {
      const [ny, nx] = [y + dy[i], x + dx[i]];
      if (isValid(ny, nx) && dist[y][x] + 1 < dist[ny][nx]) {
        dist[ny][nx] = dist[y][x] + 1;
        q.push([ny, nx]);
      }
      ret.push(dist, q, [ny, nx]);
    }
  }
  ret.push(dist, q, [-1, -1]);
  return ret;
}
