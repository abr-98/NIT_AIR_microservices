import React from "react";
import GroupedBarChart from "./GroupedBarChart/GroupedBarChart";
import PieChart from "./PieChart/PieChart";
import { Card, Container, Row, Col } from "react-bootstrap";

const AnalyticsCard = () => {
  return (
    <Card style={{ paddingBottom: "20px" }}>
      <Card.Header>
        <Card.Title as="h4">Analytics</Card.Title>
        <p className="card-category">
          Air Quality Index Analysis over the area of interest
        </p>
      </Card.Header>
      <Card.Body>
        <Container>
          <Row>
            <Col md="9">
              <GroupedBarChart />
            </Col>
            <Col md="3">
              <PieChart />
            </Col>
          </Row>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default AnalyticsCard;
