import React from "react";
import { Card } from "react-bootstrap";

import getInfoBuilder from "../../../constants/POIInfoViewBuilder";
import styles from "../../../styles/DashboardHeatMapPlotStyles";
import AQILegendItem from "./AQILegendItem";
import AQIcolors from "../../../constants/AQIcolors";
import { DashboardHeatmapContext } from "./HeatMapPlot";

const AQIClassToAQIColor = (aqiClassNumber) => {
  const mapper = {
    1: AQIcolors[0],
    2: AQIcolors[1],
    3: AQIcolors[2],
    4: AQIcolors[3],
    5: AQIcolors[4],
  };
  return mapper[aqiClassNumber];
};

const POICard = (props) => {
  const predictionData = React.useContext(DashboardHeatmapContext)
    .predictionData;

  return (
    <Card
      style={{
        ...props.style,
        margin: "10px",
        height: "380px",
        float: "left",
      }}
    >
      <img
        src={props.poi.image_url}
        style={{ padding: "5px" }}
        height={"250px"}
        width={"100%"}
      />
      <Card.Header>
        <Card.Title style={styles.boldFont}>{props.poi.name}</Card.Title>
        <p className="card-category">{props.poi.poi_type}</p>
      </Card.Header>
      <Card.Body>
        <div>
          <div style={{ ...styles.fullWidthStyle, display: "inline-block" }}>
            AQI:
            {predictionData[props.poi.grid_id] ? (
              <AQILegendItem
                key={`POIAQI${props.poi.name}`}
                title={
                  AQIClassToAQIColor(predictionData[props.poi.grid_id]).title
                }
                color={
                  AQIClassToAQIColor(predictionData[props.poi.grid_id]).color
                }
                titleFirst={true}
              />
            ) : (
              " NA"
            )}
          </div>
          {getInfoBuilder(props.poi.poi_type)(props.poi)}
        </div>
      </Card.Body>
    </Card>
  );
};

export default POICard;
