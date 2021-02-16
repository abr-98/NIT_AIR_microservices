import { grids } from "constants/grids";
import React from "react";
import { Dropdown, Nav } from "react-bootstrap";

const BarChartDropdown = ({ value, onChangeGridValue }) => {
  const handleGridChange = (e, gridSerial) => {
    e.preventDefault();
    onChangeGridValue(gridSerial);
  };

  return (
    <Dropdown as={Nav.Item}>
      <Dropdown.Toggle
        style={{ color: "#202429" }}
        aria-expanded={false}
        aria-haspopup={true}
        as={Nav.Link}
        data-toggle="dropdown"
        id="navbarDropdownMenuLink"
        variant="default"
        className="m-0"
      >
        <span className="no-icon">
          {value === "All" ? "All" : `Grid ${value}`}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
        {grids.map((grid, index) => (
          <div key={index} style={{ display: "flex" }}>
            <Dropdown.Item
              href="#pablo"
              onClick={(e) => handleGridChange(e, grid[0].serial)}
            >
              {grid[0].title}
            </Dropdown.Item>
            {grid[1] && (
              <Dropdown.Item
                href="#pablo"
                onClick={(e) => handleGridChange(e, grid[1].serial)}
              >
                {grid[1].title}
              </Dropdown.Item>
            )}
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default BarChartDropdown;
