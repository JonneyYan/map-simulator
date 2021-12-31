import React, { useState } from "react";
import TableInput from "./Table";
import Map from "./Map";
import { Button, Select } from "antd";

function App() {
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [showLabel, setShowLabel] = useState(true);
  return (
    <div style={{ margin: "20px" }}>
      <h1 className="title">Map Simulator</h1>
      <div className="table-modal">
        <Button onClick={() => setShowLabel(!showLabel)} style={{ marginRight: "10px" }} type="primary">
          显示地形标签
        </Button>
        <hr style={{ margin: "20px" }} />
        <TableInput
          onSubmit={(d, rowCount) => {
            setData(d);
            setRowCount(rowCount);
          }}
        />
      </div>
      <Map data={data} showLabel={showLabel} rowCount={rowCount} />
    </div>
  );
}

export default App;
