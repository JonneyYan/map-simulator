import React, { useState } from "react";
import TableInput from "./Table";
import Map from "./Map";
import { Button, Select } from "antd";

function App() {
  const [probability, setProbability] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [showLabel, setShowLabel] = useState(false);
  const [coord, setCoord] = useState({});

  return (
    <div style={{ margin: "20px" }}>
      <h1 className="title">Map Simulator</h1>
      <div className="table-modal">
        <Button onClick={() => setShowLabel(!showLabel)} style={{ marginRight: "10px" }} type="primary">
          显示/隐藏地形标签
        </Button>
        <hr style={{ margin: "20px" }} />
        <TableInput
          onSubmit={(coord, d, rowCount) => {
            setCoord(coord);
            setProbability(d);
            setRowCount(rowCount);
          }}
        />
      </div>
      {probability && <Map coord={coord} probability={probability} mapSize={rowCount} showLabel={showLabel} />}
    </div>
  );
}

export default App;
