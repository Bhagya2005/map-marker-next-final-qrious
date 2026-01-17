"use client";

import { useEffect, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {arrayMove,SortableContext,verticalListSortingStrategy,useSortable,} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import {getWalkthroughs,saveWalkthroughs,type Walkthrough,} from "@/utils/storage/walkthrough.storage";

const ITEMS_PER_PAGE = 5;

function SortableRow({walkthrough,onEdit,onDelete}: {
  walkthrough: Walkthrough;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: walkthrough.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-zinc-700">
      <td
        {...attributes}
        {...listeners}
        className="px-2 py-4 cursor-grab text-gray-400 select-none"
        title="Drag"
      >
        ☰
      </td>

      <td className="px-6 py-4 font-semibold text-white">{walkthrough.title}</td>
      <td className="px-6 py-4">{walkthrough.description || "—"}</td>
      <td className="px-6 py-4">{walkthrough.videoUrl || "—"}</td>
      <td className="px-6 py-4 flex gap-2">
        <button
          onClick={() => onEdit(walkthrough.id)}
          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded text-xs hover:bg-blue-500/30"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(walkthrough.id)}
          className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default function WalkthroughsManagement() {
  const [walkthroughs, setWalkthroughs] = useState<Walkthrough[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formVideo, setFormVideo] = useState("");

  useEffect(() => {
    setWalkthroughs(getWalkthroughs());
  }, []);

  const filtered = walkthroughs.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      (w.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const globalOldIndex = walkthroughs.findIndex((w) => w.id === active.id);
    const globalNewIndex = walkthroughs.findIndex((w) => w.id === over.id);

    const newArray = arrayMove(walkthroughs, globalOldIndex, globalNewIndex);
    setWalkthroughs(newArray);
    saveWalkthroughs(newArray);
  };

  const openModal = (id?: string) => {
    if (id) {
      const w = walkthroughs.find((w) => w.id === id);
      if (!w) return;
      setEditingId(id);
      setFormTitle(w.title);
      setFormDesc(w.description || "");
      setFormVideo(w.videoUrl || "");
    } else {
      setEditingId(null);
      setFormTitle("");
      setFormDesc("");
      setFormVideo("");
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleCreateOrUpdate = () => {
    if (!formTitle.trim()) return;

    if (editingId) {
      const updated = walkthroughs.map((w) =>
        w.id === editingId
          ? { ...w, title: formTitle, description: formDesc, videoUrl: formVideo }
          : w
      );
      setWalkthroughs(updated);
      saveWalkthroughs(updated);
    } else {
      const newWalkthrough: Walkthrough = {
        id: uuidv4(),
        title: formTitle,
        description: formDesc,
        points: [],
        videoUrl: formVideo,
      };
      const updated = [...walkthroughs, newWalkthrough];
      setWalkthroughs(updated);
      saveWalkthroughs(updated);
    }

    setShowModal(false);
    setEditingId(null);
    setFormTitle("");
    setFormDesc("");
    setFormVideo("");
    setCurrentPage(1);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      const updated = walkthroughs.filter((w) => w.id !== id);
      setWalkthroughs(updated);
      saveWalkthroughs(updated);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Walkthroughs ({walkthroughs.length})
        </h2>
        <button
          onClick={() => openModal()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          + Create New
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by title or description..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600 w-full md:w-1/3"
      />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={paginated.map((w) => w.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="overflow-x-auto bg-white/5 border border-white/10 rounded-lg mt-4">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/10 border-b border-white/10">
                <tr>
                  <th className="px-2 py-3">Drag</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Video URL</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No walkthroughs found
                    </td>
                  </tr>
                ) : (
                  paginated.map((w) => (
                    <SortableRow
                      key={w.id}
                      walkthrough={w}
                      onEdit={openModal}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SortableContext>
      </DndContext>

      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-4 mt-4">
          <span className="text-gray-300">
            Page {currentPage} of {totalPages} ({filtered.length} items)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "bg-white/10 text-gray-300 hover:bg-white/20"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {editingId ? "Edit Walkthrough" : "Create New Walkthrough"}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
              />
              <input
                type="text"
                placeholder="Description"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
              />
              <input
                type="text"
                placeholder="Video URL"
                value={formVideo}
                onChange={(e) => setFormVideo(e.target.value)}
                className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-600"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOrUpdate}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {editingId ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
