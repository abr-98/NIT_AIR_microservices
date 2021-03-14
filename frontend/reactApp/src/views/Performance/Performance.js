import React from "react";
import { Card } from "react-bootstrap";
import ErrorBarChart from "../Dashboard/ErrorBarChart/ErrorBarChart";

const Performance = () => {
  return (
    <div style={{ width: "70%", height: "70%" }}>
      <Card>
        <Card.Header>
          <Card.Title as="h4">Accuracy Over Time Zone</Card.Title>
          <p className="card-category">24hrs performance</p>
        </Card.Header>
        <Card.Body>
          <ErrorBarChart />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Performance;
