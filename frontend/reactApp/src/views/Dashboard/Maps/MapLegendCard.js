import { Container, Row, Col, Card } from "react-bootstrap";
import AQILegendItem from "./AQILegendItem";
import styles from "../../../styles/DashboardHeatMapPlotStyles";
import AQIcolors from "../../../constants/AQIcolors";

const MapLegendCard = () => {
  return (
    <Card style={styles.fullWidthStyle}>
      <Card.Header>Pollution Levels</Card.Header>
      <Card.Body>
        <Container>
          <Row style={{ display: "flex", justifyContent: "flex-start" }}>
            {AQIcolors.map((aqiClass, index) => (
              <div key={`MapLegendDiv${index}`} style={{ fontSize: "0.9em" }}>
                <AQILegendItem
                  key={`MapLegend${index}`}
                  title={aqiClass.title}
                  color={aqiClass.color}
                  titleFirst={false}
                />
              </div>
            ))}
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default MapLegendCard;
