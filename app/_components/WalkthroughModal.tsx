"use client";

import { useEffect, useState } from "react";
import { WalkthroughModalProps } from "@/app/types";

type Step = {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  points?: string[];
};

export default function WalkthroughModal({ onClose }: WalkthroughModalProps) {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const fetchWalkthroughs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/walkthroughs", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch walkthroughs");

        const json = await res.json();
        const list = json.walkthroughs ?? [];

        if (!active) return;

        if (!list.length) {
          setError("No walkthrough data found");
          setSteps([]);
          return;
        }

        setSteps(
          list.map((s: any) => ({
            ...s,
            points: s.description
              ? s.description.split(",").map((p: string) => p.trim())
              : [],
          }))
        );
      } catch (err) {
        console.error(err);
        if (active) setError("Something went wrong");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchWalkthroughs();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 text-white">
        Loading walkthrough...
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 text-white">
        <div className="bg-black/80 p-6 rounded-xl text-center">
          <p className="mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!steps.length) return null;

  const step = steps[currentStep];

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((p) => p + 1);
    else onClose();
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-[92%] max-w-md rounded-2xl bg-black/80 text-white overflow-hidden">


        <div className="h-52 bg-black flex items-center justify-center">
          {step.videoUrl ? (
            <video
              src={step.videoUrl}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              className="w-full h-full object-contain bg-black"
              onError={(e) => console.error("Video load error", e)}
            />

          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              No video available
            </div>
          )}
        </div>



        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

          {step.points?.length > 0 && (
            <ul className="text-sm list-disc list-inside text-gray-300 mb-4">
              {step.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}


          <div className="flex justify-between items-center">
            <button onClick={onClose} className="text-blue-400 cursor-pointer">
              Skip
            </button>

            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={currentStep === 0}
                className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50 cursor-pointer"
              >
                Prev
              </button>

              <button
                onClick={next}
                className="px-4 py-1 bg-green-600 rounded cursor-pointer"
              >
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
