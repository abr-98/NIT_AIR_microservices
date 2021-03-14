const hotelInfo = (infoObj) => {
  return (
    <>
      <div>Average Daily price: Rs. {infoObj.price}</div>
      <div>Rating: {infoObj.rating}</div>
    </>
  );
};

const schoolInfo = (infoObj) => {
  return <div>Rating: {infoObj.rating}</div>;
};

const parkInfo = (infoObj) => {
  return <div>Rating: {infoObj.rating}</div>;
};

const getInfoBuilder = (poi_type) => {
  const types = {
    hotel: hotelInfo,
    school: schoolInfo,
    park: parkInfo,
  };

  return types[poi_type];
};

export default getInfoBuilder;
