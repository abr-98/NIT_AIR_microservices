function buildGrid() {
  const xcoords = [23.565774, 23.5580615, 23.550349, 23.5426365, 23.534924];
  const ycoords = [87.269568, 87.28258925, 87.2956105, 87.30863175, 87.321653];
  let geodata = [];
  for (let i = 0; i < xcoords.length - 1; i++) {
    for (let j = 0; j < ycoords.length - 1; j++) {
      geodata.push({
        sw: { lat: xcoords[i], lng: ycoords[j] },
        ne: { lat: xcoords[i + 1], lng: ycoords[j + 1] },
      });
    }
  }
  geodata.forEach((obj, index) => {
    obj["id"] = index;
  });
  return geodata;
}

export default buildGrid;