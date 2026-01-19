//what I Learn ?
//conditional rendering

//In CSS :
//overflow-auto : Content zyada hone par scroll automatically add ho jata hai , Scroll tabhi dikhta hai jab zarurat ho
//transition-transform : Sirf transform properties (scale, translate, rotate) par smooth transition lagata hai
//duration-300 : Transition ka time 300 milliseconds hota hai
//bg-gradient-to-r : Background gradient left se right direction me lagta hai
//from-indigo-600 to-purple-600 : Gradient ka starting and ending color set karta hai
//translate-x-0 : Element normal position me hota hai (no horizontal movement)
//-translate-x-full :Element apni width ke barabar left side shift ho jata hai , Mostly sidebar hide/show ke liye use hota hai

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarProps } from "@/app/types";
import ThemeToggle from "@/app/_components/_sidebar-component/ThemeToggle";
import { useEffect } from "react";
import ReadMoreModal from "@/app/_components/_sidebar-component/ReadMoreModal";
import AddCategoryModal from "@/app/_components/_sidebar-component/AddCategoryModal";
import CategoryFilterModal from "@/app/_components/_sidebar-component/CategoryFilterModal";
import UserSettingsModal from "@/app/_components/_sidebar-component/UserSettingsModal";
import FeedbackModal from "@/app/_components/_sidebar-component/FeedbackModal";
import ShowAllPinsModal from "@/app/_components/_sidebar-component/ShowAllPinsModal";
import DeleteCategoryModal from "@/app/_components/_sidebar-component/DeleteCategoryModal";
import { showSuccess, showError } from "@/utils/toast";
// import { updateUserSettings } from "@/utils/storage/user.storage";
// import { saveFeedback } from "@/utils/storage/feedback.storage";


