import React, { useState, useMemo, useEffect } from "react";
import { Button, InputNumber, Select, Space } from "antd";
import ReactDataSheet from "react-datasheet";
import { clear } from "@testing-library/user-event/dist/clear";
// Be sure to include styles at some point, probably during your bootstrapping
const { Option } = Select;

const INIT = [
  [
    { readOnly: true, value: "" },
    { value: "平原", readOnly: true, color: "red", index: 1 },
    { value: "山丘", readOnly: true, color: "olive", index: 2 },
    { value: "沙漠", readOnly: true, color: "gold", index: 3 },
    { value: "湖泊", readOnly: true, color: "blue", index: 4 },
    { value: "草原", readOnly: true, color: "lime", index: 5 },
    { value: "林地", readOnly: true, color: "darkgreen", index: 6 },
    { value: "雪地", readOnly: true, color: "navy", index: 7 },
    { value: "冰川", readOnly: true, color: "purple", index: 8 },
    { value: "概率合计", readOnly: true },
  ],
  [{ readOnly: true, value: "平原", color: "red" }, { value: 50 }, { value: 10 }, { value: 10 }, { value: 15 }, { value: 5 }, { value: 5 }, { value: 3 }, { value: 2 }, { readOnly: true, value: 0 }],
  [{ readOnly: true, value: "山丘", color: "olive" }, { value: 20 }, { value: 40 }, { value: 5 }, { value: 10 }, { value: 5 }, { value: 10 }, { value: 5 }, { value: 5 }, { readOnly: true, value: 0 }],
  [{ readOnly: true, value: "沙漠", color: "gold" }, { value: 20 }, { value: 10 }, { value: 40 }, { value: 10 }, { value: 10 }, { value: 10 }, { value: 0 }, { value: 0 }, { readOnly: true, value: 0 }],
  [{ readOnly: true, value: "湖泊", color: "blue" }, { value: 15 }, { value: 10 }, { value: 10 }, { value: 50 }, { value: 5 }, { value: 5 }, { value: 0 }, { value: 5 }, { readOnly: true, value: 0 }],
  [{ readOnly: true, value: "草原", color: "green" }, { value: 20 }, { value: 10 }, { value: 10 }, { value: 10 }, { value: 40 }, { value: 10 }, { value: 0 }, { value: 0 }, { readOnly: true, value: 0 }],
  [{ readOnly: true, value: "林地", color: "darkgreen" }, { value: 20 }, { value: 10 }, { value: 10 }, { value: 5 }, { value: 10 }, { value: 40 }, { value: 4 }, { value: 1 }, { readOnly: true, value: 0 }],
  [{ readOnly: true, value: "雪地", color: "navy" }, { value: 20 }, { value: 5 }, { value: 0 }, { value: 5 }, { value: 5 }, { value: 5 }, { value: 40 }, { value: 20 }, { readOnly: true, value: 0 }],
  [{ readOnly: true, value: "冰川", color: "purple" }, { value: 20 }, { value: 15 }, { value: 0 }, { value: 15 }, { value: 0 }, { value: 5 }, { value: 20 }, { value: 25 }, { readOnly: true, value: 0 }],
];
export default function TableInput({ onSubmit }) {
  let initialGrid = INIT;

  const [grid, setGrid] = useState(initialGrid);
  const [count, setCount] = useState(10);
  const [records, setRecords] = useState([]);
  const [num, setNum] = useState(localStorage.length);
  const [expend, setExpend] = useState(false);

  useEffect(() => {
    if (num > 0) {
      const res = [];
      console.log("🚀 ~ file: Table.js ~ line 41 ~ useEffect ~ localStorage.length", localStorage.length);
      for (let index = 0; index < localStorage.length; index++) {
        const key = localStorage.key(index);
        res.push({ name: key, value: JSON.parse(localStorage.getItem(key)) });
      }

      setRecords(res);
    }
  }, [num]);

  const gridComputed = useMemo(() => {
    return grid.map((row, index) => {
      if (index === 0) {
        return row;
      }
      return row.map((col, j) => {
        if (j !== row.length - 1) {
          return col;
        } else {
          let total;
          try {
            total = row.slice(1, row.length - 1).reduce((s, c) => s + +c.value, 0);
          } catch (error) {
            total = "error";
          }
          return { ...col, value: total };
        }
      });
    });
  }, [grid]);

  function save(grid) {
    localStorage.setItem(new Date().toLocaleString(), JSON.stringify(grid));
    setNum(num + 1);
  }
  function load(v) {
    changeGrid(records[v].value);
  }

  function changeGrid(g) {
    setGrid(g);
  }
  function submit() {
    onSubmit(grid, count);
  }

  function clear() {
    localStorage.clear();
    setNum(0);
    setRecords([]);
  }
  return (
    <div>
      <h1>
        参数调试
        {/* <Button onClick={() => setExpend(!expend)}>收起/折叠</Button> */}
      </h1>
      {!expend && (
        <>
          <Space>
            <Button onClick={() => changeGrid(INIT)} danger type="primary">
              重置表格
            </Button>
            <Button onClick={() => clear()} danger type="primary">
              清空本地
            </Button>
            <Button onClick={() => save(grid)} type="primary">
              保存到本地
            </Button>
            <Button onClick={submit} type="primary">
              生成地图
            </Button>
          </Space>
          <div style={{ marginBottom: "10px" }}>
            <h3>本地保存记录：{num} 条, 下方选择框可切换本地保存的数据</h3>
            <Select style={{ width: 300 }} onChange={(v) => load(v)}>
              {records?.map((r, index) => (
                <Option key={r.name} value={index}>
                  {r.name}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: "10px" }}>
            行数： <InputNumber value={count} onChange={setCount} />
          </div>
          <div style={{ width: "800px" }}>
            <ReactDataSheet
              data={gridComputed}
              valueRenderer={(cell) => cell.value}
              valueViewer={({ cell }) => {
                return <span style={{ color: cell.color }}>{cell.value}</span>;
              }}
              onCellsChanged={(changes) => {
                const newGrid = grid.map((row) => [...row]);
                changes.forEach(({ cell, row, col, value }) => {
                  newGrid[row][col] = { ...newGrid[row][col], value };
                });
                changeGrid(newGrid);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
