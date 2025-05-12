import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import HeatMap from "react-heatmap-grid";

const CorrelationHeatmap = () => {
  const [stocks, setStocks] = useState([]);
  const [correlationData, setCorrelationData] = useState([]);
  
  useEffect(() => {
    fetch("http://20.244.56.144/evaluation-service/stocks")
      .then((response) => response.json())
      .then((data) => setStocks(Object.entries(data.stocks)));
  }, []);
  
  const fetchCorrelationData = async (tickers) => {
    const data = {};
    for (let ticker of tickers) {
      const response = await fetch(`http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=50`);
      const priceData = await response.json();
      data[ticker] = priceData.map(point => point.price);
    }
    setCorrelationData(data);
  };

  const calculateCorrelation = () => {
    const tickers = Object.keys(correlationData);
    const matrix = [];
    for (let i = 0; i < tickers.length; i++) {
      matrix[i] = [];
      for (let j = 0; j < tickers.length; j++) {
        const corr = calculatePearsonCorrelation(correlationData[tickers[i]], correlationData[tickers[j]]);
        matrix[i][j] = corr;
      }
    }
    return matrix;
  };

  const calculatePearsonCorrelation = (X, Y) => {
    const meanX = X.reduce((a, b) => a + b) / X.length;
    const meanY = Y.reduce((a, b) => a + b) / Y.length;
    let covariance = 0;
    let stdDevX = 0;
    let stdDevY = 0;
    for (let i = 0; i < X.length; i++) {
      covariance += (X[i] - meanX) * (Y[i] - meanY);
      stdDevX += (X[i] - meanX) ** 2;
      stdDevY += (Y[i] - meanY) ** 2;
    }
    return covariance / Math.sqrt(stdDevX * stdDevY);
  };

  useEffect(() => {
    if (stocks.length) {
      fetchCorrelationData(stocks.map(([_, ticker]) => ticker));
    }
  }, [stocks]);

  const heatmapData = calculateCorrelation();

  return (
    <div>
      <Typography variant="h4" gutterBottom>Correlation Heatmap</Typography>
      <HeatMap
        xLabels={stocks.map(([name]) => name)}
        yLabels={stocks.map(([name]) => name)}
        data={heatmapData}
        square={true}
        cellStyle={(x, y, ratio) => ({
          background: `rgba(0, 128, 0, ${ratio})`,
          border: "1px solid #ddd",
        })}
      />
    </div>
  );
};

export default CorrelationHeatmap;
