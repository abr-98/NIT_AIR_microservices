import React from "react";
// react-bootstrap components
import { Container, Row, Col } from "react-bootstrap";
import HeatMapPlot from "./Maps/HeatMapPlot";

function Dashboard() {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <HeatMapPlot />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Dashboard;
