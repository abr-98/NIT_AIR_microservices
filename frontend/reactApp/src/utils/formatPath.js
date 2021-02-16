const formatPath = (path) => {
  return path.map((p) => ({ lat: p[0], lng: p[1] }));
};

export default formatPath;
