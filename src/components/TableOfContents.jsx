import React, { useState } from "react";
import "../css/TableContents.css";

export default function TableOfContents() {
  const [rows, setRows] = useState([
    { id: 1, name: "Task 1", status: "Pending" },
    { id: 2, name: "Task 2", status: "Completed" }
  ]);

  const [newRow, setNewRow] = useState({ name: "", status: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = (e) => {
    e.preventDefault();
    if (!newRow.name.trim() || !newRow.status.trim()) return;

    const id = rows.length > 0 ? rows[rows.length - 1].id + 1 : 1;
    setRows((prev) => [...prev, { id, ...newRow }]);
    setNewRow({ name: "", status: "" });
  };

  return (
    <div className="table-container">
      <h2>📋 Tasks Table</h2>

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
    </div>
  );
}