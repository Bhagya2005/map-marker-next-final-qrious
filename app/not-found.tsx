"use client";

import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>

      <p className="mt-2 text-gray-500">
        <span className="font-mono text-red-500">{pathname}</span> is not available
      </p>

      <p className="mt-4 text-sm text-gray-400">
        Please check the URL or go back home
      </p>
      
    </div>
  );
}
