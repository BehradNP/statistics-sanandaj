// src/app/(dashboard)/dashboard/page.tsx
import StatCard from "@/components/dashboard/StatCard";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import { FaProjectDiagram, FaCheckCircle, FaClipboardList, FaClock } from "react-icons/fa";

export default function DashboardPage() {
  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="تعداد کل پروژه‌ها" value={128} icon={<FaProjectDiagram />} tone="blue" />
        <StatCard title="پروژه‌های فعال" value={76} icon={<FaCheckCircle />} tone="green" />
        <StatCard title="پروژه‌های تکمیل‌شده" value={32} icon={<FaClipboardList />} tone="purple" />
        <StatCard title="پروژه‌های در انتظار بررسی" value={20} icon={<FaClock />} tone="orange" />
      </div>

      {/* Dashboard Tabs */}
      <DashboardTabs />
    </div>
  );
}