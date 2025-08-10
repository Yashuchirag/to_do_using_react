import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import "../css/TableContents.css";

export default function TableOfContents() {
  const [rows, setRows] = useState([]);
  const [newRow, setNewRow] = useState({ task: "", status: "todo" });
  const [error, setError] = useState('');

  const currentUser = (() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    return user;
  })();

  useEffect(() => {
    const fetchRows = async () => {
      setError('');
      if (!currentUser) {
        setError("Not logged in. Please log in to see your tasks");
        return;
      }
      const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching rows:", error);
      } else {
        setRows(data);
      }
    };
    fetchRows();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    setError('');
    if (!currentUser) return setError("Not logged in. Please log in to add tasks");
    if (!newRow.name.trim() || !newRow.status.trim()) return;

    const { data, error } = await supabase
    .from("tasks")
    .insert([{ name: newRow.name, status: newRow.status }])
    .select("*")
    .single();

    if (error) {
      console.error("Error adding row:", error);
    }else {
      setRows((prev) => [...prev, { id: data.id, ...newRow }]);
      setNewRow({ task: "", status: "todo" });
    }
  };

  const handleDeleteRow = async (id) => {
    setError("");
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Error deleting row:", error);
    }else {
      setRows((prev) => prev.filter((row) => row.id !== id));
    }
  };

  const handleUpdateRow = async (id, task, status) => {
    setError("");
    const { data, error } = await supabase
    .from("tasks")
    .update({ task, status })
    .eq("id", id)
    .select("*")
    .single();

    if (error) {
      console.error("Error updating row:", error);
    }else {
      setRows((prev) => prev.map((row) => row.id === id ? { id, task, status } : row));
    }
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
              <td>{row.task}</td>
              <td>{row.status}</td>
              <td>
                <button onClick={() => handleUpdateRow(row.id, row.task, row.status)}>Update</button>
                <button onClick={() => handleDeleteRow(row.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddRow} className="table-form">
        <input
          type="text"
          name="task"
          placeholder="Task name"
          value={newRow.task}
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