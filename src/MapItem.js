import React, { useState } from "react";
import styled from "styled-components";
import { Tooltip } from "antd";

const HexagonWrapper = styled.div`
  width: 100px;
  height: 100px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
  }

  .hex {
    width: 100px;
    height: 39px;
    background: #d9d9d9;
    position: absolute;
    margin: 0 1px;
    top: 40px;

    &:before {
      content: "";
      position: absolute;
      top: -20px;
      left: 0;
      width: 0;
      height: 0;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-bottom: 20px solid ${(props) => props.color || "palevioletred"};
    }
    &:after {
      content: "";
      position: absolute;
      bottom: -20px;
      left: 0;
      width: 0;
      height: 0;
      border-left: 50px solid transparent;
      border-right: 50px solid transparent;
      border-top: 20px solid ${(props) => props.color || "palevioletred"};
    }
  }
  &.blank:hover {
    opacity: 0.4;
    cursor: pointer;
  }
`;
const Row = styled.div`
  width: 200000000px;
  margin-top: -40px;
  display: flex;
  &:nth-child(2n) {
    margin-left: 50px;
  }
`;
const Hexagon = React.memo(({ item, showLabel, ...props }) => {
  return (
    <HexagonWrapper color="#d1d1d1" {...props}>
      <img src={process.env.PUBLIC_URL + `/images/${item.type}-${item.subType}.png`} alt="tier" />
    </HexagonWrapper>
  );
});

const HexagonBlank = React.memo(({ item, showLabel, ...props }) => {
  return (
    <HexagonWrapper color={"#d9d9d9"} {...props} className="blank">
      <div className="hex"></div>
    </HexagonWrapper>
  );
});

function MapItem({ hexagonMap, showLabel, selected, onExplore }) {
  if (!hexagonMap) {
    return null;
  }

  const handleExplore = (item) => () => {
    onExplore(item);
  };
  return (
    <div>
      {hexagonMap?.map((row, x) => {
        return (
          <Row key={x}>
            {row.map((item) => {
              return (
                <Tooltip title={`[${item.vector[0]},${item.vector[1]}]`}>
                  {item.type === 0 || !selected.includes(item.type) ? (
                    <HexagonBlank key={`${item.vector[0]}-${item.vector[1]}`} item={item} showLabel={showLabel} onClick={handleExplore(item)} />
                  ) : (
                    <Hexagon key={`${item.vector[0]}-${item.vector[1]}`} item={item} showLabel={showLabel} />
                  )}
                </Tooltip>
              );
            })}
          </Row>
        );
      })}
    </div>
  );
}
export default React.memo(MapItem);
