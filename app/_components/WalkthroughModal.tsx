"use client";

import { useEffect, useRef, useState } from "react";
import tourData from "@/data/tourData.json";
import { motion } from "framer-motion";
import {WalkthroughModalProps} from "@/app/types"
import { markTourAsSeen } from "@/utils/storage/walkthrough.storage";

export default function WalkthroughModal({ onClose }: WalkthroughModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const step = tourData[currentStep];

  useEffect(() => {
    tourData.forEach(s => {
      const v = document.createElement("video");
      v.src = s.video;
      v.preload = "auto";
    });
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < tourData.length - 1) {
      setCurrentStep(p => p + 1);
    } else {
      markTourAsSeen();
      onClose();
    }
  };


  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(p => p - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="w-[92%] max-w-md overflow-hidden rounded-2xl text-white bg-black/30 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-white/30"
      >
        <div className="relative">
          <video
            ref={videoRef}
            src={step.video}
            autoPlay
            muted
            playsInline
            className="w-full h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-5"
        >
          <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
          <ul className="text-sm mb-5 space-y-2 list-disc list-inside text-gray-200">
                {step.points.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
          </ul>


          <div className="flex justify-center gap-2 mb-5">
            {tourData.map((_, i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full transition-all ${
                  i === currentStep ? "bg-green-600 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-sm text-blue-400 transition"
            >
              Skip tour
            </button>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-all ${
                  currentStep === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-800 text-white"
                }`}
              >
                Prev
              </button>

              <button
                onClick={handleNext}
                className="px-5 py-2 text-sm rounded-full font-medium text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all"
              >
                {currentStep === tourData.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
