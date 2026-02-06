"use client";

import { useEffect, useState } from "react";
import { usePinStore } from "@/stores/pinStore";

export default function PinManagement() {
  const {
    pins,pinsPage,pinsTotalPages,fetchPins,
    savePin,deletePin
  } = usePinStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", category: "", lat: 0, lng: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);


  useEffect(() => {
    const timer = setTimeout(() => {
      usePinStore.setState({ pinsPage: page, pinsCategory: category, pinsSearch: search });
      fetchPins();
    }, 200); // debounce for search input
    return () => clearTimeout(timer);
  }, [page, category, search, fetchPins]);

  const openCreateModal = () => {
    setFormData({ name: "", category: category || "", lat: 0, lng: 0 });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (pin: any) => {
    setFormData({ ...pin });
    setEditingId(pin._id);
    setShowModal(true);
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    usePinStore.setState({ pinForm: { ...formData, _id: editingId }, editingPinId: editingId });
    await savePin();
    setShowModal(false);
    setEditingId(null);
  };

  const handleDelete = async (id: string) => {
    await deletePin(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 bg-zinc-900 p-4 rounded-xl border border-white/10 items-center">
        <input
          placeholder="Search pins..."
          className="bg-zinc-800 border border-white/10 p-2 rounded-md flex-1 text-sm text-white focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-zinc-800 border border-white/10 p-2 rounded-md text-sm text-white"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          <option value="tourist">Tourist</option>
          <option value="food">Food</option>
          <option value="hotel">Hotel</option>
        </select>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 px-4 py-2 rounded-md text-sm font-bold text-white hover:bg-blue-500 transition-colors"
        >
          + Add Pin
        </button>
      </div>

      <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Coords (Lat, Lng)</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {pins.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-10 text-center text-zinc-500">
                  No pins found
                </td>
              </tr>
            ) : (
              pins.map((pin: any) => (
                <tr key={pin._id} className="hover:bg-white/5 transition-all">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: pin.color }}></div>
                      <span className="font-medium text-white">{pin.name}</span>
                    </div>
                  </td>
                  <td className="p-4 uppercase text-[10px] font-bold tracking-widest text-zinc-500">{pin.category}</td>
                  <td className="p-4 text-zinc-400 font-mono">{pin.lat}, {pin.lng}</td>
                  <td className="p-4 space-x-3 text-right">
                    <button onClick={() => openEditModal(pin)} className="text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                    <button onClick={() => handleDelete(pin._id)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="p-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <p className="text-xs text-zinc-500">Page {page} of {pinsTotalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-50 text-white">Prev</button>
            <button disabled={page === pinsTotalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 bg-zinc-800 rounded disabled:opacity-50 text-white">Next</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
          <form onSubmit={handleSave} className="bg-zinc-900 border border-white/10 p-6 rounded-xl w-full max-w-md space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-white">{editingId ? "Update Pin" : "Create Pin"}</h2>
            <div className="space-y-3">
              <input placeholder="Name" className="w-full bg-zinc-800 p-2.5 rounded border border-white/10 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input placeholder="Category" className="w-full bg-zinc-800 p-2.5 rounded border border-white/10 text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
              <div className="flex gap-2">
                <input type="number" step="any" placeholder="Lat" className="w-full bg-zinc-800 p-2.5 rounded border border-white/10 text-white" value={formData.lat} onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})} required />
                <input type="number" step="any" placeholder="Lng" className="w-full bg-zinc-800 p-2.5 rounded border border-white/10 text-white" value={formData.lng} onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})} required />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-colors">Cancel</button>
              <button type="submit" className="bg-blue-600 px-6 py-2 rounded-md font-bold text-white hover:bg-blue-500 transition-all">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
