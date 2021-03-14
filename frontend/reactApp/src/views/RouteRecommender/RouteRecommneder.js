import React, { useState, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  Polyline,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Card,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
  Button,
  Spinner,
} from "react-bootstrap";
import _ from "lodash";
import "./RouteRecommender.css";
import Geocode from "react-geocode";
import RangeSlider from "react-bootstrap-range-slider";
import { routeWithAlpha } from "utils/networkUtil";
import formatPath from "utils/formatPath";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100%",
  height: "86vh",
  borderRadius: "10px",
};
const center = {
  lat: 23.550399503999397,
  lng: 87.2954336733082,
};

const pathOptions = {
  strokeColor: "#ffaa00",
  strokeOpacity: 0.8,
  strokeWeight: 9,
  fillColor: "#FF0000",
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  paths: [],
  zIndex: 1,
};

Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

const getPlaceName = (placeObject) => {
  if (
    placeObject.types.includes("point_of_interest") ||
    placeObject.types.includes["establishment"] ||
    placeObject.types.includes("university")
  ) {
    return `${placeObject.name}, ${placeObject.formatted_address}`;
  } else {
    return `${placeObject.formatted_address}`;
  }
};

const RouteRecommender = () => {
  const [checkboxVal, setCheckboxVal] = useState(false);
  const [autoCompleteSource, setautoCompleteSource] = useState(null);
  const [autoCompleteDest, setautoCompleteDest] = useState(null);
  const [goValue, setgoValue] = useState(false);
  const [customRoute, setcustomRoute] = useState(null);
  const [alphaValue, setAlphaValue] = useState(0);
  const [shortestRouteCheck, setShortestRouteCheck] = useState(false);
  const [shortestRoute, setshortestRoute] = useState(null);
  const [optimalRouteCheck, setOptimalRouteCheck] = useState(false);
  const [optimalRoute, setoptimalRoute] = useState(null);
  const [safestRouteCheck, setSafestRouteCheck] = useState(false);
  const [safestRoute, setsafestRoute] = useState(null);
  const [loading, setloading] = useState(false);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [currentpos, setCurrentpos] = useState(null);
  const [currentPosName, setCurrentPosName] = useState("");
  const [destination, setDestination] = useState(null);
  const [destinationName, setDestinationName] = useState("");
  const destRef = useRef(null);
  const isValid =
    (goValue || shortestRouteCheck || optimalRouteCheck || safestRouteCheck) &&
    currentpos &&
    destination;

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading Google Maps...";
  if (loading)
    return (
      <div
        style={{
          width: "80vw",
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size="md" animation="border" />
      </div>
    );

  const handleSubmit = async () => {
    if (!currentpos && !destination) {
      alert("Source or Destination cannot be empty.");
      return;
    }
    setloading(true);
    setcustomRoute(null);
    setshortestRoute(null);
    setoptimalRoute(null);
    setsafestRoute(null);
    if (goValue) {
      const res = await routeWithAlpha(
        currentpos,
        destination,
        alphaValue / 10
      );
      const returnedPath = formatPath(res.path_req.path.lat_longs);
      const pathOpt = {
        ...pathOptions,
        strokeColor: "#ffaa00",
        strokeWeight: 6,
        zIndex: 2,
        paths: returnedPath,
      };
      setcustomRoute({ path: returnedPath, pathOptions: pathOpt });
    } else {
      if (shortestRouteCheck) {
        const res1 = await routeWithAlpha(currentpos, destination, 1);
        const returnedPath1 = formatPath(res1.path_req.path.lat_longs);
        const pathOpt1 = {
          ...pathOptions,
          strokeColor: "#c10704",
          strokeWeight: 3,
          zIndex: 3,
          paths: returnedPath1,
        };
        setshortestRoute({ path: returnedPath1, pathOptions: pathOpt1 });
      }

      if (optimalRouteCheck) {
        const res2 = await routeWithAlpha(currentpos, destination, 0.5);
        const returnedPath2 = formatPath(res2.path_req.path.lat_longs);
        const pathOpt2 = {
          ...pathOptions,
          strokeColor: "#00b6ff",
          strokeWeight: 6,
          zIndex: 2,
          paths: returnedPath2,
        };
        setoptimalRoute({ path: returnedPath2, pathOptions: pathOpt2 });
      }

      if (safestRouteCheck) {
        const res3 = await routeWithAlpha(currentpos, destination, 0);
        const returnedPath3 = formatPath(res3.path_req.path.lat_longs);
        const pathOpt3 = {
          ...pathOptions,
          strokeColor: "#06b151",
          strokeWeight: 12,
          zIndex: 1,
          paths: returnedPath3,
        };
        setsafestRoute({ path: returnedPath3, pathOptions: pathOpt3 });
      }
    }
    setgoValue(false);
    setShortestRouteCheck(false);
    setOptimalRouteCheck(false);
    setSafestRouteCheck(false);
    setAlphaValue(0);
    setloading(false);
  };

  const handleCurrentLocation = () => {
    if (checkboxVal) {
      setCheckboxVal(false);
      setCurrentpos(null);
    } else {
      setCheckboxVal(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentpos({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  return (
    <Card className="root">
      <Card.Header>
        <Card.Title as="h3">
          <strong>Route Recommendation</strong>
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Container fluid="md">
          <Row>
            <Col md={7}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={14}
                center={center}
              >
                {currentpos && <Marker position={currentpos} />}
                {destination && <Marker position={destination} />}

                {customRoute && (
                  <Polyline
                    path={customRoute.path}
                    options={customRoute.pathOptions}
                  />
                )}

                {shortestRoute && (
                  <Polyline
                    path={shortestRoute.path}
                    options={shortestRoute.pathOptions}
                  />
                )}
                {optimalRoute && (
                  <Polyline
                    path={optimalRoute.path}
                    options={optimalRoute.pathOptions}
                  />
                )}
                {safestRoute && (
                  <Polyline
                    path={safestRoute.path}
                    options={safestRoute.pathOptions}
                  />
                )}
              </GoogleMap>
            </Col>

            <Col md={5}>
              <Card style={{ height: "100%" }}>
                <Card.Body>
                  <Autocomplete
                    onLoad={(autocomplete) =>
                      setautoCompleteSource(autocomplete)
                    }
                    onPlaceChanged={() => {
                      if (autoCompleteSource !== null) {
                        setCurrentPosName(
                          getPlaceName(autoCompleteSource.getPlace())
                        );
                        setCurrentpos({
                          lat: autoCompleteSource
                            .getPlace()
                            .geometry.location.lat(),
                          lng: autoCompleteSource
                            .getPlace()
                            .geometry.location.lng(),
                        });
                      } else {
                        console.log("Autocomplete is not loaded yet!");
                      }
                    }}
                  >
                    <InputGroup className="mt-2 mb-1 input_source">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="source_input">
                          Source
                        </InputGroup.Text>
                      </InputGroup.Prepend>

                      <FormControl
                        value={currentPosName}
                        onChange={(event) => {
                          setCurrentPosName(event.target.value);
                        }}
                        disabled={checkboxVal}
                        ref={destRef}
                        // value={autoCompleteSource ? autoCompleteSource : ""}
                        id="source_input"
                        aria-describedby="source_input"
                      />
                    </InputGroup>
                  </Autocomplete>
                  <div>
                    <input
                      value={checkboxVal}
                      onClick={handleCurrentLocation}
                      type="checkbox"
                      className="input_checkbox"
                    />
                    <span className="span_checkbox">
                      Set as current location
                    </span>
                  </div>

                  <Autocomplete
                    onLoad={(autocomplete) => setautoCompleteDest(autocomplete)}
                    onPlaceChanged={() => {
                      if (autoCompleteDest !== null) {
                        setDestinationName(
                          getPlaceName(autoCompleteDest.getPlace())
                        );
                        setDestination({
                          lat: autoCompleteDest
                            .getPlace()
                            .geometry.location.lat(),
                          lng: autoCompleteDest
                            .getPlace()
                            .geometry.location.lng(),
                        });
                      } else {
                        console.log("Autocomplete is not loaded yet!");
                      }
                    }}
                  >
                    <InputGroup className="mt-4 mb-4 input_destination">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="destination_input">
                          Destination
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        value={destinationName}
                        onChange={(event) => {
                          setDestinationName(event.target.value);
                        }}
                        ref={destRef}
                        id="destination_input"
                        aria-describedby="destination_input"
                      />
                    </InputGroup>
                  </Autocomplete>

                  <Form.Group className="mb-4" controlId="formBasicRange">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Form.Label>Safest</Form.Label>
                      <Form.Label>Shortest</Form.Label>
                    </div>

                    <RangeSlider
                      disabled={!goValue}
                      min={0}
                      max={10}
                      value={alphaValue}
                      tooltipLabel={(currentValue) => `${currentValue / 10}`}
                      tooltip="auto"
                      onChange={(e) => setAlphaValue(e.target.value)}
                      disabled={!goValue}
                    />
                  </Form.Group>

                  <label>Show 3 paths</label>
                  <div>
                    <div className="div_checkbox">
                      <div className="go_checkbox">
                        <input
                          value={shortestRouteCheck}
                          onClick={() => setShortestRouteCheck((val) => !val)}
                          type="checkbox"
                          className="input_checkbox"
                          disabled={goValue}
                        />
                        <span
                          style={{
                            backgroundColor: "#c10704",
                            width: "35px",
                            height: "13px",
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        ></span>
                        <span className="span_checkbox">Shortest</span>
                      </div>
                      <div className="go_checkbox">
                        <input
                          value={optimalRouteCheck}
                          onClick={() => setOptimalRouteCheck((val) => !val)}
                          type="checkbox"
                          className="input_checkbox"
                          disabled={goValue}
                        />
                        <span
                          style={{
                            backgroundColor: "#00b6ff",
                            width: "35px",
                            height: "13px",
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        ></span>
                        <span className="span_checkbox">Optimal </span>
                      </div>
                      <div className="go_checkbox">
                        <input
                          value={safestRouteCheck}
                          onClick={() => setSafestRouteCheck((val) => !val)}
                          type="checkbox"
                          className="input_checkbox"
                          disabled={goValue}
                        />
                        <span
                          style={{
                            backgroundColor: "#06b151",
                            width: "35px",
                            height: "13px",
                            display: "inline-block",
                            marginRight: "4px",
                          }}
                        ></span>
                        <span className="span_checkbox">Safest</span>
                      </div>
                    </div>
                  </div>

                  <label>Show custom path</label>
                  <div style={{ marginLeft: "10px" }}>
                    <input
                      value={goValue}
                      onClick={() => setgoValue((val) => !val)}
                      type="checkbox"
                      className="input_checkbox"
                      disabled={
                        shortestRouteCheck ||
                        optimalRouteCheck ||
                        safestRouteCheck
                      }
                    />
                    <span
                      style={{
                        backgroundColor: "#ffaa00",
                        width: "35px",
                        height: "13px",
                        display: "inline-block",
                        marginRight: "4px",
                      }}
                    ></span>
                    <span className="span_checkbox">Custom Path</span>
                  </div>
                  <div style={{ marginTop: "40px" }}>
                    <Button
                      onClick={handleSubmit}
                      className="btn-fill mt-3"
                      variant="primary"
                      size="md"
                      disabled={!isValid}
                    >
                      Submit
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default RouteRecommender;
