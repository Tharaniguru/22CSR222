import React, { useState, useEffect } from "react";
import { Grid, Typography, Select, MenuItem } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [timeInterval, setTimeInterval] = useState(30);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    fetch("http://20.244.56.144/evaluation-service/stocks")
      .then((response) => response.json())
      .then((data) => setStocks(Object.entries(data.stocks)));
  }, []);

  useEffect(() => {
    fetch(`http://20.244.56.144/evaluation-service/stocks/${selectedStock}?minutes=${timeInterval}`)
      .then((response) => response.json())
      .then((data) => setStockData(data));
  }, [selectedStock, timeInterval]);

  const handleStockChange = (event) => setSelectedStock(event.target.value);
  const handleIntervalChange = (event) => setTimeInterval(event.target.value);

  const chartData = stockData.map((point, index) => ({
    time: new Date(point.lastUpdatedAt).toLocaleTimeString(),
    price: point.price,
  }));

  return (
    <div>
      <Typography variant="h4" gutterBottom>Stock Price Chart</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Select value={selectedStock} onChange={handleStockChange} fullWidth>
            {stocks.map(([name, ticker]) => (
              <MenuItem key={ticker} value={ticker}>
                {name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={6}>
          <Select value={timeInterval} onChange={handleIntervalChange} fullWidth>
            {[30, 60, 90, 120].map((interval) => (
              <MenuItem key={interval} value={interval}>
                Last {interval} minutes
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockPage;
