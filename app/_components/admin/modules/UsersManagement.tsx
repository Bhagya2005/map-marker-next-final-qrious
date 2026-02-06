"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";

export default function UsersManagement() {
  const {
    users,usersPage,usersTotalPages,usersRole,
    loadUsers,saveUser,deleteUser,userForm,
    setUserForm,editingUserId
  } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      useUserStore.setState({
        usersPage: currentPage,
        usersRole: selectedRole,
        usersSearch: searchTerm,
      });
      loadUsers();
    }, 200); // debounce search input
    return () => clearTimeout(timer);
  }, [currentPage, selectedRole, searchTerm, loadUsers]);

  const openModal = (user?: any) => {
    if (user) {
      setUserForm(user);
    } else {
      setUserForm({ email: "", username: "", password: "", role: "regular" });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleAddOrUpdate = async () => {
    await saveUser();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    await deleteUser(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Users List</h2>
        <button
          onClick={() => openModal()}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-all"
        >
          + New User
        </button>
      </div>

  
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-zinc-900 p-4 rounded-xl border border-white/10">
        <input
          type="text"
          placeholder="Search email/username..."
          className="bg-zinc-800 border border-white/10 p-2 rounded text-sm text-white col-span-2 focus:ring-1 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="bg-zinc-800 border border-white/10 p-2 rounded text-sm text-white outline-none"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="regular">Regular</option>
        </select>
        <button
          onClick={loadUsers}
          className="bg-zinc-700 hover:bg-zinc-600 p-2 rounded text-sm text-white transition-colors"
        >
          Apply Filter
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-4">User Details</th>
              <th className="p-4">Role</th>
              <th className="p-4">Created At</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-zinc-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u: any) => (
                <tr key={u._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <div className="font-bold text-white">{u.email}</div>
                    <div className="text-xs text-zinc-500">@{u.username || "n/a"}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === "admin"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 space-x-3 text-right">
                    <button
                      onClick={() => openModal(u)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="p-4 border-t border-white/10 flex justify-between items-center bg-white/5">
          <span className="text-xs text-zinc-500 font-mono">
            Page {currentPage} of {usersTotalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-30 text-white hover:bg-zinc-700 transition-colors"
            >
              Prev
            </button>
            <button
              disabled={currentPage === usersTotalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-30 text-white hover:bg-zinc-700 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl ring-1 ring-white/10">
            <h2 className="text-xl font-bold mb-5 text-white">
              {editingUserId ? "Edit User Account" : "Create New User"}
            </h2>
            <div className="space-y-4">
              <input
                placeholder="Email Address"
                disabled={!!editingUserId}
                className="w-full bg-zinc-800 p-3 rounded-xl border border-white/10 text-white outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                value={userForm.email}
                onChange={(e) =>
                  setUserForm({ ...userForm, email: e.target.value })
                }
              />
              <input
                placeholder="Username"
                className="w-full bg-zinc-800 p-3 rounded-xl border border-white/10 text-white outline-none focus:ring-1 focus:ring-blue-500"
                value={userForm.username}
                onChange={(e) =>
                  setUserForm({ ...userForm, username: e.target.value })
                }
              />
              {!editingUserId && (
                <input
                  type="password"
                  placeholder="Secure Password"
                  className="w-full bg-zinc-800 p-3 rounded-xl border border-white/10 text-white outline-none focus:ring-1 focus:ring-blue-500"
                  value={userForm.password}
                  onChange={(e) =>
                    setUserForm({ ...userForm, password: e.target.value })
                  }
                />
              )}
              <select
                className="w-full bg-zinc-800 p-3 rounded-xl border border-white/10 text-white outline-none focus:ring-1 focus:ring-blue-500"
                value={userForm.role}
                onChange={(e) =>
                  setUserForm({ ...userForm, role: e.target.value })
                }
              >
                <option value="regular">Regular User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeModal}
                className="text-zinc-400 hover:text-white transition-colors text-sm font-medium"
              >
                Cancel Action
              </button>
              <button
                onClick={handleAddOrUpdate}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-blue-600/20"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
