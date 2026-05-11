"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import "../../globals.css";

const styles = {
  page: "min-h-screen py-12 sm:py-14 lg:py-18 px-4 sm:px-6 lg:px-[6vw] bg-bg-primary",
  header:
    "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8",
  kicker: "text-kicker",
  subtitle: "text-text-secondary",
  table: "w-full min-w-[720px] border-separate border-spacing-y-2",
  row: "bg-bg-secondary border border-border-color",
  cell: "px-4 py-3 text-sm align-top",
  muted: "text-text-secondary",
  error: "text-danger",
  select:
    "min-h-[44px] rounded-lg border border-border-color bg-white/5 px-3 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-white/10 disabled:opacity-60",
  saveButton:
    "min-h-[44px] px-4 py-2 rounded-lg border border-border-color text-sm font-semibold text-text-primary transition-colors hover:bg-white/5 disabled:opacity-60",
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [roleDrafts, setRoleDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingUserId, setSavingUserId] = useState("");
  const [currentAuthUserId, setCurrentAuthUserId] = useState("");

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
  }, []);

  const loadCurrentUser = async () => {
    const { data } = await supabase.auth.getUser();
    setCurrentAuthUserId(data?.user?.id || "");
  };

  const loadUsers = async () => {
    setLoading(true);
    setError("");

    const { data, error: usersError } = await supabase
      .from("users")
      .select("id, email_user, role")
      .order("id", { ascending: false });

    if (usersError) {
      setError("Unable to load users list.");
      setUsers([]);
      setRoleDrafts({});
      setLoading(false);
      return;
    }

    setUsers(data || []);
    setRoleDrafts(
      Object.fromEntries(
        (data || []).map((user) => [user.id, Boolean(user.role)]),
      ),
    );
    setLoading(false);
  };

  const handleRoleChange = (userId, value) => {
    setRoleDrafts((prev) => ({
      ...prev,
      [userId]: value === "admin",
    }));
  };

  const handleRoleSave = async (user) => {
    if (user.email_user === currentAuthUserId) {
      setError("You cannot change your own admin role from this screen.");
      return;
    }

    const nextRole = Boolean(roleDrafts[user.id]);
    setSavingUserId(user.id);
    setError("");

    const { error: updateError } = await supabase
      .from("users")
      .update({ role: nextRole })
      .eq("id", user.id);

    if (updateError) {
      setError("Unable to update user role.");
      setSavingUserId("");
      return;
    }

    setUsers((prev) =>
      prev.map((item) =>
        item.id === user.id ? { ...item, role: nextRole } : item,
      ),
    );
    setSavingUserId("");
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>Users management</p>
          <h1 className="font-display text-[2.2rem]">User directory</h1>
          <p className={styles.subtitle}>
            Review user accounts and update roles safely.
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
                <th className={`${styles.cell} text-left`}>Auth User ID</th>
                <th className={`${styles.cell} text-left`}>Role</th>
                <th className={`${styles.cell} text-left`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={styles.row}>
                  <td className={styles.cell}>{user.id}</td>
                  <td className={styles.cell}>{user.email_user}</td>
                  <td className={styles.cell}>
                    <select
                      className={styles.select}
                      value={roleDrafts[user.id] ? "admin" : "user"}
                      onChange={(event) =>
                        handleRoleChange(user.id, event.target.value)
                      }
                      disabled={user.email_user === currentAuthUserId}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className={styles.cell}>
                    <button
                      type="button"
                      className={styles.saveButton}
                      onClick={() => handleRoleSave(user)}
                      disabled={
                        savingUserId === user.id ||
                        user.email_user === currentAuthUserId
                      }
                    >
                      {savingUserId === user.id ? "Saving..." : "Save role"}
                    </button>
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
