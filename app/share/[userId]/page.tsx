"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import PinModal from "@/app/_components/PinModal";
import { pin as PinType } from "@/app/types";

const MapView = dynamic(() => import("@/app/_components/_map-component/MapView"), {
  ssr: false,
});

interface SharePin extends PinType {
  _id: string;
}

export default function SharePage() {
  const { userId } = useParams();
  const [pins, setPins] = useState<SharePin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPin, setSelectedPin] = useState<SharePin | null>(null);
  const [mapRef, setMapRef] = useState<any>(null);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await fetch(`/api/pins?userId=${userId}`);
        const data = await res.json();
        setPins((data.pins || []) as SharePin[]);
      } catch (err) {
        console.error("Failed to fetch pins:", err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchPins();
  }, [userId]);

  if (loading) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center text-white">
        Loading map...
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-zinc-900">
      <MapView
        pins={pins as any}
        mapRef={{ current: mapRef }}
        onSelectPin={(pin) => setSelectedPin(pin as SharePin)}
        onMapClick={() => {}}
        openWalkthrough={() => {}}
      />

      {selectedPin && (
        <PinModal pin={selectedPin as any} onClose={() => setSelectedPin(null)} />
      )}

      <div className="absolute top-4 left-4 z-400 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs">
        <p className="font-semibold text-sm">Shared Map</p>
        <p className="text-xs opacity-90 mt-1">View mode — Read-only</p>
      </div>
    </div>
  );
}
