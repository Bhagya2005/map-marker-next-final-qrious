"use client";

import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
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

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await fetch("/api/walkthroughs", { cache: "no-store" });
        const data = await res.json();

        if (!active || !Array.isArray(data)) return;

        setSteps(
          data.map((s) => ({
            ...s,
            points: s.description
              ? s.description.split(",").map((p: string) => p.trim())
              : [],
          }))
        );
      } catch (e) {
        console.error("Walkthrough fetch failed", e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 text-white">
        Loading tour...
      </div>
    );
  }

  if (!steps.length) return null;

  const step = steps[currentStep];
  const hasVideo = Boolean(step.videoUrl);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((p) => p + 1);
    } else {
      onClose();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="w-[92%] max-w-md rounded-2xl bg-black/80 text-white overflow-hidden">
        <div className="h-52 bg-black flex items-center justify-center">
          {hasVideo ? (
            <ReactPlayer
              key={step._id}
              url={step.videoUrl}
              width="100%"
              height="100%"
              controls
              playing={false}
            />
          ) : (
            <span className="text-gray-400">No video</span>
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

          <div className="flex justify-between">
            <button onClick={onClose} className="text-blue-400">
              Skip
            </button>

            <div className="flex gap-2">
              <button
                onClick={prev}
                disabled={currentStep === 0}
                className="px-3 py-1 bg-gray-600 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                onClick={next}
                className="px-4 py-1 bg-green-600 rounded"
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

