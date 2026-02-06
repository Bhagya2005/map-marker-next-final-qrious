"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import ThemeToggle from "@/app/_components/_sidebar-component/ThemeToggle";
import ReadMoreModal from "@/app/_components/_sidebar-component/ReadMoreModal";
import AddCategoryModal from "@/app/_components/_sidebar-component/AddCategoryModal";
import CategoryFilterModal from "@/app/_components/_sidebar-component/CategoryFilterModal";
import UserSettingsModal from "@/app/_components/_sidebar-component/UserSettingsModal";
import FeedbackModal from "@/app/_components/_sidebar-component/FeedbackModal";
import ShowAllPinsModal from "@/app/_components/_sidebar-component/ShowAllPinsModal";
import DeleteCategoryModal from "@/app/_components/_sidebar-component/DeleteCategoryModal";
import ShareModal from "@/app/_components/_sidebar-component/ShareModal";

import { usePinStore } from "@/stores/pinStore";
import { useCategoryStore } from "@/stores/categoryStore";
import { useCurrentUserStore } from "@/stores/currentUserStore";
import { showSuccess } from "@/utils/toast";

export default function Sidebar({ mapRef }: { mapRef: any }) {
  const router = useRouter();


  const { pins, deletePin, fetchPins } = usePinStore();
  const { categories, addCategory, deleteCategories } = useCategoryStore();
  const { user } = useCurrentUserStore();

  const [open, setOpen] = useState(false);
  const [modalPin, setModalPin] = useState<any>(null);

  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showAllPins, setShowAllPins] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState({ name: "", color: "#22c55e" });

  useEffect(() => {
    const userId = user?.email;
    if (userId) fetchPins(userId as any);
  }, [fetchPins, user]);


  const filteredPins = useMemo(() => {
    if (selectedCategories.length === 0) return pins;
    return pins.filter((p) => selectedCategories.includes(p.category));
  }, [pins, selectedCategories]);


  const handleDeleteCategories = (names: string[]) => {
    if (names.length === 0) return;
    deleteCategories(names);
    showSuccess("Categories deleted successfully");
  };

  const handleUserSave = (email: string) => {
    showSuccess("User settings updated!");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-20 left-2 z-[9999] bg-blue-700 text-white px-4 py-2 rounded-2xl"
      >
        ☰
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-[10000] w-full sm:min-w-[380px] sm:max-w-[420px] bg-zinc-900 text-white border-r border-gray-700 shadow-2xl p-6 flex flex-col gap-5 overflow-auto transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >

        <button
          onClick={() => setOpen(false)}
          className="lg:hidden self-end text-xl font-bold text-gray-400 hover:text-red-500 transition"
        >
          ✕
        </button>

        <div className="rounded-2xl border border-gray-700 bg-gradient-to-r from-zinc-800 to-zinc-700 p-3 shadow-inner break-words flex justify-between items-center">
          <div>
            <p className="text-sm">UserName : {user?.email || "Guest"}</p>
          </div>
          <button
            onClick={() => setShowUserSettings(true)}
            className="bg-gray-700 text-white px-3 py-1 rounded-xl text-sm cursor-pointer border-white border-2 hover:bg-gray-600 transition"
          >
            Settings
          </button>
        </div>

        <div className="flex flex-row gap-3">
          <ThemeToggle />
          <button
            onClick={() => setShowAddCatModal(true)}
            className="bg-gradient-to-r from-slate-700 to-blue-600 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer w-full font-medium"
          >
            + Add Category
          </button>
        </div>

        <div className="flex flex-row gap-3">
          <button
            onClick={() => setShowDeleteCategory(true)}
            className="border border-red-400 text-red-400 hover:bg-red-400/10 rounded-xl py-2 w-full cursor-pointer transition"
          >
            Delete Category
          </button>
          <button
            onClick={() => setOpenFilterModal(true)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer font-medium"
          >
            Filter Categories
          </button>
        </div>

        <ul className="flex-1 overflow-auto space-y-3 p-2 rounded-xl bg-zinc-800">
          {filteredPins.length === 0 ? (
            <li className="flex items-center justify-center h-full min-h-[150px]">
              <span className="text-sm text-gray-400 italic">No data available</span>
            </li>
          ) : (
            filteredPins.map((pin) => (
              <li
                key={pin._id}
                onClick={() => {
                  setOpen(false);
                  mapRef.current?.flyTo([pin.lat, pin.lng], 12, { animate: true });
                }}
                className="px-4 py-3 cursor-pointer flex justify-between items-start rounded-2xl bg-zinc-900 border border-gray-800 hover:border-indigo-500 transition-all"
              >
                <div className="flex flex-col max-w-[200px]">
                  <span className="font-semibold text-white break-words line-clamp-2">{pin.name}</span>
                  <span className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{pin.category}</span>
                  <button
                    className="text-sm mt-2 font-medium text-indigo-400 hover:underline self-start"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalPin(pin);
                    }}
                  >
                    Read more
                  </button>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePin(pin._id);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowAllPins(true)}
            className="bg-transparent border-indigo-400 border-2 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer w-full font-medium"
          >
            Show All Pins
          </button>

          <div className="flex flex-row gap-3">
             <button
              onClick={() => setShowShareModal(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer w-full font-medium"
            >
              Share Map
            </button>
            <button
              onClick={() => setShowFeedback(true)}
              className="border-2 border-green-400 text-green-400 rounded-2xl py-2 px-4 cursor-pointer w-full font-medium hover:bg-green-400/10"
            >
              Feedback
            </button>
          </div>

          <button
            onClick={() => router.push("/logout")}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer font-medium"
          >
            Logout
          </button>
        </div>

        <p className="text-center text-[10px] opacity-40 tracking-widest uppercase">Bhagya Patel</p>
      </aside>

      {modalPin && <ReadMoreModal {...modalPin} onClose={() => setModalPin(null)} />}

      {showAddCatModal && (
        <AddCategoryModal
          newCat={newCat}
          setNewCat={setNewCat}
          onAddCategory={(c) => addCategory({ ...c, userId: user?.email || "" })}
          onClose={() => setShowAddCatModal(false)}
        />
      )}

      {openFilterModal && (
        <CategoryFilterModal
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          onClose={() => setOpenFilterModal(false)}
        />
      )}

      {showDeleteCategory && (
        <DeleteCategoryModal
          onDeleteCategories={handleDeleteCategories}
          onClose={() => setShowDeleteCategory(false)}
        />
      )}

      {showUserSettings && (
        <UserSettingsModal
          currentEmail={user?.email ?? ""}
          onSave={handleUserSave}
          onClose={() => setShowUserSettings(false)}
        />
      )}

      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} onSubmit={() => {}} />
      )}

      {showAllPins && (
        <ShowAllPinsModal pins={pins} onClose={() => setShowAllPins(false)} />
      )}

      {showShareModal && user?.email && (
        <ShareModal userId={user.email} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
}