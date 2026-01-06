"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type { Map as LeafletMap } from "leaflet";

import Sidebar from "@/app/_components/_sidebar-component/Sidebar";
import PinForm from "@/app/_components/PinForm";
import PinModal from "@/app/_components/PinModal";
import WalkthroughModal from "@/app/_components/WalkthroughModal";

import { pin } from "@/app/types";
import { useUserData } from "@/hooks/useUserData";
import { useWalkthrough } from "@/hooks/useWalkthrough";
import { buildPin } from "@/utils/pinHelpers";
import { showSuccess, showError } from "@/utils/toast";
const MapView = dynamic(() => import("@/app/_components/_map-component/MapView"), {
  ssr: false,
});

export default function HomePage() {
  const router = useRouter();
  const mapRef = useRef<LeafletMap | null>(null);

  const { user, pins, setPins, categories, setCategories, loaded } =
    useUserData(router);

  const { showTour, closeTour, open, setOpen } =
    useWalkthrough(loaded, user, pins, categories);

  const [selectedPin, setSelectedPin] = useState<pin | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<pin | null>(null);
  const [filter, setFilter] = useState("All");
  const [cursorLocation, setCursorLocation] = useState<any>(null);

  if (!user) return null;

  const openForm = (p: pin | null) => {
    setFormData(p);
    setFormOpen(true);
  };

  const savePin = (p: pin) => {
    const final = buildPin(p, categories, user.email);
    if (!final) return showError("Please select a valid category");

    setPins(prev =>
      prev.some(x => x.id === p.id)
        ? prev.map(x => (x.id === p.id ? final : x))
        : [...prev, final]
    );

    setFormOpen(false);
    setFormData(null);
  };

  const deleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.name !== name));
    setPins(prev => prev.filter(p => p.category !== name));
    if (filter === name) setFilter("All");
  };

  const visiblePins =
    filter === "All" ? pins : pins.filter(p => p.category === filter);

  const handleDeleteCategory = (categoryNames: string[]) => {
  setCategories((prev) =>
    prev.filter((c) => !categoryNames.includes(c.name))
  );

  setPins((prev) =>
    prev.filter((p) => !categoryNames.includes(p.category))
  );
};

  return (
    <div className="app relative">
      <Sidebar
        pins={visiblePins}
        selectedPin={selectedPin}
        onSelectPin={setSelectedPin}
        onDeletePin={id => setPins(prev => prev.filter(p => p.id !== id))}
        onEditPin={openForm}
        filter={filter}
        setFilter={setFilter}
        cursorLocation={cursorLocation}
        username={user.username}
        categories={categories}
        onAddCategory={c =>
          setCategories(prev => [...prev, { ...c, userId: user.email }])
        }
        onDeleteCategory={handleDeleteCategory}
        mapRef={mapRef}
      />

      <MapView
        pins={visiblePins}
        mapRef={mapRef}
        onMapClick={(lat, lng) => {
          if (!categories.length) return showError("Please create a category first");
          openForm({
            id: Date.now().toString(),
            name: "",
            description: "",
            lat,
            lng,
            category: categories[0].name,
            color: categories[0].color,
            userId: user.email,
          });
        }}
        onMouseMove={(lat, lng) => setCursorLocation({ lat, lng })}
        onSelectPin={setSelectedPin}
        openWalkthrough={() => setOpen(true)}
      />

      {showTour && (
        <div className="fixed inset-0 z-[9999]">
          <WalkthroughModal onClose={closeTour} />
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[9999]">
          <WalkthroughModal onClose={() => setOpen(false)} />
        </div>
      )}

      {selectedPin && (
        <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />
      )}

      {formOpen && formData && (
        <PinForm
          pin={formData}
          categories={categories}
          onSave={savePin}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
