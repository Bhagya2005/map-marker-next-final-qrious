"use client";

import { useEffect, useRef, useState } from "react";
// import MapView from "./_components/MapView";
import Sidebar from "./_components/Sidebar";
import PinForm from "./_components/PinForm";
import { pin, Category } from "./types";
import type { Map as LeafletMap } from "leaflet";
import { useRouter } from "next/navigation";
import {getCurrentUser,getUserPins,saveUserPins,getUserCategories, saveUserCategories} from "./../utils/storage";
import dynamic from "next/dynamic";
const MapView = dynamic(() => import("./_components/MapView"), {
  ssr: false,
});

export default function HomePage() {
  const router = useRouter();
  const mapRef = useRef<LeafletMap | null>(null);
  const [user, setUser] = useState<any>(null);
  const [pins, setPins] = useState<pin[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPin, setSelectedPin] = useState<pin | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState<pin | null>(null);
  const [filter, setFilter] = useState("All");
  const [cursorLocation, setCursorLocation] = useState<any>(null);

  useEffect(() => {
    if (user) saveUserPins(user.email, pins);
  }, [pins, user]);

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) router.push("/login");
    else {
      setUser(u);
      setPins(getUserPins(u.email));
      setCategories(getUserCategories(u.email));
    }
  }, [router]);

  useEffect(() => {
    if (user) saveUserCategories(user.email, categories);
  }, [categories, user]);

  if (!user) return null;

  const openForm = (pin: pin | null) => {
    setFormData(pin);
    setFormOpen(true);
  };

  const handleSavePin = (p: pin) => {
    const cat = categories.find(c => c.name === p.category);
    
    if (!cat) {
      alert("Please select a valid category");
      return;
    }

    const finalPin:pin = {
      ...p,
      color: cat.color, 
      userId: user.email,
    };

    setPins(prev =>
      prev.some(x => x.id === p.id)
        ? prev.map(x => (x.id === p.id ? finalPin : x))
        : [...prev, finalPin]
    );

    setFormOpen(false);
    setFormData(null);
  };

  const handleDeleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.name !== name));
    setPins(prev => prev.filter(p => p.category !== name));

    if (filter === name) setFilter("All");
  };

  const filteredPins =
    filter === "All"
      ? pins
      : pins.filter(p => p.category === filter);

  return (
    <div className="app">
      <Sidebar
        pins={filteredPins}
        selectedPin={selectedPin}
        onSelectPin={setSelectedPin}
        onDeletePin={(id) =>
          setPins(prev => prev.filter(p => p.id !== id))
        }
        onEditPin={openForm}
        filter={filter}
        setFilter={setFilter}
        cursorLocation={cursorLocation}
        userEmail={user.email}
        categories={categories}
        onAddCategory={(c) =>
          setCategories(prev => [...prev, { ...c, userId: user.email }])
        }
        onDeleteCategory={handleDeleteCategory}
        mapRef={mapRef}
      />

      <MapView
        pins={filteredPins}
        mapRef={mapRef}
        setSelectedPin={setSelectedPin}
        onMapClick={(lat, lng) => {
            if (!categories || categories.length === 0) {
              alert("Please create a category first!");
              return; 
            }

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

        onMouseMove={(lat, lng) =>
          setCursorLocation({ lat, lng })
        }
      />

      {formOpen && formData && (
        <PinForm
          pin={formData}
          categories={categories}
          onSave={handleSavePin}
          onClose={() => setFormOpen(false)}
        />
      )}
    </div>
  );
}
