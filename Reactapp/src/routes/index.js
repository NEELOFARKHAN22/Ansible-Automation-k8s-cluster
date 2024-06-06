import * as React from "react";
import { Routes, Route } from "react-router-dom";
import { PublicRoute } from "./publicRoute";
import HomePage from "../container/HomaPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default App;
