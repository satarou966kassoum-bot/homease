import { useEffect, useState } from "react";
import { api } from "../../services/api";

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  function load() {
    setIsLoading(true);
    api
      .get("/admin/users", { params: q ? { q } : {} })
      .then((res) => setUsers(res.data.data.users))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleSuspend(user: AdminUser) {
    await api.put(`/admin/users/${user._id}`, { isSuspended: !user.isSuspended });
    setUsers((prev) =>
      prev.map((u) => (u._id === user._id ? { ...u, isSuspended: !u.isSuspended } : u))
    );
  }

  async function changeRole(user: AdminUser, role: string) {
    await api.put(`/admin/users/${user._id}`, { role });
    setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, role } : u)));
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher par nom ou email"
          className="input-field"
        />
        <button onClick={load} className="btn-ghost">Rechercher</button>
      </div>

      {isLoading ? (
        <p className="mt-6 text-sm text-ink-300">Chargement...</p>
      ) : (
        <div className="mt-6 divide-y divide-sand-200 rounded-lg border border-sand-200 bg-white">
          {users.map((u) => (
            <div key={u._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-sm text-ink-300">{u.email}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u, e.target.value)}
                  className="input-field w-auto py-2 text-sm"
                >
                  <option value="client">Client</option>
                  <option value="owner">Propriétaire</option>
                  <option value="admin">Admin</option>
                </select>

                <button
                  onClick={() => toggleSuspend(u)}
                  className={`rounded px-3 py-2 text-sm font-medium ${
                    u.isSuspended
                      ? "bg-lagoon-50 text-lagoon-600"
                      : "bg-clay-500/10 text-clay-600"
                  }`}
                >
                  {u.isSuspended ? "Réactiver" : "Suspendre"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
