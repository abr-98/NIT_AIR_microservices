import axios from "axios";

let baseGeoCodeURL = "https://maps.googleapis.com/maps/api/geocode/json?key=";

export default {
  getLatLon(address, appkey) {
    if (address) {
      return axios.get(baseGeoCodeURL + appkey + "&address=" + address);
    }
  },
};
