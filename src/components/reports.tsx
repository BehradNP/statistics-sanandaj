"use client";

import { useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import * as XLSX from "xlsx";
import {
  FiBarChart2,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiDownload,
  FiFileText,
  FiFilter,
  FiLayers,
  FiMapPin,
  FiPieChart,
  FiRefreshCw,
  FiSearch,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

type ProjectStatus = "در حال انجام" | "در انتظار" | "تکمیل شده" | "متوقف";

type ProjectReport = {
  id: number;
  title: string;
  organization: string;
  contractor: string;
  format: string;
  region: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  cost: number;
};

type ReportStats = {
  total: number;
  done: number;
  doing: number;
  waiting: number;
  stopped: number;
  avgProgress: number;
  totalCost: number;
};

const initialReports: ProjectReport[] = [
  {
    id: 1,
    title: "احداث پارک پشتیبان",
    organization: "شهرداری منطقه ۱",
    contractor: "تعیین نشده",
    format: "پروژه فضای سبز",
    region: "ناحیه ۱",
    status: "در انتظار",
    progress: 0,
    startDate: "1404/08/12",
    cost: 850000000,
  },
  {
    id: 2,
    title: "ترمیم آسفالت محله فاطمیان",
    organization: "شهرداری منطقه ۲",
    contractor: "شرکت راه‌سازان غرب",
    format: "پروژه عمرانی",
    region: "ناحیه ۲",
    status: "در حال انجام",
    progress: 62,
    startDate: "1404/08/12",
    cost: 1250000000,
  },
  {
    id: 3,
    title: "روشنایی معابر جاده ساحلی",
    organization: "شهرداری منطقه ۳",
    contractor: "پیمانکار روشنایی سنندج",
    format: "پروژه خدمات شهری",
    region: "ناحیه ۳",
    status: "تکمیل شده",
    progress: 100,
    startDate: "1404/08/12",
    cost: 620000000,
  },
  {
    id: 4,
    title: "ساماندهی تابلوهای شهری",
    organization: "سازمان سیما و منظر",
    contractor: "شرکت خدمات شهری",
    format: "پروژه خدمات شهری",
    region: "ناحیه ۴",
    status: "متوقف",
    progress: 40,
    startDate: "1404/08/15",
    cost: 410000000,
  },
  {
    id: 5,
    title: "بهسازی معابر شهرک بهاران",
    organization: "شهرداری منطقه ۱",
    contractor: "شرکت عمران کردستان",
    format: "پروژه عمرانی",
    region: "ناحیه ۱",
    status: "در حال انجام",
    progress: 74,
    startDate: "1404/09/01",
    cost: 980000000,
  },
  {
    id: 6,
    title: "زیباسازی ورودی شهر",
    organization: "سازمان سیما و منظر",
    contractor: "شرکت توسعه عمران غرب",
    format: "پروژه فضای سبز",
    region: "ناحیه ۳",
    status: "در حال انجام",
    progress: 48,
    startDate: "1404/09/06",
    cost: 760000000,
  },
];

const statuses: ("همه" | ProjectStatus)[] = [
  "همه",
  "در حال انجام",
  "در انتظار",
  "تکمیل شده",
  "متوقف",
];

export default function Reports() {
  const pdfRef = useRef<HTMLDivElement | null>(null);

  const [reports, setReports] = useState<ProjectReport[]>(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"همه" | ProjectStatus>(
    "همه"
  );
  const [organizationFilter, setOrganizationFilter] = useState("همه");
  const [contractorFilter, setContractorFilter] = useState("همه");

  const organizations = useMemo(() => {
    return [
      "همه",
      ...Array.from(new Set(reports.map((item) => item.organization))),
    ];
  }, [reports]);

  const contractors = useMemo(() => {
    return [
      "همه",
      ...Array.from(new Set(reports.map((item) => item.contractor))),
    ];
  }, [reports]);

  const filteredReports = useMemo(() => {
    const q = search.trim();

    return reports.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.includes(q) ||
        item.organization.includes(q) ||
        item.contractor.includes(q) ||
        item.format.includes(q) ||
        item.region.includes(q);

      const matchesStatus =
        statusFilter === "همه" || item.status === statusFilter;

      const matchesOrganization =
        organizationFilter === "همه" ||
        item.organization === organizationFilter;

      const matchesContractor =
        contractorFilter === "همه" || item.contractor === contractorFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesOrganization &&
        matchesContractor
      );
    });
  }, [reports, search, statusFilter, organizationFilter, contractorFilter]);

  const stats = useMemo<ReportStats>(() => {
    const total = filteredReports.length;

    const done = filteredReports.filter(
      (item) => item.status === "تکمیل شده"
    ).length;

    const doing = filteredReports.filter(
      (item) => item.status === "در حال انجام"
    ).length;

    const waiting = filteredReports.filter(
      (item) => item.status === "در انتظار"
    ).length;

    const stopped = filteredReports.filter(
      (item) => item.status === "متوقف"
    ).length;

    const avgProgress =
      filteredReports.reduce((sum, item) => sum + item.progress, 0) /
      (filteredReports.length || 1);

    const totalCost = filteredReports.reduce(
      (sum, item) => sum + item.cost,
      0
    );

    return {
      total,
      done,
      doing,
      waiting,
      stopped,
      avgProgress: Math.round(avgProgress),
      totalCost,
    };
  }, [filteredReports]);

  const statusChartData = useMemo(
    () => [
      { label: "در حال انجام", value: stats.doing, tone: "green" as const },
      { label: "در انتظار", value: stats.waiting, tone: "orange" as const },
      { label: "تکمیل شده", value: stats.done, tone: "blue" as const },
      { label: "متوقف", value: stats.stopped, tone: "rose" as const },
    ],
    [stats]
  );

  const organizationReport = useMemo(() => {
    return organizations
      .filter((item) => item !== "همه")
      .map((org) => {
        const items = filteredReports.filter(
          (project) => project.organization === org
        );

        const avg =
          items.reduce((sum, project) => sum + project.progress, 0) /
          (items.length || 1);

        return {
          name: org,
          count: items.length,
          avg: Math.round(avg),
          cost: items.reduce((sum, project) => sum + project.cost, 0),
        };
      });
  }, [organizations, filteredReports]);

  const contractorReport = useMemo(() => {
    return contractors
      .filter((item) => item !== "همه")
      .map((contractor) => {
        const items = filteredReports.filter(
          (project) => project.contractor === contractor
        );

        const avg =
          items.reduce((sum, project) => sum + project.progress, 0) /
          (items.length || 1);

        return {
          name: contractor,
          count: items.length,
          avg: Math.round(avg),
        };
      });
  }, [contractors, filteredReports]);

  const regionReport = useMemo(() => {
    const regions = Array.from(
      new Set(filteredReports.map((item) => item.region))
    );

    return regions.map((region) => {
      const items = filteredReports.filter(
        (project) => project.region === region
      );

      return {
        name: region,
        count: items.length,
        done: items.filter((project) => project.status === "تکمیل شده")
          .length,
        active: items.filter((project) => project.status === "در حال انجام")
          .length,
      };
    });
  }, [filteredReports]);

  const resetFilters = () => {
    setReports(initialReports);
    setSearch("");
    setStatusFilter("همه");
    setOrganizationFilter("همه");
    setContractorFilter("همه");
  };

  const exportExcel = () => {
    const workbook = XLSX.utils.book_new();

    const summarySheet = XLSX.utils.json_to_sheet([
      { عنوان: "کل پروژه‌ها", مقدار: stats.total },
      { عنوان: "پروژه‌های در حال انجام", مقدار: stats.doing },
      { عنوان: "پروژه‌های در انتظار", مقدار: stats.waiting },
      { عنوان: "پروژه‌های تکمیل‌شده", مقدار: stats.done },
      { عنوان: "پروژه‌های متوقف", مقدار: stats.stopped },
      { عنوان: "میانگین پیشرفت", مقدار: `${stats.avgProgress}%` },
      { عنوان: "مجموع هزینه", مقدار: stats.totalCost },
    ]);

    const detailsSheet = XLSX.utils.json_to_sheet(
      filteredReports.map((item, index) => ({
        ردیف: index + 1,
        "عنوان پروژه": item.title,
        سازمان: item.organization,
        پیمانکار: item.contractor,
        "قالب پروژه": item.format,
        منطقه: item.region,
        وضعیت: item.status,
        "درصد پیشرفت": `${item.progress}%`,
        "تاریخ شروع": item.startDate,
        هزینه: item.cost,
      }))
    );

    const organizationSheet = XLSX.utils.json_to_sheet(
      organizationReport.map((item) => ({
        سازمان: item.name,
        "تعداد پروژه": item.count,
        "میانگین پیشرفت": `${item.avg}%`,
        "مجموع هزینه": item.cost,
      }))
    );

    const contractorSheet = XLSX.utils.json_to_sheet(
      contractorReport.map((item) => ({
        پیمانکار: item.name,
        "تعداد پروژه": item.count,
        "میانگین پیشرفت": `${item.avg}%`,
      }))
    );

    const regionSheet = XLSX.utils.json_to_sheet(
      regionReport.map((item) => ({
        منطقه: item.name,
        "تعداد پروژه": item.count,
        "پروژه‌های فعال": item.active,
        "پروژه‌های تکمیل‌شده": item.done,
      }))
    );

    XLSX.utils.book_append_sheet(workbook, summarySheet, "خلاصه گزارش");
    XLSX.utils.book_append_sheet(workbook, detailsSheet, "جزئیات پروژه‌ها");
    XLSX.utils.book_append_sheet(workbook, organizationSheet, "سازمان‌ها");
    XLSX.utils.book_append_sheet(workbook, contractorSheet, "پیمانکاران");
    XLSX.utils.book_append_sheet(workbook, regionSheet, "مناطق");

    XLSX.writeFile(workbook, "گزارشات-شهرداری-سنندج.xlsx");
  };

  const exportPdf = async () => {
    if (!pdfRef.current) return;

    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default ?? html2pdfModule;

    await html2pdf()
      .set({
        margin: 8,
        filename: "گزارشات-شهرداری-سنندج.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "landscape",
        },
      })
      .from(pdfRef.current)
      .save();
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute left-0 top-0 h-full w-72 bg-gradient-to-r from-[#2f7f86]/15 to-transparent" />

          <div className="relative flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
                <FiBarChart2 size={27} />
              </div>

              <div>
                <h1 className="text-[24px] font-extrabold text-slate-950">
                  گزارشات و آمار
                </h1>

                <p className="mt-1 text-[13px] font-semibold text-slate-500">
                  گزارش کامل پروژه‌ها، سازمان‌ها، پیمانکاران، مناطق و وضعیت
                  اجرایی پروژه‌ها
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={exportPdf}
                className="
                  flex h-12 items-center gap-2 rounded-2xl
                  border border-slate-200 bg-white px-5
                  text-[13px] font-extrabold text-slate-700
                  transition hover:bg-slate-50
                "
              >
                <FiFileText size={18} />
                خروجی PDF
              </button>

              <button
                type="button"
                onClick={exportExcel}
                className="
                  flex h-12 items-center gap-2 rounded-2xl
                  bg-[#2f7f86] px-5
                  text-[13px] font-extrabold text-white
                  shadow-sm transition hover:bg-[#256d73]
                "
              >
                <FiDownload size={18} />
                خروجی اکسل
              </button>
            </div>
          </div>
        </section>

        {/* Main KPI */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ReportStatCard
            title="کل پروژه‌ها"
            value={stats.total}
            caption="بر اساس فیلترهای فعلی"
            icon={<FiBriefcase size={22} />}
            tone="blue"
          />

          <ReportStatCard
            title="میانگین پیشرفت"
            value={`${stats.avgProgress}٪`}
            caption="میانگین کل پروژه‌ها"
            icon={<FiTrendingUp size={22} />}
            tone="green"
          />

          <ReportStatCard
            title="پروژه‌های تکمیل‌شده"
            value={stats.done}
            caption="پروژه‌های پایان‌یافته"
            icon={<FiCheckCircle size={22} />}
            tone="purple"
          />

          <ReportStatCard
            title="بودجه / هزینه کل"
            value={formatMoney(stats.totalCost)}
            caption="مجموع هزینه پروژه‌ها"
            icon={<FiPieChart size={22} />}
            tone="orange"
          />
        </section>

        {/* Filters */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-[14px] font-extrabold text-slate-900">
            <FiFilter size={18} />
            فیلتر گزارشات
          </div>

          <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
            <div className="relative">
              <FiSearch
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در پروژه، سازمان، پیمانکار..."
                className="
                  h-12 w-full rounded-2xl border border-slate-200
                  bg-slate-50 pr-11 pl-4
                  text-[13px] font-semibold text-slate-700
                  outline-none transition
                  placeholder:text-slate-400
                  focus:border-[#2f7f86] focus:bg-white
                  focus:ring-4 focus:ring-[#2f7f86]/10
                "
              />
            </div>

            <FilterSelectBox
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as "همه" | ProjectStatus)
              }
              options={statuses}
              prefix="وضعیت"
            />

            <FilterSelectBox
              value={organizationFilter}
              onChange={setOrganizationFilter}
              options={organizations}
              prefix="سازمان"
            />

            <FilterSelectBox
              value={contractorFilter}
              onChange={setContractorFilter}
              options={contractors}
              prefix="پیمانکار"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="
                flex h-11 items-center gap-2 rounded-2xl
                border border-slate-200 bg-white px-4
                text-[12px] font-extrabold text-slate-700
                transition hover:bg-slate-50
              "
            >
              <FiRefreshCw size={17} />
              بازیابی فیلترها
            </button>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <PanelCard
            title="گزارش وضعیت پروژه‌ها"
            subtitle="تعداد پروژه‌ها بر اساس وضعیت اجرایی"
            icon={<FiPieChart size={20} />}
          >
            <StatusReportBars data={statusChartData} total={stats.total} />
          </PanelCard>

          <PanelCard
            title="گزارش عملکرد سازمان‌ها"
            subtitle="تعداد پروژه و میانگین پیشرفت هر سازمان"
            icon={<FiLayers size={20} />}
          >
            <OrganizationPerformance data={organizationReport} />
          </PanelCard>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <PanelCard
            title="گزارش پیمانکاران"
            subtitle="تعداد پروژه‌های هر پیمانکار و میانگین پیشرفت"
            icon={<FiUsers size={20} />}
          >
            <ContractorPerformance data={contractorReport} />
          </PanelCard>

          <PanelCard
            title="گزارش مناطق"
            subtitle="پراکندگی پروژه‌ها در نواحی مختلف"
            icon={<FiMapPin size={20} />}
          >
            <RegionReport data={regionReport} />
          </PanelCard>
        </section>

        {/* Details Table */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-extrabold text-slate-950">
                جزئیات کامل پروژه‌ها
              </h2>

              <p className="mt-1 text-[12px] font-semibold text-slate-500">
                نمایش کامل اطلاعات پروژه‌ها، سازمان، پیمانکار، وضعیت، پیشرفت و
                هزینه
              </p>
            </div>

            <div className="rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[12px] font-extrabold text-[#2f7f86]">
              {filteredReports.length} مورد
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-slate-50 text-[12px] text-slate-600">
                  <th className="w-[80px] px-5 py-4 font-extrabold">ردیف</th>

                  <th className="min-w-[240px] px-5 py-4 font-extrabold">
                    پروژه
                  </th>

                  <th className="min-w-[180px] px-5 py-4 font-extrabold">
                    سازمان
                  </th>

                  <th className="min-w-[180px] px-5 py-4 font-extrabold">
                    پیمانکار
                  </th>

                  <th className="min-w-[140px] px-5 py-4 font-extrabold">
                    منطقه
                  </th>

                  <th className="min-w-[140px] px-5 py-4 font-extrabold">
                    وضعیت
                  </th>

                  <th className="min-w-[180px] px-5 py-4 font-extrabold">
                    پیشرفت
                  </th>

                  <th className="min-w-[160px] px-5 py-4 font-extrabold">
                    هزینه
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((project, index) => (
                  <tr
                    key={project.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-[13px] font-extrabold text-slate-700">
                        {index + 1}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-extrabold text-slate-950">
                        {project.title}
                      </div>

                      <div className="mt-1 text-[11px] font-semibold text-slate-400">
                        قالب: {project.format}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-[13px] font-bold text-slate-700">
                      {project.organization}
                    </td>

                    <td className="px-5 py-4 text-[13px] font-bold text-slate-700">
                      {project.contractor}
                    </td>

                    <td className="px-5 py-4 text-[13px] font-bold text-slate-700">
                      {project.region}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={project.status} />
                    </td>

                    <td className="px-5 py-4">
                      <ProgressBar value={project.progress} />
                    </td>

                    <td className="px-5 py-4 text-[13px] font-extrabold text-slate-800">
                      {formatMoney(project.cost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                  <FiFileText size={28} />
                </div>

                <h3 className="mt-4 text-[15px] font-extrabold text-slate-800">
                  گزارشی پیدا نشد
                </h3>

                <p className="mt-2 text-[13px] font-semibold text-slate-500">
                  فیلترها را تغییر دهید تا گزارشات بیشتری نمایش داده شود.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Hidden PDF Content */}
      <div
        ref={pdfRef}
        dir="rtl"
        className="fixed -right-[9999px] top-0 w-[1120px] bg-white p-8 text-slate-900"
      >
        <PdfReportContent
          reports={filteredReports}
          stats={stats}
          organizationReport={organizationReport}
          contractorReport={contractorReport}
          regionReport={regionReport}
        />
      </div>
    </>
  );
}

/* ========================= UI COMPONENTS ========================= */

function FilterSelectBox({
  value,
  onChange,
  options,
  prefix,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  prefix: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          `
            relative flex h-12 w-full items-center justify-between
            rounded-2xl border bg-slate-50 px-4
            text-[13px] font-extrabold outline-none transition
          `,
          open
            ? "border-[#2f7f86] bg-white ring-4 ring-[#2f7f86]/10"
            : "border-slate-200 hover:border-slate-300",
        ].join(" ")}
      >
        <span className="truncate text-slate-700">
          {prefix}: {value}
        </span>

        <span
          className={[
            "flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm transition",
            open ? "rotate-180 text-[#2f7f86]" : "",
          ].join(" ")}
        >
          <FiChevronDown size={18} />
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[9998] cursor-default"
            tabIndex={-1}
          />

          <div
            className="
              absolute right-0 top-[58px] z-[9999]
              w-full overflow-hidden rounded-2xl
              border border-slate-200 bg-white
              shadow-2xl shadow-slate-900/10
            "
          >
            <div className="max-h-64 overflow-y-auto p-2">
              {options.map((option) => {
                const active = value === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={[
                      `
                        group flex w-full items-center justify-between
                        rounded-xl px-4 py-3 text-right
                        text-[13px] font-extrabold transition
                      `,
                      active
                        ? "bg-[#2f7f86]/10 text-[#2f7f86]"
                        : "text-slate-700 hover:bg-slate-50 hover:text-[#2f7f86]",
                    ].join(" ")}
                  >
                    <span>
                      {prefix}: {option}
                    </span>

                    <span
                      className={[
                        "h-2.5 w-2.5 rounded-full transition",
                        active
                          ? "bg-[#2f7f86]"
                          : "bg-slate-200 group-hover:bg-[#2f7f86]/40",
                      ].join(" ")}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ReportStatCard({
  title,
  value,
  caption,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  caption: string;
  icon: ReactNode;
  tone: "blue" | "green" | "purple" | "orange";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles[tone]}`}
        >
          {icon}
        </div>

        <div className="text-[26px] font-extrabold text-slate-950">
          {value}
        </div>
      </div>

      <div className="mt-4 text-[13px] font-extrabold text-slate-700">
        {title}
      </div>

      <div className="mt-1 text-[11px] font-bold text-slate-400">
        {caption}
      </div>
    </div>
  );
}

function PanelCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="text-[15px] font-extrabold text-slate-950">
            {title}
          </h2>

          <p className="mt-1 text-[12px] font-semibold text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
          {icon}
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  );
}

function StatusReportBars({
  data,
  total,
}: {
  data: {
    label: string;
    value: number;
    tone: "blue" | "green" | "orange" | "rose";
  }[];
  total: number;
}) {
  return (
    <div className="space-y-4">
      {data.map((item) => {
        const percent = total ? Math.round((item.value / total) * 100) : 0;

        return (
          <div key={item.label}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-slate-700">
                {item.label}
              </span>

              <span className="text-[12px] font-bold text-slate-500">
                {item.value} پروژه / {percent}٪
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${barColor(item.tone)}`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrganizationPerformance({
  data,
}: {
  data: { name: string; count: number; avg: number; cost: number }[];
}) {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.name} className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[13px] font-extrabold text-slate-900">
                {item.name}
              </div>

              <div className="mt-1 text-[11px] font-bold text-slate-400">
                {item.count} پروژه / هزینه: {formatMoney(item.cost)}
              </div>
            </div>

            <span className="rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[12px] font-extrabold text-[#2f7f86]">
              {item.avg}٪
            </span>
          </div>

          <ProgressBar value={item.avg} />
        </div>
      ))}
    </div>
  );
}

function ContractorPerformance({
  data,
}: {
  data: { name: string; count: number; avg: number }[];
}) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div
          key={item.name}
          className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
              <FiUsers size={18} />
            </div>

            <div>
              <div className="text-[13px] font-extrabold text-slate-900">
                {item.name}
              </div>

              <div className="mt-1 text-[11px] font-bold text-slate-400">
                {item.count} پروژه
              </div>
            </div>
          </div>

          <div className="text-[13px] font-extrabold text-[#2f7f86]">
            {item.avg}٪
          </div>
        </div>
      ))}
    </div>
  );
}

function RegionReport({
  data,
}: {
  data: { name: string; count: number; done: number; active: number }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {data.map((item) => (
        <div key={item.name} className="rounded-2xl bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-slate-900">
              <FiMapPin className="text-[#2f7f86]" size={17} />
              {item.name}
            </div>

            <span className="rounded-full bg-white px-3 py-1 text-[12px] font-bold text-slate-600">
              {item.count} پروژه
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-emerald-50 p-3 text-center">
              <div className="text-[18px] font-extrabold text-emerald-700">
                {item.active}
              </div>

              <div className="text-[11px] font-bold text-emerald-600">
                فعال
              </div>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-center">
              <div className="text-[18px] font-extrabold text-blue-700">
                {item.done}
              </div>

              <div className="text-[11px] font-bold text-blue-600">
                تکمیل‌شده
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    "در حال انجام": "bg-emerald-100 text-emerald-700",
    "در انتظار": "bg-orange-100 text-orange-700",
    "تکمیل شده": "bg-blue-100 text-blue-700",
    متوقف: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-10 text-[12px] font-extrabold text-[#2f7f86]">
        {value}٪
      </span>

      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#2f7f86]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

/* ========================= PDF COMPONENTS ========================= */

function PdfReportContent({
  reports,
  stats,
  organizationReport,
  contractorReport,
  regionReport,
}: {
  reports: ProjectReport[];
  stats: ReportStats;
  organizationReport: {
    name: string;
    count: number;
    avg: number;
    cost: number;
  }[];
  contractorReport: {
    name: string;
    count: number;
    avg: number;
  }[];
  regionReport: {
    name: string;
    count: number;
    done: number;
    active: number;
  }[];
}) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="mb-6 border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black">گزارشات شهرداری سنندج</h1>

        <p className="mt-2 text-sm text-slate-600">
          گزارش کامل پروژه‌ها، سازمان‌ها، پیمانکاران، مناطق و وضعیت اجرایی
        </p>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-3">
        <PdfStat title="کل پروژه‌ها" value={stats.total} />
        <PdfStat title="میانگین پیشرفت" value={`${stats.avgProgress}٪`} />
        <PdfStat title="تکمیل‌شده" value={stats.done} />
        <PdfStat title="هزینه کل" value={formatMoney(stats.totalCost)} />
      </div>

      <PdfSection title="خلاصه وضعیت پروژه‌ها">
        <div className="grid grid-cols-4 gap-3">
          <PdfStat title="در حال انجام" value={stats.doing} />
          <PdfStat title="در انتظار" value={stats.waiting} />
          <PdfStat title="تکمیل شده" value={stats.done} />
          <PdfStat title="متوقف" value={stats.stopped} />
        </div>
      </PdfSection>

      <PdfSection title="گزارش سازمان‌ها">
        <PdfSimpleTable
          headers={["سازمان", "تعداد پروژه", "میانگین پیشرفت", "هزینه"]}
          rows={organizationReport.map((item) => [
            item.name,
            item.count,
            `${item.avg}٪`,
            formatMoney(item.cost),
          ])}
        />
      </PdfSection>

      <PdfSection title="گزارش پیمانکاران">
        <PdfSimpleTable
          headers={["پیمانکار", "تعداد پروژه", "میانگین پیشرفت"]}
          rows={contractorReport.map((item) => [
            item.name,
            item.count,
            `${item.avg}٪`,
          ])}
        />
      </PdfSection>

      <PdfSection title="گزارش مناطق">
        <PdfSimpleTable
          headers={["منطقه", "تعداد پروژه", "فعال", "تکمیل‌شده"]}
          rows={regionReport.map((item) => [
            item.name,
            item.count,
            item.active,
            item.done,
          ])}
        />
      </PdfSection>

      <PdfSection title="جزئیات کامل پروژه‌ها">
        <PdfSimpleTable
          headers={[
            "ردیف",
            "پروژه",
            "سازمان",
            "پیمانکار",
            "منطقه",
            "وضعیت",
            "پیشرفت",
            "هزینه",
          ]}
          rows={reports.map((item, index) => [
            index + 1,
            item.title,
            item.organization,
            item.contractor,
            item.region,
            item.status,
            `${item.progress}٪`,
            formatMoney(item.cost),
          ])}
        />
      </PdfSection>
    </div>
  );
}

function PdfStat({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="text-xs font-bold text-slate-500">{title}</div>

      <div className="mt-1 text-lg font-black text-slate-950">{value}</div>
    </div>
  );
}

function PdfSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-6">
      <h2 className="mb-3 text-lg font-black text-slate-950">{title}</h2>
      {children}
    </section>
  );
}

function PdfSimpleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | number)[][];
}) {
  return (
    <table className="w-full border-collapse text-right text-xs">
      <thead>
        <tr className="bg-[#163647] text-white">
          {headers.map((header) => (
            <th key={header} className="border border-slate-300 px-2 py-2">
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="odd:bg-white even:bg-slate-50">
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="border border-slate-200 px-2 py-2 font-semibold"
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ========================= HELPERS ========================= */

function barColor(tone: "blue" | "green" | "orange" | "rose") {
  const colors = {
    blue: "bg-blue-500",
    green: "bg-emerald-500",
    orange: "bg-orange-400",
    rose: "bg-rose-500",
  };

  return colors[tone];
}

function formatMoney(value: number) {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} میلیارد`;
  }

  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000)} میلیون`;
  }

  return value.toLocaleString("fa-IR");
}