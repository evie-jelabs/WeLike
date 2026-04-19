"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Radio,
  DollarSign,
  LayoutGrid,
  Settings,
  LogOut,
  ChevronRight,
  Box,
  Newspaper,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, productContext, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isWorkspaceActive = pathname === "/workspace";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-surface-800 flex flex-col flex-shrink-0 bg-surface-950">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-surface-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center flex-shrink-0">
              <span className="text-black font-bold text-sm">W</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">WeLike</p>
              <p className="text-[11px] text-surface-500 truncate">GTM Workspace for AI Products</p>
            </div>
          </div>
        </div>

        {/* Current Project */}
        <div className="px-4 pt-5 pb-2">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-surface-500 mb-3">
            Current Project
          </p>
          {productContext ? (
            <Link
              href="/onboarding"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-200 hover:text-white hover:bg-surface-800 transition-colors"
            >
              <div className="h-7 w-7 rounded-md bg-brand-500 flex items-center justify-center flex-shrink-0">
                <span className="text-black font-bold text-xs">
                  {productContext.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="flex-1 truncate font-medium">{productContext.name}</span>
              <ChevronRight className="h-4 w-4 text-surface-600" />
            </Link>
          ) : (
            <Link
              href="/onboarding"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
            >
              <span className="text-brand-500 font-medium">+ Add your product</span>
            </Link>
          )}
        </div>

        {/* GTM Workspace */}
        <div className="px-4 py-2">
          <Link
            href="/workspace"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isWorkspaceActive
                ? "bg-brand-500/10 text-brand-500"
                : "text-surface-400 hover:text-white hover:bg-surface-800"
            )}
          >
            <LayoutGrid className="h-4 w-4 flex-shrink-0" />
            <span className="flex-1 truncate">GTM Workspace</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="px-5 py-2">
          <div className="border-t border-surface-800" />
        </div>

        {/* Toolkit and Playbook */}
        <div className="px-4 flex-1 overflow-y-auto">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-widest text-surface-500 mb-3">
            Toolkit and Playbook
          </p>
          <div className="space-y-1">
            {[
              { href: "/tools/social-listening", label: "Social Listening", icon: Radio },
              { href: "/tools/kol-pricer", label: "KOL Pricer", icon: DollarSign },
              { href: "/tools/news", label: "AI News", icon: Newspaper },
            ].map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-brand-500/10 text-brand-500"
                      : "text-surface-400 hover:text-white hover:bg-surface-800"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User footer */}
        <div className="px-4 py-4 border-t border-surface-800 space-y-1">
          <Link
            href="/onboarding"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
          >
            <Box className="h-4 w-4" />
            Product Settings
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-400 hover:text-white hover:bg-surface-800 transition-colors"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <button
            onClick={async () => {
              await logout();
              router.push("/");
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-surface-400 hover:text-red-400 hover:bg-surface-800 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
