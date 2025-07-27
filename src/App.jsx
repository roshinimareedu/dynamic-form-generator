import React, { useState } from "react";
import DynamicForm from "./DynamicForm";

function App() {
  const [apiUrl, setApiUrl] = useState(
    "https://v2-dev-api.esigns.io/v1.0/templates-v2/687893c84c8b5bf090eacc09?company_id=678a07e588cd760d7bd74a6c"
  );

  return (
    <div>
      <h2>Dynamic Form Generator</h2>
      <DynamicForm apiUrl={apiUrl} />
    </div>
  );
}

export default App;

