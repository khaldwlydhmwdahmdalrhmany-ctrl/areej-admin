"use client";
import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, Package, Tags, Image as ImageIcon, ShoppingBag, LogOut, Settings, BarChart3 } from "lucide-react";

const C = { navy: "#0C1C77", teal: "#00C6C7", line: "#E1ECE8", slate: "#5C6B72", offWhite: "#F6FAF9", ink: "#0B1220" };

const NAV = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutGrid },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "التصنيفات", icon: Tags },
  { href: "/admin/banners", label: "البنرات", icon: ImageIcon },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/analytics", label: "التحليلات", icon: BarChart3 },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return children;

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div dir="rtl" className="min-h-screen flex" style={{ background: C.offWhite }}>
      <aside className="w-60 shrink-0 hidden sm:flex flex-col gap-1 p-4" style={{ background: "#fff", borderLeft: `1px solid ${C.line}` }}>
        <div className="font-display text-lg px-2 py-4" style={{ color: C.navy, fontWeight: 800 }}>
          أريج النقاء
          <div className="text-xs font-medium" style={{ color: C.slate }}>لوحة التحكم</div>
        </div>
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold"
              style={active ? { background: C.navy, color: "#fff" } : { color: C.ink }}
            >
              <item.icon size={16} /> {item.label}
            </Link>
          );
        })}
        <button onClick={logout} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold mt-auto" style={{ color: "#c05050" }}>
          <LogOut size={16} /> تسجيل الخروج
        </button>
      </aside>
      <main className="flex-1 p-4 sm:p-8 max-w-5xl">{children}</main>
    </div>
  );
}
