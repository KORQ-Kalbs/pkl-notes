"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import "../../globals.css";

const styles = {
  page: "min-h-screen py-18 px-[6vw] bg-bg-primary",
  header: "flex items-center justify-between mb-8",
  kicker: "text-kicker",
  subtitle: "text-text-secondary",
  table: "w-full border-separate border-spacing-y-2",
  row: "bg-bg-secondary border border-border-color",
  cell: "px-4 py-3",
  muted: "text-text-secondary",
  error: "text-danger",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    const { data, error: usersError } = await supabase
      .from("users")
      .select("id, email_user, password, role")
      .order("id", { ascending: false });

    if (usersError) {
      setError("Unable to load users list.");
      setUsers([]);
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Users management</p>
          <h1 className="font-display text-[2.2rem]">User directory</h1>
          <p className={styles.subtitle}>
            Review user accounts, roles, and stored credentials.
          </p>
        </div>
      </header>

      {loading ? (
        <p className={styles.muted}>Loading users...</p>
      ) : error ? (
        <p className={styles.error}>{error}</p>
      ) : users.length === 0 ? (
        <p className={styles.muted}>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={`${styles.cell} text-left`}>User ID</th>
                <th className={`${styles.cell} text-left`}>Email</th>
                <th className={`${styles.cell} text-left`}>Password</th>
                <th className={`${styles.cell} text-left`}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={styles.row}>
                  <td className={styles.cell}>{user.id}</td>
                  <td className={styles.cell}>{user.email_user}</td>
                  <td className={styles.cell}>{user.password}</td>
                  <td className={styles.cell}>
                    {user.role ? "Admin" : "User"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
