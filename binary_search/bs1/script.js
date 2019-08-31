let randD = d3.randomUniform(0, 50);
let rand10 = () => Math.floor(randD());

let dat = [];
let x = rand10();
for (let i = 0; i < 30; i++) {
  let num = rand10();
  dat.push(num);
}
dat.sort((a, b) => (a - b));
let l = -1, r = dat.length, mid = Math.floor((l + r) / 2);

//d3.select('body').append('div').attr('class', 'outer');
const showData = function() {
  //let p = d3.select('body div.outer')
  //  .selectAll('p')
  //  .data(dat);
  d3.select('body')
    .append('div')
    .attr('class', 'outer')
    .selectAll('p')
    .data(dat)
    .enter()
    .append('p')
    .text((d)=>d)
    .style('background', (d, i) => {
        if (i == mid) return 'yellow';
        else if (i < l || r < i) return 'white';
        else if (d <= x) return 'lightgreen';
        else return 'orangered';
      });
  /*p.enter()
    .append('p')
    .text((d) => d)
    .merge(p)
    .transition()
    .duration(1000)
    .style('background', (d, i) => {
      if (i == mid) return 'yellow';
      else if (i < l || r < i) return 'white';
      else if (d <= x) return 'lightgreen';
      else return 'orangered';
    })*/
}

d3.select('#next_gen')
.on('click', () => {
  if (dat[mid] <= x) l = mid;
  else r = mid;
  mid = Math.floor((l + r) / 2);
  showData();
  console.log({l, mid, r});
});
d3.select('body')
  .append('p')
  .text(`${x}`);
showData();
