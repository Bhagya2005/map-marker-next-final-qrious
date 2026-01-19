"use client";

type TabType = "users" | "pins" | "feedbacks" | "walkthroughs" | "categories";

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menus = [
    { id: "users", label: "Users" },
    { id: "pins", label: "Map Pins" },
    { id: "feedbacks", label: "Feedbacks"},
    { id: "walkthroughs", label: "Walkthroughs"},
    { id: "categories", label: "Categories"},
  ];

  return (
    <div className="w-64 bg-zinc-900 border-r border-white/10 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white tracking-widest">ADMIN PANEL</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => setActiveTab(menu.id as TabType)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === menu.id 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
              : "text-zinc-400 hover:bg-white/5 hover:text-white"
            }`}
          >
          
            <span className="font-medium">{menu.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}