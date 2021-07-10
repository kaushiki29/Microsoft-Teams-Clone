import React from 'react';
import Routes from '../src/routes'
import { BrowserRouter } from "react-router-dom";


function App() {
  return (
    <div style={{ height: "100%", backgroundColor: "#f5f5f5" }}>
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;
