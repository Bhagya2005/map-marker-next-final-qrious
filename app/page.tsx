"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { pin } from "@/app/types";
import Sidebar from "@/app/_components/_sidebar-component/Sidebar";
import PinForm from "@/app/_components/PinForm";
import PinModal from "@/app/_components/PinModal";
import WalkthroughModal from "@/app/_components/WalkthroughModal";
import { buildPin } from "@/utils/pinHelpers";
import { showError } from "@/utils/toast";

const MapView = dynamic(
  () => import("@/app/_components/_map-component/MapView"),
  { ssr: false }
);

export default function HomePage() {
  const router = useRouter();
  const mapRef = useRef<any>(null);

  const { user, pins = [], categories = [], setPins, setCategories, loading } =
    useAuthStore();

  const [selectedPin, setSelectedPin] = useState<pin | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<pin | null>(null);
  const [filter, setFilter] = useState("All");

  const [walkthroughOpen, setWalkthroughOpen] = useState(false);

  useEffect(() => {
    if (user && pins.length === 0 && categories.length === 0) {
      setWalkthroughOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) return null;

  const visiblePins =
    filter === "All" ? pins : pins.filter((p) => p.category === filter);

  const savePin = (p: pin) => {
    const final = buildPin(p, categories, user.email);
    if (!final) return showError("Select valid category");

    setPins(
      pins.some((x) => x.id === p.id)
        ? pins.map((x) => (x.id === p.id ? final : x))
        : [...pins, final]
    );

    setFormOpen(false);
    setFormData(null);
  };

  return (
    <div className="app relative">
      <Sidebar
        pins={visiblePins}
        selectedPin={selectedPin}
        onSelectPin={setSelectedPin}
        onDeletePin={(id) => setPins(pins.filter((p) => p.id !== id))}
        onEditPin={(p) => {
          setFormData(p);
          setFormOpen(true);
        }}
        filter={filter}
        setFilter={setFilter}
        categories={categories}
        onAddCategory={(c) =>
          setCategories([...categories, { ...c, userId: user.email }])
        }
        onDeleteCategory={(names) =>
          setCategories(categories.filter((c) => !names.includes(c.name)))
        }
        mapRef={mapRef}
        username={user.username}
      />

      <MapView
        pins={visiblePins}
        mapRef={mapRef}
        onSelectPin={setSelectedPin}
        onMapClick={(lat, lng) => {
          if (!categories.length) return showError("Create category first");

          setFormData({
            id: Date.now().toString(),
            name: "",
            description: "",
            lat,
            lng,
            category: categories[0].name,
            color: categories[0].color,
            userId: user.email,
          });
          setFormOpen(true);
        }}
        openWalkthrough={() => setWalkthroughOpen(true)}
      />

      {walkthroughOpen && (
        <WalkthroughModal
          key={walkthroughOpen ? "open" : "closed"}
          onClose={() => setWalkthroughOpen(false)}
        />
      )}

      {selectedPin && <PinModal pin={selectedPin} onClose={() => setSelectedPin(null)} />}

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
