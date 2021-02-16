import React from "react";
import { FixedSizeList } from "react-window";
import ListItem from "@material-ui/core/ListItem";
import { Card, Dropdown, Container, Row, Col } from "react-bootstrap";

import POICard from "./POICard";
import styles from "../../../styles/DashboardHeatMapPlotStyles";
import { DashboardHeatmapContext } from "./HeatMapPlot";

const POIListCard = () => {
  const { predictionData, poiData } = React.useContext(DashboardHeatmapContext);
  const [selectedPois, setSelectedPois] = React.useState("All");
  const [sortBy, setSortBy] = React.useState("AQI");
  const [filteredArray, setFilteredArray] = React.useState(poiData);

  const aqiSortFunction = (poiA, poiB) => {
    return predictionData[poiA.grid_id] - predictionData[poiB.grid_id];
  };

  const ratingSortFunction = (poiA, poiB) => {
    return poiB.rating - poiA.rating;
  };

  const priceSortFunction = (poiA, poiB) => {
    return poiA.price - poiB.price;
  };

  const sortByFunctions = {
    AQI: aqiSortFunction,
    Price: priceSortFunction,
    Rating: ratingSortFunction,
  };

  const sortListData = (array, sortFunction) => {
    return [...array].sort(sortFunction);
  };

  const onSortByValueChange = (value) => {
    setSortBy(value);
  };

  const onSelectedPoiValueChange = (value) => {
    setSelectedPois(value);
  };

  React.useEffect(() => {
    let filterRes;
    if (selectedPois == "All") {
      filterRes = poiData;
    } else {
      filterRes = poiData.filter((obj) => {
        return obj.poi_type == selectedPois.toLowerCase();
      });
    }
    setFilteredArray(filterRes);
  }, [selectedPois]);

  React.useEffect(() => {
    let filterRes = sortListData(filteredArray, sortByFunctions[sortBy]);
    setFilteredArray(filterRes);
    console.log(filteredArray);
  }, [sortBy]);

  return (
    <Card style={{ width: "90%", margin: "auto" }}>
      <Card.Header>
        <Container>
          <Row>
            <Col>
              <h4>Point of Interersts</h4>
            </Col>
            <Row>
              <Col xs={6}>
                <label htmlFor="poi-dropdown">Select POI type</label>
              </Col>
              <Col>
                <Dropdown id="poi-dropdown" onSelect={onSelectedPoiValueChange}>
                  <Dropdown.Toggle>{selectedPois}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                    <Dropdown.Item eventKey="Hotel">Hotel</Dropdown.Item>
                    <Dropdown.Item eventKey="School">School</Dropdown.Item>
                    <Dropdown.Item eventKey="Park">Park</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col> </Col>
            </Row>
            <Row>
              <Col>
                <label htmlFor="sort-dropdown">Sort POI by</label>
              </Col>
              <Col>
                <Dropdown id="sort-dropdown" onSelect={onSortByValueChange}>
                  <Dropdown.Toggle>{sortBy}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="AQI">AQI</Dropdown.Item>
                    <Dropdown.Item eventKey="Price">Price</Dropdown.Item>
                    <Dropdown.Item eventKey="Rating">Rating</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        {predictionData && filteredArray.length !== 0 && (
          <div style={{ width: "100%" }}>
            {filteredArray.map((obj, idx) => (
              <POICard poi={obj} key={idx} />
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default POIListCard;
