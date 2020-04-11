import React from "react";

export default function Clearfix({ children }) {
  return (
    <div style={{ content: "", display: "table", clear: "both" }}>
      {children}
    </div>
  );
}
