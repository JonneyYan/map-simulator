import React, { useState, useMemo, useEffect } from "react";
import { Button, Select } from "antd";
import { times } from "lodash";
import styled from "styled-components";
import Chart from "./charts";

const Hexagon = styled.div`
  width: 100px;
  height: 55px;
  background: ${(props) => props.color || "palevioletred"};
  position: relative;
  margin: 0 5px;

  &:before {
    content: "";
    position: absolute;
    top: -25px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 25px solid ${(props) => props.color || "palevioletred"};
  }
  &:after {
    content: "";
    position: absolute;
    bottom: -25px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 25px solid ${(props) => props.color || "palevioletred"};
  }
`;

const Row = styled.div`
  width: 200000000px;
  margin: 35px 0;
  display: flex;
  &:nth-child(2n) {
    margin-left: 50px;
  }
`;

export default function Map({ data, showLabel, rowCount }) {
  const [hexagonMap, statics] = useMemo(() => {
    const statics = {};
    if (data.length === 0) {
      return [];
    }
    const res = [];
    const type = data[0].slice(1, 9);

    function getType(x, y) {
      let probability = [];
      let total = 100;
      if (x === 0 && y === 0) {
        probability = data[1].slice(1, 9);
      } else {
        const neighbor1 = y > 0 && res[x][y - 1]?.index;
        const neighbor2 = x > 0 && res[x - 1][y]?.index;
        const neighbor3 = x > 0 && res[x - 1][y + 1]?.index;

        total = 0;
        for (let index = 1; index < data[1].length - 1; index++) {
          const v1 = neighbor1 ? data[neighbor1][index].value : 0;
          const v2 = neighbor2 ? data[neighbor2][index].value : 0;
          const v3 = neighbor3 ? data[neighbor3][index].value : 0;
          const value = v1 + v2 + v3;
          total += value;
          probability.push({ value });
        }
      }

      const random = Math.ceil(Math.random() * total);

      let sum = 0;
      for (let index = 0; index < probability.length; index++) {
        const p = probability[index];
        sum += p.value;
        if (sum >= random) {
          return type[index];
        }
      }
    }

    times(rowCount).forEach((x) => {
      res[x] = [];
      times(rowCount).forEach((y) => {
        const item = {
          vector: [x, y],
          ...getType(x, y),
        };
        statics[item.value] = {
          color: item.color,
          value: statics[item.value]?.value ? statics[item.value].value + 1 : 1,
        };
        res[x][y] = item;
      });
    });

    return [res, statics];
  }, [data, rowCount]);
  console.log("🚀 ~ file: Map.js ~ line 96 ~ times ~ statics", statics);
  return (
    <div className="map">
      <div className="statics">
        <Chart statics={statics} />
      </div>
      {hexagonMap?.map((row, x) => {
        return (
          <Row key={x}>
            {row.map((item) => (
              <Hexagon key={`${item.vector[0]}-${item.vector[1]}`} color={item.color}>
                {showLabel && (
                  <>
                    <div className="map-label">{item.value}</div>
                    <div className="map-label">
                      [{item.vector[0]}, {item.vector[1]}]
                    </div>
                  </>
                )}
              </Hexagon>
            ))}
          </Row>
        );
      })}
    </div>
  );
}
