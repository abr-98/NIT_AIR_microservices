import React, { useState, useEffect } from "react";
import { Table, Spinner } from "react-bootstrap";

import AQILegendItem from "./AQILegendItem";
import AQIcolors from "../../../constants/AQIcolors";

import { DashboardHeatmapContext } from "./HeatMapPlot";

import { predTableData } from "../../../utils/networkUtil";

const GridDataTable = (props) => {
  const [isLoading, setLoading] = useState(true);

  const [gridData, setGridData] = useState(null);

  const { dateTime } = React.useContext(DashboardHeatmapContext);

  useEffect(() => {
    if (isLoading) {
      predTableData(props.gridId, dateTime)
        .then(
          (data) => {
            setGridData(data);
            setLoading(false);
          },
          (error) => {
            setLoading(false);
            alert(error);
          }
        )
        .catch((error) => alert(error));
    }
  }, [isLoading]);

  return isLoading ? (
    <Spinner size="md" animation="border" />
  ) : (
    gridData && (
      <Table bordered>
        <thead>
          <tr>
            <th>#{props.gridId}</th>
            {AQIcolors.map((aqiClass, index) => (
              <th>
                <AQILegendItem
                  key={`MapLegend${index}`}
                  title={""}
                  color={aqiClass.color}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Day Wise</td>
            {gridData["daily"].map((data, idx) => (
              <td key={"DayData" + idx}>{data}%</td>
            ))}
          </tr>
          <tr>
            <td>Week Wise</td>
            {gridData["weekly"].map((data, idx) => (
              <td key={"WeekData" + idx}>{data}%</td>
            ))}
          </tr>
          <tr>
            <td>Month Wise</td>
            {gridData["monthly"].map((data, idx) => (
              <td key={"MonthData" + idx}>{data}%</td>
            ))}
          </tr>
        </tbody>
      </Table>
    )
  );
};

export default GridDataTable;
