import React from "react";
import DynamicForm from "./components/DynamicForm";

const API_URL =
  "https://v2-dev-api.esigns.io/v1.0/templates-v2/687893c84c8b5bf090eacc09?company_id=678a07e588cd760d7bd74a6c";

function App() {
  return (
    <div className="App">
      <h2>Dynamic Form Generator</h2>
      <DynamicForm apiUrl={API_URL} />
    </div>
  );
}

export default App;
