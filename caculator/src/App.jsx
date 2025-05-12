
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Container } from "@mui/material";
import StockPage from "./component/Stock/StockPage";
import CorrelationHeatmap from "./component/Corelationheatmap/Corelationheatmap";

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/correlation" element={<CorrelationHeatmap />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
