"use client";

import { useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useWalkthroughStore } from "@/stores/walkthroughStore";

function SortableRow({ walkthrough, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: walkthrough._id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-white/5 group border-b border-white/5">
      <td {...attributes} {...listeners} className="p-4 cursor-grab text-zinc-500 hover:text-white transition">
        ☰
      </td>
      <td className="p-4 font-semibold text-white">{walkthrough.title}</td>
      <td className="p-4 text-zinc-400 max-w-xs truncate">{walkthrough.description || "—"}</td>
      <td className="p-4 space-x-3 text-right">
        <button onClick={() => onEdit(walkthrough)} className="text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
        <button onClick={() => onDelete(walkthrough._id)} className="text-red-500 hover:text-red-400 transition-colors">Delete</button>
      </td>
    </tr>
  );
}

export default function WalkthroughsManagement() {
  const {
    walkthroughs,walkthroughPage,walkthroughTotalPages,fetchWalkthroughs,
    saveWalkthrough,deleteWalkthrough,reorderWalkthroughs,walkthroughForm,
    setWalkthroughForm,editingWalkthroughId,showModal,setShowModal,
    loading,setWalkthroughPage
  } = useWalkthroughStore();


  useEffect(() => {
    fetchWalkthroughs();
  }, [walkthroughPage]);

  const openModal = (walkthrough?: any) => {
    if (walkthrough) {
      setWalkthroughForm(walkthrough);
      useWalkthroughStore.setState({ editingWalkthroughId: walkthrough._id });
    } else {
      setWalkthroughForm({ title: "", description: "", videoUrl: "" });
      useWalkthroughStore.setState({ editingWalkthroughId: null });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleSave = async () => {
    await saveWalkthrough();
    closeModal();
  };

  const handleDelete = async (id: string) => {
    await deleteWalkthrough(id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      await reorderWalkthroughs(active.id, over.id);
    }
  };

  const goToPage = (page: number) => {
    setWalkthroughPage(page);
    fetchWalkthroughs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-white/10">
        <h2 className="text-xl font-bold text-white">Manage Walkthroughs</h2>
        <button onClick={() => openModal()} className="bg-indigo-600 px-4 py-2 rounded-lg font-bold text-sm text-white hover:bg-indigo-500 transition-all">
          + New Walkthrough
        </button>
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={walkthroughs.map(w => w._id)} strategy={verticalListSortingStrategy}>
          <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-zinc-400">
                <tr>
                  <th className="p-4 w-12">Move</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {walkthroughs.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-zinc-500">No walkthroughs found</td></tr>
                ) : (
                  walkthroughs.map(w => (
                    <SortableRow key={w._id} walkthrough={w} onEdit={openModal} onDelete={handleDelete} />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-between items-center p-4 bg-zinc-900 border border-white/10 rounded-xl">
        <p className="text-xs text-zinc-500 font-mono">Page {walkthroughPage} of {walkthroughTotalPages}</p>
        <div className="flex gap-2">
          <button disabled={walkthroughPage === 1} onClick={() => goToPage(walkthroughPage - 1)} className="px-4 py-1.5 bg-zinc-800 rounded-lg disabled:opacity-30 text-white text-xs hover:bg-zinc-700 transition-colors">Prev</button>
          <button disabled={walkthroughPage === walkthroughTotalPages} onClick={() => goToPage(walkthroughPage + 1)} className="px-4 py-1.5 bg-zinc-800 rounded-lg disabled:opacity-30 text-white text-xs hover:bg-zinc-700 transition-colors">Next</button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-zinc-900 border border-white/10 p-6 rounded-2xl w-full max-w-lg shadow-2xl ring-1 ring-white/10">
            <h2 className="text-xl font-bold mb-6 text-white">{editingWalkthroughId ? "Edit Walkthrough" : "New Walkthrough"}</h2>
            <div className="space-y-4">
              <input placeholder="Title" className="w-full bg-zinc-800 p-3 rounded-xl border border-white/10 text-white outline-none focus:ring-1 focus:ring-indigo-500" value={walkthroughForm.title} onChange={e => setWalkthroughForm({ ...walkthroughForm, title: e.target.value })} />
              <textarea placeholder="Description" rows={3} className="w-full bg-zinc-800 p-3 rounded-xl border border-white/10 text-white outline-none focus:ring-1 focus:ring-indigo-500" value={walkthroughForm.description} onChange={e => setWalkthroughForm({ ...walkthroughForm, description: e.target.value })} />
              <input placeholder="Video URL (Embed)" className="w-full bg-zinc-800 p-3 rounded-xl border border-white/10 text-white outline-none focus:ring-1 focus:ring-indigo-500" value={walkthroughForm.videoUrl} onChange={e => setWalkthroughForm({ ...walkthroughForm, videoUrl: e.target.value })} />
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button onClick={closeModal} className="text-zinc-400 hover:text-white transition-colors text-sm font-medium">Discard</button>
              <button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-500 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg shadow-indigo-600/20">{loading ? "Saving..." : "Save Content"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
