import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UnderDevelopment from "./pages/UnderDevelopment";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UnderDevelopment />} />
      </Routes>
    </Router>
  );
}

export default App;
