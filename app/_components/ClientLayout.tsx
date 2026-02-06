"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUserStore } from "@/stores/appStore";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useCurrentUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-900 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    // user not logged in, redirecting
    return null;
  }

  return <>{children}</>;
}
