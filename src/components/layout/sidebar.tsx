"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiBriefcase,
  FiUsers,
  FiLayers,
  FiFileText,
  FiSettings,
  FiShield,
  FiLogOut,
  FiHelpCircle,
  FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();

  const [baseOpen, setBaseOpen] = useState(true);

  return (
    <aside
      className="
        h-[calc(100vh-2rem)] w-[260px] shrink-0
        my-4 mr-4
        flex flex-col justify-between
        rounded-3xl
        text-white px-5 py-5
        overflow-hidden
      "
      style={{
        background: "linear-gradient(180deg, #2f7f86 0%, #163647 100%)",
      }}
    >
      {/* TOP / Logo */}
      <div>
        <div className="flex flex-col items-center gap-3 mb-8">
<div className="h-20 w-20 rounded-3xl flex items-center justify-center bg-transparent">
  <img
    src="/LOGO/LogoSanandaj.png" // مسیر لوگوی خودت
    alt="شهرداری سنندج"
    className="w-full h-full object-contain"
  />
</div>

          <div className="text-center">
            <div className="text-[15px] font-extrabold">شهرداری سنندج</div>
            <div className="text-[12px] opacity-80 mt-1">سامانه آمار و عملکرد</div>
          </div>
        </div>

        {/* MAIN MENU */}
        <nav className="mt-8 space-y-1.5 text-[13px]">
          <MenuItem
            icon={<FiHome size={18} />}
            title="صفحه اصلی"
            href="/dashboard"
            active={isActive(pathname, "/dashboard")}
            primary
          />

          {/* اطلاعات پایه */}
          <GroupButton
            title="اطلاعات پایه"
            icon={<FiLayers size={18} />}
            isOpen={baseOpen}
            onClick={() => setBaseOpen((v) => !v)}
          />
          <AnimatedSubMenu isOpen={baseOpen}>
            <SubMenuItem
              icon={<FiLayers size={16} />}
              title="تعریف بخش (سازمان)"
              href="/definition-of-organization"
              active={isActive(pathname, "/definition-of-organization")}
            />
            <SubMenuItem
              icon={<FiUsers size={16} />}
              title="تعریف پیمانکار"
              href="/definition-of-contractor"
              active={isActive(pathname, "/definition-of-contractor")}
            />
            <SubMenuItem
              icon={<FiFileText size={16} />}
              title="تعریف قالب"
              href="/defining-the-project-format"
              active={isActive(pathname, "/defining-the-project-format")}
            />
          </AnimatedSubMenu>

          <MenuItem
            icon={<FiBriefcase size={18} />}
            title="پروژه‌ها"
            href="/projects"
            active={isActive(pathname, "/projects")}
          />

          <MenuItem
            icon={<FiUsers size={18} />}
            title="ارجاع پروژه به پیمانکار"
            href="/contractor-reference"
            active={isActive(pathname, "/contractor-reference")}
          />

          <MenuItem
            icon={<FiFileText size={18} />}
            title="گزارشات"
            href="/reports"
            active={isActive(pathname, "/reports")}
          />
        </nav>
      </div>

      {/* BOTTOM / ADMIN */}
      <div className="space-y-2 border-t border-white/20 pt-3 text-[12px]">
        <p className="opacity-70">ادمین</p>

        <BottomItem
          icon={<FiSettings size={16} />}
          label="تنظیمات"
          href="/settings"
          active={isActive(pathname, "/settings")}
        />

        <BottomItem
          icon={<FiShield size={16} />}
          label="حساب کاربری و امنیت"
          href="/security"
          active={isActive(pathname, "/security")}
        />

        <button
          type="button"
          className="
            w-full flex items-center gap-2.5
            px-3 py-2 rounded-lg
            hover:bg-white/10 transition
            text-red-200
          "
        >
          <FiLogOut size={16} />
          خروج از حساب
        </button>
      </div>
    </aside>
  );
}

/* ====================== COMPONENTS ====================== */

function MenuItem({
  icon,
  title,
  href,
  active,
  primary,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  active?: boolean;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition cursor-pointer select-none",
        active && primary
          ? "bg-white text-[#163647] font-semibold shadow-sm"
          : active
          ? "bg-white/15 text-white font-semibold"
          : "hover:bg-white/10",
      ].join(" ")}
    >
      <span className="flex items-center gap-2.5">
        {icon}
        <span>{title}</span>
      </span>
    </Link>
  );
}

function GroupButton({
  title,
  icon,
  isOpen,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="
        w-full flex items-center justify-between
        px-3.5 py-2.5 rounded-xl
        hover:bg-white/10 transition
        cursor-pointer select-none
      "
    >
      <span className="flex items-center gap-2.5">
        {icon}
        <span>{title}</span>
      </span>

      <FiChevronDown
        size={14}
        className={`opacity-80 transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

function AnimatedSubMenu({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-hidden transition-all duration-300"
      style={{
        maxHeight: isOpen ? "220px" : "0px",
        opacity: isOpen ? 1 : 0,
      }}
    >
      <div className="mt-1 space-y-1 pr-2">{children}</div>
    </div>
  );
}

function SubMenuItem({
  icon,
  title,
  href,
  active,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "w-full flex items-center justify-between px-3 py-2 rounded-xl transition text-[12.5px]",
        active ? "bg-white/15" : "hover:bg-white/10",
      ].join(" ")}
    >
      <span className="flex items-center gap-2.5 opacity-95">
        {icon}
        <span>{title}</span>
      </span>
    </Link>
  );
}

function BottomItem({
  icon,
  label,
  href,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition",
        active ? "bg-white/15" : "hover:bg-white/10",
      ].join(" ")}
    >
      {icon}
      {label}
    </Link>
  );
}