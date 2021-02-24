import React, { useState } from "react";
import { Container, Col, Row, Spinner } from "react-bootstrap";

import {
  GoogleMap,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";

import RectangleWithInfoWindow from "./RectangleWithInfoWindow";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";
import POICard from "./POICard";

import styles from "../../../styles/DashboardHeatMapPlotStyles";
import { DashboardHeatmapContext } from "./HeatMapPlot";

import POIIcons from "../../../icons/POIIcons";

const libraries = ["places"];

const MapComponent = (props) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { gridData, poiData, predictionData } = React.useContext(
    DashboardHeatmapContext
  );

  const [selectedPlace, setSelectedPlace] = useState(null);
  const [center, setCenter] = useState(props.center);
  const [searchBox, setSearchBox] = useState(null);

  const onSearchBoxLoad = (ref) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    const selectedPlace_ = searchBox.getPlaces()[0];
    setSelectedPlace(selectedPlace_);
    setCenter(selectedPlace_.geometry.location);
  };

  return (
    <Container style={{ width: "90%" }}>
      <Row>
        <Col>
          {!isLoaded ? (
            <Spinner size="md" animation="border" />
          ) : (
            <StandaloneSearchBox
              onLoad={onSearchBoxLoad}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                type="text"
                placeholder="Enter a place to search"
                style={styles.searchPlaceInputStyle}
              />
            </StandaloneSearchBox>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {!isLoaded ? (
            "Loading Maps..."
          ) : (
            <GoogleMap
              id="dashboard-heatmap"
              mapContainerStyle={styles.mapContainerStyle}
              zoom={14}
              center={center}
            >
              {gridData &&
                gridData.map((point, idx) => (
                  <RectangleWithInfoWindow
                    key={"Rectagle" + idx}
                    point={{
                      ...point,
                      prediction: predictionData[point.id],
                    }}
                  />
                ))}

              {poiData &&
                poiData.map((poi, idx) => (
                  <MarkerWithInfoWindow
                    key={"Marker" + idx}
                    position={poi.location}
                    info={<POICard poi={poi} style={{ fontWeight: "500", width: "267px" }} />}
                    icon={POIIcons[poi.poi_type]}
                  />
                ))}

              {selectedPlace && (
                <MarkerWithInfoWindow
                  key="SearchMarker"
                  position={selectedPlace.geometry.location}
                  info={<div>{selectedPlace.formatted_address}</div>}
                />
              )}
            </GoogleMap>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MapComponent;
