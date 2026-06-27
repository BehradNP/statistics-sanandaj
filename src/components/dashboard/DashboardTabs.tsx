"use client";

import { useMemo, useState } from "react";
import { FiBriefcase, FiUsers, FiLayers, FiMapPin } from "react-icons/fi";

type TabKey = "projects" | "contractors" | "organizations" | "regions";

type ProjectStatus = "فعال" | "تکمیل شده" | "در انتظار" | "متوقف";

const projects: {
  title: string;
  contractor: string;
  organization: string;
  region: string;
  status: ProjectStatus;
  progress: number;
}[] = [
  {
    title: "بهسازی معابر ناحیه ۱",
    contractor: "شرکت عمران کردستان",
    organization: "معاونت عمرانی",
    region: "ناحیه ۱",
    status: "فعال",
    progress: 65,
  },
  {
    title: "نورپردازی پارک ملت",
    contractor: "پیمانکار روشنایی سنندج",
    organization: "سازمان سیما و منظر",
    region: "ناحیه ۲",
    status: "در انتظار",
    progress: 20,
  },
  {
    title: "آسفالت خیابان ساحلی",
    contractor: "شرکت راه‌سازان غرب",
    organization: "منطقه ۲",
    region: "ناحیه ۲",
    status: "تکمیل شده",
    progress: 100,
  },
  {
    title: "ساماندهی تابلوهای شهری",
    contractor: "شرکت خدمات شهری",
    organization: "منطقه ۳",
    region: "ناحیه ۳",
    status: "متوقف",
    progress: 40,
  },
];

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    فعال: "bg-emerald-100 text-emerald-700",
    "تکمیل شده": "bg-blue-100 text-blue-700",
    "در انتظار": "bg-orange-100 text-orange-700",
    متوقف: "bg-rose-100 text-rose-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${styles[status]}`}>
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[12px] font-bold text-slate-700 min-w-10">
        {value}٪
      </span>
      <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#2f7f86]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ProjectsTab() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200">
        <h2 className="text-[14px] font-extrabold text-slate-900">
          آخرین پروژه‌های ثبت‌شده
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="text-[12px] text-slate-700 bg-slate-50">
              <th className="px-4 py-3 font-bold">عنوان پروژه</th>
              <th className="px-4 py-3 font-bold">پیمانکار</th>
              <th className="px-4 py-3 font-bold">سازمان / واحد</th>
              <th className="px-4 py-3 font-bold">منطقه</th>
              <th className="px-4 py-3 font-bold">وضعیت</th>
              <th className="px-4 py-3 font-bold min-w-[180px]">پیشرفت</th>
            </tr>
          </thead>

          <tbody className="text-[13px] text-slate-900">
            {projects.map((project) => (
              <tr
                key={project.title}
                className="border-t border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-4 py-3 font-bold">{project.title}</td>
                <td className="px-4 py-3">{project.contractor}</td>
                <td className="px-4 py-3">{project.organization}</td>
                <td className="px-4 py-3">{project.region}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={project.status} />
                </td>
                <td className="px-4 py-3">
                  <ProgressBar value={project.progress} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function SimplePanel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-[15px] font-extrabold text-slate-900 mb-3">
        {title}
      </h2>
      <div className="text-[13px] leading-7 text-slate-600">{children}</div>
    </section>
  );
}

function ContractorsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <InfoCard title="پیمانکاران فعال" value="۱۸" />
      <InfoCard title="پروژه‌های واگذارشده" value="۴۶" />
      <InfoCard title="میانگین پیشرفت پروژه‌ها" value="۶۳٪" />
    </div>
  );
}

function OrganizationsTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <InfoCard title="واحدهای ثبت‌شده" value="۱۲" />
      <InfoCard title="بیشترین پروژه" value="معاونت عمرانی" />
      <InfoCard title="پروژه‌های فعال سازمانی" value="۳۴" />
    </div>
  );
}

function RegionsTab() {
  const regions = [
    { name: "ناحیه ۱", total: 24, active: 14 },
    { name: "ناحیه ۲", total: 18, active: 11 },
    { name: "ناحیه ۳", total: 15, active: 8 },
    { name: "ناحیه ۴", total: 9, active: 5 },
  ];

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <h2 className="text-[15px] font-extrabold text-slate-900 mb-5">
        پراکندگی پروژه‌ها بر اساس مناطق
      </h2>

      <div className="space-y-4">
        {regions.map((region) => (
          <div key={region.name}>
            <div className="flex items-center justify-between text-[13px] mb-2">
              <span className="font-bold text-slate-900">{region.name}</span>
              <span className="text-slate-600">
                {region.active} فعال از {region.total} پروژه
              </span>
            </div>

            <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2f7f86]"
                style={{ width: `${(region.active / region.total) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="text-[13px] font-semibold text-slate-500 mb-2">
        {title}
      </div>
      <div className="text-2xl font-extrabold text-slate-900">
        {value}
      </div>
    </div>
  );
}

export default function DashboardTabs() {
  const tabs = useMemo(
    () => [
      {
        key: "projects" as const,
        label: "وضعیت پروژه‌ها",
        icon: <FiBriefcase size={16} />,
      },
      {
        key: "contractors" as const,
        label: "پیمانکاران",
        icon: <FiUsers size={16} />,
      },
      {
        key: "organizations" as const,
        label: "سازمان‌ها",
        icon: <FiLayers size={16} />,
      },
      {
        key: "regions" as const,
        label: "اطلاعات مناطق",
        icon: <FiMapPin size={16} />,
      },
    ],
    []
  );

  const [active, setActive] = useState<TabKey>("projects");

  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 bg-[#163647]">
        <div className="flex flex-wrap items-center gap-2 justify-start">
          {tabs.map((tab) => {
            const isActive = active === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActive(tab.key)}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] transition cursor-pointer",
                  isActive
                    ? "bg-white text-[#163647] shadow-sm font-bold"
                    : "bg-transparent text-white/85 hover:bg-white/10",
                ].join(" ")}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4">
        {active === "projects" && <ProjectsTab />}
        {active === "contractors" && <ContractorsTab />}
        {active === "organizations" && <OrganizationsTab />}
        {active === "regions" && <RegionsTab />}
      </div>
    </section>
  );
}