export default function Sidebar({ pins, selectedPin, onSelectPin, onDeletePin, onEditPin, cursorLocation, categories, onAddCategory, mapRef, username, onDeleteCategory }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const [modalPin, setModalPin] = useState<null | typeof pins[0]>(null);
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", color: "#22c55e" });
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showUserSettings, setShowUserSettings] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [user, setUser] = useState(username);
  const [filteredPins, setFilteredPins] = useState(pins);
  const [showAllPins, setShowAllPins] = useState(false);
  const [showDeleteCategory, setShowDeleteCategory] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredPins(pins);
    } else {
      setFilteredPins(pins.filter((p) => selectedCategories.includes(p.category)));
    }
  }, [selectedCategories, pins]);

  const handleUserSave = (email: string, password: string) => {
    setUser(email);
    // updateUserSettings(email, password);
    showSuccess("User settings updated!");
  };

  const handleFeedbackSubmit = (rating: number, message?: string) => {
    const title = `Feedback ${new Date().toLocaleDateString()}`;
    // saveFeedback(rating, message, title, "general");
    showSuccess("Thank you for your feedback!");
  };


  const handleDeleteCategories = (categoryNames: string[]) => {
    if (categoryNames.length === 0) return;

    onDeleteCategory?.(categoryNames);
    showSuccess("Category deleted successfully");
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
        className={`fixed inset-y-0 left-0 z-[10000] w-full sm:min-w-[380px] sm:max-w-[600px] md:max-w-[410px] bg-zinc-900 text-white border-r  border-gray-700 shadow-2xl p-6 flex flex-col gap-5 overflow-auto transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >


        <button
          onClick={() => setOpen(false)}
          className="lg:hidden self-end text-xl font-bold text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
        >
          ✕
        </button>
        <div className="rounded-2xl border border-gray-700 bg-gradient-to-r  from-zinc-800 dark:to-zinc-700 p-3 shadow-inner break-words flex justify-between items-center">
          <div>
            <p >UserName : {user} </p>
          </div>
          <button
            onClick={() => setShowUserSettings(true)}
            className="bg-gray-700 text-white px-3 py-1 rounded-xl text-sm cursor-pointer border-white border-2"
          >
            Settings
          </button>
        </div>

        <div className="flex flex-row gap-3">
          <div >
            <ThemeToggle />
          </div>
          <button
            onClick={() => setShowAddCatModal(true)}
            className="bg-gradient-to-r from-slate-700 to-blue-600 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer w-full"
          >
            + Add Category
          </button>

        </div>
        <div className="flex flex-row gap-3">
          <button
            onClick={() => setShowDeleteCategory(true)}
            className="border border-red-400 rounded-xl py-2 w-full cursor-pointer"
          >
            Delete Category
          </button>

          <button
            onClick={() => setOpenFilterModal(true)}
            className=" w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer"
          >
            Filter Categories
          </button>
        </div>
        <ul className="flex-1 overflow-auto space-y-3 p-2 rounded-xl bg-zinc-800">
          {filteredPins.length === 0 ? (
            <li className="flex items-center justify-center h-full min-h-[200px]">
              <span className="text-sm text-gray-400 italic">
                No data available
              </span>
            </li>
          ) : (
            filteredPins.map((pin) => (
              <li
                key={pin.id}
                onClick={() => {
                  onSelectPin(pin);
                  setOpen(false);
                  mapRef.current?.flyTo([pin.lat, pin.lng], 8, {
                    animate: true,
                    duration: 1.2,
                  });
                }}
                className={`px-4 py-3 cursor-pointer flex justify-between items-start rounded-2xl bg-zinc-900 ${selectedPin?.id === pin.id ? "ring-2 ring-indigo-500" : ""}`}
              >

                <div className="flex flex-col max-w-[220px]">
                  <span className="font-semibold text-white break-words line-clamp-2">
                    {pin.name}
                  </span>

                  <span className="text-sm text-gray-300 break-words line-clamp-1">
                    {pin.description}
                  </span>

                  <button
                    className="text-sm mt-1 font-medium text-indigo-400 hover:underline self-start"
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
                      onEditPin(pin);
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition">
                    Edit
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePin(pin.id);
                    }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowAllPins(true)}
            className="bg-transparent border-indigo-400 border-2 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer w-full"
          >
            Show All Pins
          </button>
        </div>

        <div className="flex flex-row gap-3">
          <button
            onClick={() => setShowFeedback(true)}
            className="border-2 border-green-400 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer w-full"
          >
            Give Feedback
          </button>
          <button
            onClick={() => router.push("/logout")}
            className="bg-gradient-to-r from-red-600 to-red-500 text-white rounded-2xl py-2 px-4 shadow-lg cursor-pointer "
          >
            Logout
          </button>
        </div>
        <p className="text-center text-xs opacity-40">Bhagya Patel</p>
      </aside>

      {modalPin && (
        <ReadMoreModal
          id={modalPin.id}
          name={modalPin.name}
          description={modalPin.description}
          category={modalPin.category}
          color={modalPin.color}
          lat={modalPin.lat}
          lng={modalPin.lng}
          onClose={() => setModalPin(null)}
        />
      )}

      {showAddCatModal && (
        <AddCategoryModal
          newCat={newCat}
          setNewCat={setNewCat}
          onAddCategory={onAddCategory}
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
      {showUserSettings && (
        <UserSettingsModal
          currentEmail={user}
          onSave={handleUserSave}
          onClose={() => setShowUserSettings(false)}
        />
      )}
      {showFeedback && (
        <FeedbackModal onClose={() => setShowFeedback(false)} onSubmit={handleFeedbackSubmit} />
      )}
      {showAllPins && (
        <ShowAllPinsModal
          pins={pins}
          onClose={() => setShowAllPins(false)}
        />
      )}

      {showDeleteCategory && (
        <DeleteCategoryModal
          categories={categories}
          onDeleteCategories={handleDeleteCategories}
          onClose={() => setShowDeleteCategory(false)}
        />
      )}


    </>
  );
}