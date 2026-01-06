//What I Learn ?
//

"use client";

import { useEffect, useRef, useState } from "react";
import { ReadMoreModalProps } from "@/app/types";

export default function ReadMoreModal({id,name,description,category,color,lat,lng,onClose}: ReadMoreModalProps){
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (expanded) return;

    requestAnimationFrame(() => {
      const titleOverflow =
        titleRef.current!.scrollHeight > titleRef.current!.clientHeight;
      const descOverflow =
        descRef.current!.scrollHeight > descRef.current!.clientHeight;

      setShowToggle(titleOverflow || descOverflow);
    });
  }, [name, description, expanded]);

  return (
    <div className="fixed inset-0 z-[20000] flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 pt-10 sm:pt-0 overflow-auto min-h-screen text-white">
      <div className="w-full sm:max-w-xl bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
        <div className="relative p-4 sm:p-5 flex justify-between items-start" style={{ borderTop: `6px solid ${color}` }}>
          <div className="flex gap-3 items-start w-full">
            <div className="w-4 h-4 rounded-full mt-1 sm:mt-2 shrink-0 border" style={{ backgroundColor: color }}/>
              <h2 ref={titleRef} className="font-bold text-sm sm:text-xl text-gray-900 dark:text-white leading-snug break-words w-full"
                style={
                  expanded
                    ? {}
                    : {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }
                }
              >
                {name}
              </h2>
          </div>

          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-red-500 ml-2 sm:ml-0"
          >
            ✕
          </button>
        </div>
        <div className="px-4 sm:px-6 pb-6 max-h-[90vh] overflow-auto space-y-4">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full w-fit">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}/>
            <span className="font-medium text-gray-700 dark:text-gray-300">{category}</span>
          </div>
          <p ref={descRef} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words"
            style={
              expanded
                ? {}
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
            }
          >
            {description}
          </p>

          {showToggle && (
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline"
            >
              {expanded ? "Read less ↑" : "Read full details →"}
            </button>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">ID</p>
              <p className="font-medium break-all">{id}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Category Color</p>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: color }}
                />
                <span>{color}</span>
              </div>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Latitude</p>
              <p className="font-medium">{lat}</p>
            </div>

            <div>
              <p className="text-gray-500 dark:text-gray-400">Longitude</p>
              <p className="font-medium">{lng}</p>
            </div>
          </div>
        </div>
  </div>
</div>

  );
}
