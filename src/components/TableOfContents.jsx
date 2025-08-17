import React, { useEffect, useMemo, useState } from "react";
import "../css/TableOfContents.css";

export default function TableOfContents() {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({ title: "", content: "", status: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Pull the logged-in user from localStorage (set at signup/login)
  const currentUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null");
    } catch {
      return null;
    }
  }, []);
  const userEmail = currentUser?.email || null;
  console.log("userEmail", userEmail);

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
    if (!userEmail) {
      setError("You must be logged in (missing email).");
      return;
    }
    if (!newRow.title.trim() || !newRow.status.trim()) {
      setError("Title and status are required");
      return;
    }
    setError("");

    try {
      const payload = { email: userEmail, ...newRow }; // include email for the API
      const res = await fetch("/.netlify/functions/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
      <p>Logged in as {userEmail}</p>
      {!userEmail && (
        <p style={{ color: "#a67c00", marginTop: 0 }}>
          You’re not logged in, or your user has no email. Login first to add tasks.
        </p>
      )}

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
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.title}</td>
                  <td>{row.content}</td>
                  <td>{row.status}</td>
                  <td>{row.email}</td>
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
            <button type="submit" disabled={!userEmail}>
              Add Row
            </button>
          </form>
        </>
      )}
    </div>
  );
}
