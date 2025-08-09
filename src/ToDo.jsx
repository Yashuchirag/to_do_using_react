import React from "react";
import TableOfContents from "./components/TableOfContents";

export default function TodoPage({ user, onLogout }) {
  return (
    <div>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Welcome, {user.username}</h3>
        <button onClick={onLogout}>Logout</button>
      </header>
      <TableOfContents />
    </div>
  );
}
