"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import type { Role } from "@/types/api";

export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, role: currentRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (currentRole !== role) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, currentRole, role, router]);

  if (isLoading || !isAuthenticated || currentRole !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-text-secondary">
        جارٍ التحقق من الجلسة...
      </div>
    );
  }

  return <>{children}</>;
}
