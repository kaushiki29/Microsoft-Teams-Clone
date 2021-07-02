import React from 'react';
import Login from './components/Login'
import {BrowserRouter} from "react-router-dom";
function App() {
  return (
    <div style={{ height: "100%", backgroundColor: "#f5f5f5" }}>
      <BrowserRouter>
      <Login />
      </BrowserRouter>
    </div>
  );
}

export default App;
