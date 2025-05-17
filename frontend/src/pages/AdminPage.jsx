import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser1, setSelectedUser1] = useState("");
  const [selectedUser2, setSelectedUser2] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  // useEffect(() => {
  //   fetchUsers();
  //   // eslint-disable-next-line
  // }, []);

   useEffect(() => {
    axiosInstance.get("/admin/users").then(res => setUsers(res.data));
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const handleBlock = async (userId) => {
    await axiosInstance.post(`/admin/block/${userId}`);
    fetchUsers();
  };

  const handleUnblock = async (userId) => {
    await axiosInstance.post(`/admin/unblock/${userId}`);
    fetchUsers();
  };

  const handleViewMessages = async () => {
    if (selectedUser1 && selectedUser2) {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/admin/messages/${selectedUser1}/${selectedUser2}`);
        setMessages(res.data);
      } catch {
        setMessages([]);
      }
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem", textAlign: "center", marginTop:"30px",}}>Admin Dashboard</h2>
      <button
        onClick={handleLogout}
        style={{
          position: "absolute",
          top: 20,
          right: 30,
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>All Users</h3>
      <table style={{ width: "100%", marginBottom: "2rem", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Status</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Role</th>
            <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.fullName}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{user.email}</td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                {user.isBlocked ? (
                  <span style={{ color: "red" }}>Blocked</span>
                ) : (
                  <span style={{ color: "green" }}>Active</span>
                )}
              </td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                {user.isAdmin ? "Admin" : "User"}
              </td>
              <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                {user.isBlocked ? (
                  <button onClick={() => handleUnblock(user._id)} style={{ color: "green" }}>
                    Unblock
                  </button>
                ) : (
                  <button onClick={() => handleBlock(user._id)} style={{ color: "red" }}>
                    Block
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>View Messages Between Users</h3>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <select value={selectedUser1} onChange={e => setSelectedUser1(e.target.value)}>
          <option value="">Select User 1</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.fullName}</option>
          ))}
        </select>
        <select value={selectedUser2} onChange={e => setSelectedUser2(e.target.value)}>
          <option value="">Select User 2</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.fullName}</option>
          ))}
        </select>
        <button onClick={handleViewMessages}>View Messages</button>
      </div>
      <div style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px", minHeight: "100px" }}>
        {loading ? (
          <div>Loading messages...</div>
        ) : messages.length === 0 ? (
          <div>No messages to show.</div>
        ) : (
          <ul>
            {messages.map(msg => (
              <li key={msg._id} style={{ marginBottom: "0.5rem" }}>
                <b>
                  {users.find(u => u._id === msg.senderId)?.fullName || "User"}:
                </b>{" "}
                {msg.text || <i>[Image]</i>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}