import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import * as Zoom from "chartjs-plugin-zoom";
// import { colors } from "views/Analytics/GroupedBarChart/node_modules/constants/AQIcolors";
import "chartjs-plugin-error-bars";

const data = {
  labels: ["Early Morning", "Morning", "Afternoon", "Evening"],
  datasets: [
    {
      label: "Accuracy",
      data: [50, 70, 100, 130],
      backgroundColor: "#bdeff9",
      borderColor: "#1cc7ea",
      borderWidth: 2,
      errorBars: {
        "Early Morning": { plus: 20, minus: -30 },
        Morning: { plus: 20, minus: -30 },
        Afternoon: { plus: 20, minus: -30 },
        Evening: { plus: 20, minus: -30 },
      },
    },
  ],
};

const options = {
  responsive: true,
  //   title: {
  //     display: true,
  //     text: "Prediction Data",
  //     fontSize: 27,
  //   },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
        scaleLabel: {
          display: true,
          labelString: "Accuracy Count",
          fontSize: 16,
        },
      },
    ],
    xAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: "Time Zone",
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
  plugins: {
    chartJsPluginErrorBars: {
      width: "60%",
      color: "#1cc7ea",
    },
  },
};

const ErrorBarChart = () => {
  const [barData] = useState(data);
  return (
    <div style={{ margin: "20px" }}>
      <Bar data={barData} options={options} />
    </div>
  );
};

export default ErrorBarChart;
