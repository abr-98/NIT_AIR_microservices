const BASE_URL = "http://117.218.3.141:5000/";

async function predByDateHour(dateTime) {
  let date = dateTime.split("T")[0];
  let hour = dateTime.split("T")[1].split(":")[0];
  let apiCallString = `${BASE_URL}/pred_by_date_hour?date=${date}&hour=${hour}`;
  let response = await fetch(apiCallString);
  if (response.status == 200) {
    let predictionData = await response.json();
    return predictionData;
  } else {
    throw Error("Failed to fetch predictions for Grid.");
  }
}

async function predTableData(gridId, dateTime) {
  let date = dateTime.split("T")[0];
  let apiCallString = `${BASE_URL}/pred_table_data?grid=${gridId}&date=${date}`;
  let response = await fetch(apiCallString);
  if (response.status == 200) {
    let data = await response.json();
    return data;
  } else {
    throw Error(`Failed to fetch table data for grid ${gridId} on ${date}`);
  }
}

const AQICountWeekly = async (date, grid) => {
  return await fetch(
    `${BASE_URL}/pred_aqi_count_weekly?date=${date}&grid=${grid}`
  ).then((res) => res.json());
};

const AQICountDaily = async (date) => {
  return await fetch(
    `${BASE_URL}/whole_grid_daily_aqi_count?date=${date}`
  ).then((res) => res.json());
};

const routeWithAlpha = async (source, dest, alpha) => {
  return await fetch(
    `${BASE_URL}/route_recommendation?source=${source.lat},${source.lng}&destination=${dest.lat},${dest.lng}&alpha=${alpha}`
  ).then((res) => res.json());
};

export {
  predByDateHour,
  predTableData,
  AQICountWeekly,
  AQICountDaily,
  routeWithAlpha,
};
