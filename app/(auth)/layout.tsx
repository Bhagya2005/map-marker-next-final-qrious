//what I Learn 
// leading-relaxed- Increase line spacing 
// list-disc - Bullet points         
// list-inside - Bullet inside content 
// absolute - Absolute positioning  
// -inset-1 - Negative spacing      
// inset-0 - Fill parent           
// aspect-video -16:9 ratio            

"use client";

import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen px-4 overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
 
      <div className="relative z-10 w-full max-w-7xl  py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white/70">
            Map Marking Application
          </h1>

        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mt-0">
          <div className="order-2 md:order-1 flex flex-col gap-8">
            <div className="relative group">
              <div className="absolute bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

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
            {/* <ul className="text-gray-300  leading-relaxed list-disc list-inside space-y-2">
              <li>Custom category creation with color and icon support for personalized mapping.</li>
              <li>Map click–based pin creation with name and description, including update and delete options.</li>
              <li>category-based filtering and show-all pins functionality.</li>
              <li>Features such as zoom-in, fly-to markers, zoom to category, and map reset.</li>
              <li>marker popups with user information, timestamps, and smooth hover animations.</li>
              <li>Enhanced user experience with customizable light/dark map themes, user feedback system, and an interactive walkthrough.</li>
            </ul> */}
             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4   text-white">
                <div className="border border-white/10 rounded-xl p-3 flex items-center gap-2">
                  <p className="text-sm">Custom category creation with color and icon support.</p>
                </div>
              
                 <div className="border border-white/10 rounded-xl p-3 flex items-center gap-2">
                  <p className="text-sm">Map click–based pin creation with update and delete options.</p>
                </div>
              
                 <div className="border border-white/10 rounded-xl p-3 flex items-center gap-2">
                  <p className="text-sm">Category-based filtering and show-all pins functionality.</p>
                </div>
              
                 <div className="border border-white/10 rounded-xl p-3 flex items-center gap-2">
                  <p className="text-sm">Zoom-in, fly-to markers, zoom to category, and map reset features.</p>
                </div>
              
                <div className="border border-white/10 rounded-xl p-3 flex items-center gap-2">
                  <p className="text-sm">Marker popups with user info, timestamps, and smooth hover animations.</p>
                </div>
              
                 <div className="border border-white/10 rounded-xl p-3 flex items-center gap-2">
                  <p className="text-sm">Customizable light/dark map themes, feedback system, and walkthrough.</p>
                </div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}
