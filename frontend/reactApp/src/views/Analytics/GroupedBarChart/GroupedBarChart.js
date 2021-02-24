import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import * as Zoom from "chartjs-plugin-zoom";
import colors from "constants/AQIcolors";
import { Card, Spinner } from "react-bootstrap";
import formatDate from "utils/formatDate";
import "./GroupedBarChart.css";
import BarChartDropdown from "./BarChartDropdown/BarChartDropdown";
import { AQICountWeekly } from "utils/networkUtil";

const options = {
  responsive: true,
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: "AQI Count",
          fontSize: 16,
        },
      },
    ],
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Days",
          fontSize: 16,
        },
      },
    ],
  },
  pan: {
    enabled: true,
    mode: "x",
    speed: 1,
    threshold: 1,
  },
  zoom: {
    enabled: true,
    mode: "x",
    speed: 1,
    rangeMin: {
      x: 2,
      y: 0,
    },
    rangeMax: {
      x: 50,
      y: 100,
    },
  },
};

const GroupedBarChart = () => {
  const [barData, setBarData] = useState(null);
  const [date, setdate] = useState(formatDate(new Date()));
  const [gridValue, setgridValue] = useState("All");

  const handleDateChange = (e) => {
    if (Date.parse(e.target.value) > new Date()) {
      alert("Choosen Date cannot be in future.");
    } else {
      setdate(e.target.value);
    }
  };

  useEffect(() => {
    const apiData = async () => {
      const grid = gridValue === "All" ? "all" : gridValue;
      const reponse = await AQICountWeekly(date, grid);
      const data = {
        labels: reponse.days,
        datasets: [
          {
            label: colors[0].title,
            data: reponse.AQI1,
            backgroundColor: colors[0].color,
          },
          {
            label: colors[1].title,
            data: reponse.AQI2,
            backgroundColor: colors[1].color,
          },
          {
            label: colors[2].title,
            data: reponse.AQI3,
            backgroundColor: colors[2].color,
          },
          {
            label: colors[3].title,
            data: reponse.AQI4,
            backgroundColor: colors[3].color,
          },
          {
            label: colors[4].title,
            data: reponse.AQI5,
            backgroundColor: colors[4].color,
          },
        ],
      };
      setBarData(data);
    };
    apiData();
  }, [date, gridValue]);

  if (!barData) {
    return <Spinner size="md" animation="border" />;
  }

  return (
    <Card style={{ height: "100%" }}>
      <Card.Header>
        <div className="root_div">
          <div className="card_headers">
            <Card.Title as="h4">7 Day Air Quality Index</Card.Title>
            <span className="card-category">Last 7 days performance</span>
          </div>
          <div className="date_input">
            <label htmlFor="date-input">Date</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              name="date-input"
            />
          </div>
          <div className="grid_select_dropdown">
            <label className="grid_select_dropdown_label" htmlFor="grid-select">
              Select Grid
            </label>
            {barData && (
              <BarChartDropdown
                value={gridValue}
                onChangeGridValue={setgridValue}
              />
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div style={{ margin: "30px" }}>
          <Bar data={barData} options={options} />
        </div>
      </Card.Body>
    </Card>
  );
};

export default GroupedBarChart;
