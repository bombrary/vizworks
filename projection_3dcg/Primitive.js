const genSphere = (radius, slices, stacks) => {
  const vert = [], edge = [];
  for (let i = 0; i <= stacks; i++) {
    const phi = i * Math.PI / stacks - Math.PI/2;
    const r = radius * Math.cos(phi);
    const y = radius * Math.sin(phi);
    for (let j = 0; j < slices; j++) {
      const theta = j * 2 * Math.PI / slices;
      const x = r * Math.cos(theta);
      const z = r * Math.sin(theta);
      vert.push([x, y, z, 1]);
      const idx = i * slices + j;
      if (j + 1 < slices) {
        edge.push([idx, idx + 1]);
      } else {
        edge.push([idx, i * slices]);
      }
      if (i + 1 <= stacks) {
        edge.push([idx, idx + slices]);
      }
    }
  }
  return new Shape(vert, edge);
};

const genCircle = (radius, slices) => {
  const vert = [], edge = [];
  d3.range(0, 2*Math.PI, 2*Math.PI/slices)
    .forEach(theta => {
      x = radius*Math.cos(theta);
      z = radius*Math.sin(theta);
      vert.push([x, 0, z]);
    });
  for (let i = 0; i < vert.length; i++) {
    edge.push([i, (i + 1) % vert.length]);
  }
  return [vert, edge];
};
