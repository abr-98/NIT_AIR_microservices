import React, { useState } from "react";

import { Rectangle, InfoWindow } from "@react-google-maps/api";

import AQIcolors from "../../../constants/AQIcolors";

import GridDataTable from "./GridDataTable";

function mapColor(aqi) {
  return Object.values(AQIcolors)[aqi-1].color;
}

const RectangleWithInfoWindow = (props) => {
  const [isClicked, setClicked] = useState(false);

  return (
    <div>
      <Rectangle
        key={props.point.id}
        onClick={() => {
          setClicked(true);
        }}
        bounds={{
          north: props.point.ne.lat,
          east: props.point.ne.lng,
          south: props.point.sw.lat,
          west: props.point.sw.lng,
        }}
        options={{
          // strokeColor: mapColor(props.point.prediction),
          // strokeOpacity: 0.8,
          strokeWeight: 0,
          fillColor: mapColor(props.point.prediction),
          fillOpacity: 0.35,
        }}
      />
      {isClicked && (
        <InfoWindow
          onCloseClick={() => {
            setClicked(false);
          }}
          position={{
            lat: (props.point.ne.lat + props.point.sw.lat) / 2,
            lng: (props.point.ne.lng + props.point.sw.lng) / 2,
          }}
        >
          <GridDataTable gridId={props.point.id} />
        </InfoWindow>
      )}
    </div>
  );
};

export default RectangleWithInfoWindow;
