import React from "react";
import ChartistGraph from "react-chartist";
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import HeatMapPlot from "./Maps/HeatMapPlot";
import AnalyticsCard from "../Analytics/AnalyticsCard";

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
