import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import MapComponent from "./MapComponent";
import MapLegendCard from "./MapLegendCard";
import POIListCard from "./POIListCard";

import poiData from "../../../constants/POIData";
import buildGrid from "../../../constants/GridBuilder";
import styles from "../../../styles/DashboardHeatMapPlotStyles";

import { predByDateHour } from "../../../utils/networkUtil";

const DashboardHeatmapContext = React.createContext();

// Get Current Date Time for first load.
function getCurrentDateTime() {
  let currentDateTime = new Date();
  return (
    currentDateTime.getFullYear() +
    "-" +
    (currentDateTime.getMonth() + 1 < 10 ? "0" : "") +
    (currentDateTime.getMonth() + 1) +
    "-" +
    (currentDateTime.getDate() < 10 ? "0" : "") +
    currentDateTime.getDate() +
    "T" +
    (currentDateTime.getHours() < 10 ? "0" : "") +
    currentDateTime.getHours() +
    ":" +
    (currentDateTime.getMinutes() < 10 ? "0" : "") +
    currentDateTime.getMinutes()
  );
  // Format: 2021-02-02T00:21
}

const HeatMapPlot = () => {
  const [isLoading, setLoading] = useState(true);
  const [gridData, setGridData] = useState(null);
  const [dateTime, setDateTime] = useState(getCurrentDateTime());
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    if (isLoading) {
      predByDateHour(dateTime)
        .then(
          (predictionData) => {
            setPredictionData(predictionData);
            setGridData(buildGrid());
            setLoading(false);
            document.getElementById("datetime").value = dateTime;
          },
          (error) => {
            alert(error);
            setLoading(false);
          }
        )
        .catch((error) => alert(error));
    }
  }, [isLoading]);

  const handleClick = () => {
    const inputData = document.getElementById("datetime").value;
    if (Date.parse(inputData) > new Date()) {
      alert("Choosen Date Time cannot be in future.");
    } else {
      setDateTime(inputData);
      setLoading(true);
    }
  };

  return (
    <Card style={{ paddingBottom: "20px" }}>
      <Card.Header>
        <Card.Title as="h4">Hourly Air Quality Prediction</Card.Title>
        <p className="card-category">24 hrs performance</p>
      </Card.Header>
      <Card.Body>
        <Container>
          <Row>
            <Col>
              {gridData && predictionData ? (
                <DashboardHeatmapContext.Provider
                  value={{ gridData, poiData, dateTime, predictionData }}
                >
                  <MapComponent
                    center={{
                      lat: 23.550399503999397,
                      lng: 87.2954336733082,
                    }}
                  />
                </DashboardHeatmapContext.Provider>
              ) : (
                "Loading Map..."
              )}
            </Col>
          </Row>
          <Row style={{ width: "90%", margin: "auto" }}>
            <Col>
              <MapLegendCard />
            </Col>
            <Col>
              <Row>
                <label style={styles.fullWidthStyle} htmlFor="datetime">
                  Date & Time
                </label>
                <input
                  style={styles.fullWidthStyle}
                  type="datetime-local"
                  id="datetime"
                  name="datetime"
                />
                <Button
                  style={{
                    ...styles.dateSubmitButtonStyle,
                    backgroundColor: "#42a4f5",
                    color: "white",
                  }}
                  variant="primary"
                  disabled={isLoading}
                  onClick={!isLoading ? handleClick : null}
                >
                  {isLoading ? "Loading…" : "Submit"}
                </Button>
              </Row>
            </Col>
          </Row>

          <Row>
            {predictionData && poiData && (
              <DashboardHeatmapContext.Provider
                value={{ predictionData, poiData }}
              >
                <POIListCard />
              </DashboardHeatmapContext.Provider>
            )}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default HeatMapPlot;
export { DashboardHeatmapContext as DashboardHeatmapContext };
