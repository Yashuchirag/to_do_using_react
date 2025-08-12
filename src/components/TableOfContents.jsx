import React, { useEffect, useState } from "react";
import "../css/TableOfContents.css";

export default function TableOfContents() {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({ title: "", content: "", status: "" });
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
    // backend requires title & status; content optional
    if (!newRow.title.trim() || !newRow.status.trim()) {
      setError("Title and status are required");
      return;
    }
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
      setNewRow({ title: "", content: "", status: "" });
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
                <th>Title</th>
                <th>Content</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.title}</td>
                  <td>{row.content}</td>
                  <td>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <form onSubmit={handleAddRow} className="table-form">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={newRow.title}
              onChange={handleChange}
            />
            <input
              type="text"
              name="content"
              placeholder="Content (optional)"
              value={newRow.content}
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
