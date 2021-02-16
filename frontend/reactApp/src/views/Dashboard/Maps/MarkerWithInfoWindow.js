import React, { useState } from "react";

import { Marker, InfoWindow } from "@react-google-maps/api";

const MarkerWithInfoWindow = (props) => {
  const [isClicked, setClicked] = useState(false);

  return (
    <Marker
      position={props.position}
      onClick={() => {
        setClicked(true);
      }}
      icon={{
        url: props.icon,
        scaledSize: new window.google.maps.Size(25, 25),
      }}
    >
      {isClicked && (
        <InfoWindow
          onCloseClick={() => {
            setClicked(false);
          }}
        >
          {props.info}
        </InfoWindow>
      )}
    </Marker>
  );
};

export default MarkerWithInfoWindow;
