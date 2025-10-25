import React from "react";

const TestApp = () => {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Pehenava Frontend Test</h1>
      <p>If you can see this, the React app is working!</p>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => alert("Button clicked!")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#8B1538",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Test Button
        </button>
      </div>
    </div>
  );
};

export default TestApp;
