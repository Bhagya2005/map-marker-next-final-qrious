"use client";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen px-4 overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-7xl mx-auto py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white/50">
            MAP MARKING
          </h1>

        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 flex flex-col gap-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

              <div className="relative w-full aspect-video rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
                <Image
                  src="/images/demo.png"
                  alt="Map preview"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <ul className="text-gray-300 text-sm leading-relaxed list-disc list-inside space-y-2">
              <li>Custom category creation with color and icon support for personalized mapping.</li>
              <li>Map click–based pin creation with name and description, including update and delete options.</li>
              <li>Dynamic category management with category-based filtering and show-all pins functionality.</li>
              <li>Advanced navigation features such as zoom-in, fly-to markers, zoom to category, and map reset.</li>
              <li>Interactive marker popups with user information, timestamps, and smooth hover animations.</li>
              <li>Enhanced user experience with customizable light/dark map themes, user feedback system, and an interactive walkthrough.</li>
            </ul>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}