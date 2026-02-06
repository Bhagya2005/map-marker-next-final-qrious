"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCurrentUserStore } from "@/stores/appStore"; 
import { useCategoryStore } from "@/stores/categoryStore";
import { showError } from "@/utils/toast";

import Sidebar from "@/app/_components/_sidebar-component/Sidebar";
import PinForm from "@/app/_components/PinForm";
import { usePinStore } from "@/stores/pinStore";

const MapView = dynamic(() => import("@/app/_components/_map-component/MapView"), {
  ssr: false,
});

export default function HomePage() {
  const router = useRouter();
  const mapRef = useRef<any>(null);

  const { user, initialized, bootstrapUser } = useCurrentUserStore();
  const categories = useCategoryStore((s) => s.categories);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);
  const pins = usePinStore((s) => s.pins);
  const fetchPins = usePinStore((s) => s.fetchPins);

  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (!initialized) bootstrapUser();
  }, [initialized, bootstrapUser]);

  useEffect(() => {
    if (initialized && !user) router.replace("/login");
  }, [initialized, user, router]);

  const filter = "All";
  const visiblePins = Array.isArray(pins)
    ? filter === "All"
      ? pins
      : pins.filter((p) => p.category === filter)
    : [];

  useEffect(() => {
    if (initialized && user) {
      fetchCategories(user.email);
      fetchPins(user.email);
    }
  }, [initialized, user, fetchCategories, fetchPins]);

  if (!initialized) return null;
  
  const handleMapClick = (lat: number, lng: number) => {
    if (categories.length === 0) {
      showError("Please create at least one category from the sidebar first!");
      return;
    }

    setFormData({
      id: Date.now().toString(),
      name: "",
      description: "",
      lat,
      lng,
      category: categories[0].name,
      userId: user?.email || "",
    });
    setFormOpen(true);
  };

  return (
    <div className="app relative min-h-screen bg-zinc-900 text-white">
    <Sidebar mapRef={mapRef} />

      <MapView
        pins={pins}
        mapRef={mapRef}
        onMapClick={handleMapClick}
        onSelectPin={() => {}}
        openWalkthrough={() => {}}
      />

      {formOpen && formData && (
        <PinForm
          pin={formData}
          categories={categories}
          onSave={async (pin: any) => {
            setFormOpen(false);
            setFormData(null);
            usePinStore.setState({ pinForm: pin });
            await usePinStore.getState().savePin();
          }}
          onClose={() => {
            setFormOpen(false);
            setFormData(null);
          }}
        />
      )}
    </div>
  );
}