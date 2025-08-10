import React, { useEffect, useState } from "react";
import "../css/TableContents.css";

export default function TableOfContents() {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({ name: "", status: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const fetchRows = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/tasks");
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setRows(data.rows || []);
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleAddRow = async (e) => {
    e.preventDefault();
    if (!newRow.name.trim() || !newRow.status.trim()) return;
    setError("");

    try {
      const res = await fetch("/.netlify/functions/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });
      const raw = await res.text();
      const data = raw ? JSON.parse(raw) : {};
      if (!res.ok) throw new Error(data.error || "Failed to add row");

      setRows((prev) => [...prev, data.row]);
      setNewRow({ name: "", status: "" });
    } catch (e) {
      console.error(e);
      setError(e.message || "Failed to add row");
    }
  };

  return (
    <div className="table-container">
      <h2>📋 Tasks Table</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <form onSubmit={handleAddRow} className="table-form">
            <input
              type="text"
              name="name"
              placeholder="Task name"
              value={newRow.name}
              onChange={handleChange}
            />
            <input
              type="text"
              name="status"
              placeholder="Status"
              value={newRow.status}
              onChange={handleChange}
            />
            <button type="submit">Add Row</button>
          </form>
        </>
      )}
    </div>
  );
}
