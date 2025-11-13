"use client";
import { useState } from "react";

export default function Home() {
  const [modules, setModules] = useState([]);

  const loadModules = async () => {
    try {
      const res = await fetch("/api/modules/list");
      const data = await res.json();
      setModules(data.modules || []);
    } catch (err) {
      console.error("Error loading modules:", err);
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        background: "#fffbe6",
        color: "#222",
        minHeight: "100vh",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#f4b400" }}>🌍 FullTask Global AI Platform</h1>

      <p>
        Created by <b>Akin S. Sokpah from Nimba County, Liberia</b>
      </p>

      <button
        onClick={loadModules}
        style={{
          background: "#f4b400",
          border: "none",
          padding: "10px 20px",
          borderRadius: "6px",
          cursor: "pointer",
          color: "#fff",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Load Features
      </button>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {modules.map((m, i) => (
          <div
            key={i}
            style={{
              background: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              borderRadius: "8px",
              margin: "10px",
              padding: "10px",
              width: "200px",
            }}
          >
            <h4>{m.name}</h4>
            <p>{m.description}</p>
            <p>Status: {m.enabled ? "✅" : "❌"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
