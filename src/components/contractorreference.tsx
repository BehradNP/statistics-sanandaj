"use client";

import { useMemo, useState } from "react";
import {
  FiBriefcase,
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiSearch,
  FiRefreshCw,
  FiMapPin,
  FiLayers,
  FiFileText,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiX,
  FiChevronDown,
  FiEdit2,
  FiLink,
} from "react-icons/fi";

type ReferenceStatus = "دارای پیمانکار" | "فاقد پیمانکار";

type Project = {
  id: number;
  title: string;
  format: string;
  organization: string;
  region: string;
  startDate: string;
  description: string;
  contractor: string;
};

const contractors = [
  "شرکت عمران کردستان",
  "شرکت راه‌سازان غرب",
  "پیمانکار روشنایی سنندج",
  "شرکت خدمات شهری",
  "شرکت توسعه عمران غرب",
];

const initialProjects: Project[] = [
  {
    id: 1,
    title: "احداث پارک پشتیبان",
    format: "پروژه فضای سبز",
    organization: "شهرداری منطقه ۱",
    region: "ناحیه ۱",
    startDate: "1404/08/12",
    contractor: "",
    description:
      "احداث پارک محله‌ای شامل مسیر پیاده‌روی، فضای بازی کودکان، نورپردازی و محوطه‌سازی.",
  },
  {
    id: 2,
    title: "ترمیم آسفالت محله فاطمیان",
    format: "پروژه عمرانی",
    organization: "شهرداری منطقه ۲",
    region: "ناحیه ۲",
    startDate: "1404/08/12",
    contractor: "شرکت راه‌سازان غرب",
    description:
      "ترمیم، لکه‌گیری و آسفالت معابر اصلی و فرعی محله فاطمیان با اولویت مسیرهای پرتردد.",
  },
  {
    id: 3,
    title: "روشنایی معابر جاده ساحلی",
    format: "پروژه خدمات شهری",
    organization: "شهرداری منطقه ۳",
    region: "ناحیه ۳",
    startDate: "1404/08/12",
    contractor: "پیمانکار روشنایی سنندج",
    description:
      "اجرای شبکه روشنایی، نصب پایه چراغ و اصلاح نقاط تاریک مسیر جاده ساحلی.",
  },
  {
    id: 4,
    title: "ساماندهی تابلوهای شهری",
    format: "پروژه خدمات شهری",
    organization: "سازمان سیما و منظر",
    region: "ناحیه ۴",
    startDate: "1404/08/15",
    contractor: "",
    description:
      "جمع‌آوری تابلوهای فرسوده، اصلاح تابلوهای نامنظم و نصب تابلوهای جدید شهری.",
  },
];

export default function ContractorReference() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"همه" | ReferenceStatus>("همه");

  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedContractor, setSelectedContractor] = useState("");

  const filteredProjects = useMemo(() => {
    const q = search.trim();

    return projects.filter((project) => {
      const status: ReferenceStatus = project.contractor
        ? "دارای پیمانکار"
        : "فاقد پیمانکار";

      const matchesFilter = filter === "همه" || status === filter;

      const matchesSearch =
        !q ||
        project.title.includes(q) ||
        project.format.includes(q) ||
        project.organization.includes(q) ||
        project.region.includes(q) ||
        project.contractor.includes(q) ||
        project.description.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [projects, search, filter]);

  const stats = useMemo(() => {
    const assigned = projects.filter((project) => project.contractor).length;
    const unassigned = projects.length - assigned;

    return {
      total: projects.length,
      assigned,
      unassigned,
    };
  }, [projects]);

  const openAssignModal = (project: Project) => {
    setSelectedProject(project);
    setSelectedContractor(project.contractor);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedProject(null);
    setSelectedContractor("");
  };

  const handleAssign = () => {
    if (!selectedProject || !selectedContractor.trim()) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              contractor: selectedContractor.trim(),
            }
          : project
      )
    );

    closeModal();
  };

  const handleRefresh = () => {
    setProjects(initialProjects);
    setSearch("");
    setFilter("همه");
  };

  return (
    <>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute left-0 top-0 h-full w-72 bg-gradient-to-r from-[#2f7f86]/15 to-transparent" />

          <div className="relative flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
                <FiLink size={27} />
              </div>

              <div>
                <h1 className="text-[24px] font-extrabold text-slate-950">
                  ارجاع پروژه به پیمانکار
                </h1>
                <p className="mt-1 text-[13px] font-semibold text-slate-500">
                  مشاهده پروژه‌های شروع‌شده و تعیین پیمانکار برای پروژه‌های فاقد پیمانکار
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MiniStat title="کل پروژه‌ها" value={stats.total} />
              <MiniStat title="فاقد پیمانکار" value={stats.unassigned} />

              <div className="flex h-12 items-center gap-2 rounded-2xl bg-[#2f7f86] px-5 text-[13px] font-extrabold text-white shadow-sm">
                <FiUsers size={18} />
                مدیریت ارجاع‌ها
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            title="تعداد کل پروژه‌ها"
            value={stats.total}
            icon={<FiBriefcase size={22} />}
            tone="blue"
          />

          <StatCard
            title="پروژه‌های دارای پیمانکار"
            value={stats.assigned}
            icon={<FiUserCheck size={22} />}
            tone="green"
          />

          <StatCard
            title="پروژه‌های فاقد پیمانکار"
            value={stats.unassigned}
            icon={<FiUserX size={22} />}
            tone="orange"
          />
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <FiSearch
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در عنوان پروژه، قالب، سازمان، پیمانکار یا منطقه..."
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

            <div className="flex flex-wrap items-center gap-2">
              {(["همه", "دارای پیمانکار", "فاقد پیمانکار"] as const).map(
                (item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={[
                      "h-11 rounded-2xl px-4 text-[12px] font-extrabold transition",
                      filter === item
                        ? "bg-[#2f7f86] text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    {item}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={handleRefresh}
                className="
                  flex h-11 items-center justify-center gap-2 rounded-2xl
                  border border-slate-200 bg-white px-4
                  text-[12px] font-extrabold text-slate-700
                  transition hover:bg-slate-50
                "
              >
                <FiRefreshCw size={17} />
                بازیابی
              </button>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-extrabold text-slate-950">
                لیست پروژه‌ها و وضعیت ارجاع
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-slate-500">
                پروژه‌های شروع‌شده به همراه وضعیت پیمانکار و امکان تعیین یا تغییر پیمانکار
              </p>
            </div>

            <div className="rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[12px] font-extrabold text-[#2f7f86]">
              {filteredProjects.length} مورد
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
              {filteredProjects.map((project) => (
                <ReferenceProjectCard
                  key={project.id}
                  project={project}
                  onAssign={() => openAssignModal(project)}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>

      {openModal && selectedProject && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative w-[620px] max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-l from-[#2f7f86] to-[#163647] px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-extrabold">
                    {selectedProject.contractor
                      ? "تغییر پیمانکار پروژه"
                      : "تعیین پیمانکار پروژه"}
                  </h2>

                  <p className="mt-1 text-[12px] font-semibold text-white/70">
                    برای پروژه انتخاب‌شده یک پیمانکار یا مجری تعیین کنید
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 transition hover:bg-white/20"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
                    <FiBriefcase size={22} />
                  </div>

                  <div>
                    <h3 className="text-[16px] font-extrabold text-slate-950">
                      {selectedProject.title}
                    </h3>
                    <p className="mt-1 text-[12px] font-semibold text-slate-500">
                      قالب: {selectedProject.format}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InfoLine
                    icon={<FiLayers size={15} />}
                    label="سازمان"
                    value={selectedProject.organization}
                  />

                  <InfoLine
                    icon={<FiMapPin size={15} />}
                    label="منطقه"
                    value={selectedProject.region}
                  />

                  <InfoLine
                    icon={<FiCalendar size={15} />}
                    label="تاریخ شروع"
                    value={selectedProject.startDate}
                  />

                  <InfoLine
                    icon={<FiUsers size={15} />}
                    label="پیمانکار فعلی"
                    value={selectedProject.contractor || "تعیین نشده"}
                  />
                </div>
              </div>

              <SelectBox
                label="انتخاب پیمانکار / مجری"
                value={selectedContractor}
                onChange={setSelectedContractor}
                placeholder="پیمانکار یا مجری را انتخاب کنید"
                options={contractors}
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="
                  h-11 rounded-2xl border border-slate-200
                  bg-white px-5
                  text-[13px] font-extrabold text-slate-700
                  transition hover:bg-slate-100
                "
              >
                انصراف
              </button>

              <button
                type="button"
                onClick={handleAssign}
                disabled={!selectedContractor.trim()}
                className="
                  h-11 rounded-2xl bg-[#2f7f86] px-5
                  text-[13px] font-extrabold text-white
                  shadow-sm transition hover:bg-[#256d73]
                  disabled:cursor-not-allowed disabled:bg-slate-300
                  disabled:shadow-none
                "
              >
                {selectedProject.contractor ? "ذخیره تغییرات" : "ثبت ارجاع"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ReferenceProjectCard({
  project,
  onAssign,
}: {
  project: Project;
  onAssign: () => void;
}) {
  const hasContractor = Boolean(project.contractor);

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              hasContractor
                ? "bg-emerald-50 text-emerald-600"
                : "bg-orange-50 text-orange-600",
            ].join(" ")}
          >
            {hasContractor ? (
              <FiUserCheck size={22} />
            ) : (
              <FiUserX size={22} />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-extrabold text-slate-950">
              {project.title}
            </h3>

            <p className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-slate-500">
              <FiFileText size={14} />
              قالب: {project.format}
            </p>
          </div>
        </div>

        <ReferenceBadge hasContractor={hasContractor} />
      </div>

      <p className="mt-4 line-clamp-2 min-h-[54px] text-[13px] font-semibold leading-7 text-slate-600">
        {project.description}
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        <InfoLine
          icon={<FiLayers size={15} />}
          label="سازمان"
          value={project.organization}
        />

        <InfoLine
          icon={<FiMapPin size={15} />}
          label="منطقه"
          value={project.region}
        />

        <InfoLine
          icon={<FiCalendar size={15} />}
          label="تاریخ شروع"
          value={project.startDate}
        />

        <InfoLine
          icon={<FiUsers size={15} />}
          label="پیمانکار"
          value={project.contractor || "تعیین نشده"}
        />
      </div>

      <div
        className={[
          "mt-5 rounded-2xl border p-4",
          hasContractor
            ? "border-emerald-100 bg-emerald-50/60"
            : "border-orange-100 bg-orange-50/60",
        ].join(" ")}
      >
        <div className="flex items-start gap-3">
          <div
            className={[
              "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              hasContractor
                ? "bg-emerald-100 text-emerald-700"
                : "bg-orange-100 text-orange-700",
            ].join(" ")}
          >
            {hasContractor ? (
              <FiCheckCircle size={18} />
            ) : (
              <FiAlertCircle size={18} />
            )}
          </div>

          <div>
            <div
              className={[
                "text-[13px] font-extrabold",
                hasContractor ? "text-emerald-800" : "text-orange-800",
              ].join(" ")}
            >
              {hasContractor
                ? "این پروژه دارای پیمانکار است"
                : "این پروژه هنوز پیمانکار ندارد"}
            </div>

            <p
              className={[
                "mt-1 text-[12px] font-semibold leading-6",
                hasContractor ? "text-emerald-700" : "text-orange-700",
              ].join(" ")}
            >
              {hasContractor
                ? `پیمانکار فعلی: ${project.contractor}`
                : "برای ادامه فرایند اجرایی، پیمانکار یا مجری پروژه را تعیین کنید."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-[11px] font-semibold text-slate-400">
          شناسه پروژه: {project.id}
        </div>

        <button
          type="button"
          onClick={onAssign}
          className={[
            "flex h-10 items-center gap-2 rounded-2xl px-4 text-[12px] font-extrabold transition",
            hasContractor
              ? "bg-blue-50 text-blue-600 hover:bg-blue-100"
              : "bg-[#2f7f86] text-white hover:bg-[#256d73]",
          ].join(" ")}
        >
          {hasContractor ? <FiEdit2 size={16} /> : <FiUserCheck size={16} />}
          {hasContractor ? "تغییر پیمانکار" : "تعیین پیمانکار"}
        </button>
      </div>
    </article>
  );
}

function ReferenceBadge({ hasContractor }: { hasContractor: boolean }) {
  return (
    <span
      className={[
        "shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold",
        hasContractor
          ? "bg-emerald-100 text-emerald-700"
          : "bg-orange-100 text-orange-700",
      ].join(" ")}
    >
      {hasContractor ? "دارای پیمانکار" : "فاقد پیمانکار"}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  tone: "blue" | "green" | "orange";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
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

        <span className="text-[28px] font-extrabold text-slate-950">
          {value}
        </span>
      </div>

      <div className="mt-4 text-[13px] font-extrabold text-slate-600">
        {title}
      </div>
    </div>
  );
}

function MiniStat({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
      <div className="text-[12px] font-bold text-slate-500">{title}</div>

      <div className="mt-1 text-[22px] font-extrabold text-slate-950">
        {value}
      </div>
    </div>
  );
}

function InfoLine({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
      <span className="text-slate-400">{icon}</span>

      <span className="text-[11px] font-bold text-slate-400">{label}:</span>

      <span className="truncate text-[12px] font-extrabold text-slate-700">
        {value}
      </span>
    </div>
  );
}

function SelectBox({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="mb-2 block text-[13px] font-extrabold text-slate-700">
        {label}
      </label>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          `
            relative flex h-12 w-full items-center justify-between
            rounded-2xl border
            bg-slate-50 px-4
            text-[14px] font-semibold
            outline-none transition
          `,
          open
            ? "border-[#2f7f86] bg-white ring-4 ring-[#2f7f86]/10"
            : "border-slate-200 hover:border-slate-300",
          value ? "text-slate-800" : "text-slate-400",
        ].join(" ")}
      >
        <span className="truncate">{value || placeholder}</span>

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
              absolute right-0 bottom-[58px] z-[9999]
              w-full overflow-hidden rounded-2xl
              border border-slate-200 bg-white
              shadow-2xl shadow-slate-900/10
            "
          >
            <div className="max-h-64 overflow-y-auto p-2">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className={[
                  `
                    flex w-full items-center justify-between
                    rounded-xl px-4 py-3 text-right
                    text-[13px] font-extrabold transition
                  `,
                  !value
                    ? "bg-[#2f7f86] text-white"
                    : "text-slate-500 hover:bg-slate-50",
                ].join(" ")}
              >
                <span>{placeholder}</span>

                {!value && <span className="h-2 w-2 rounded-full bg-white" />}
              </button>

              <div className="my-2 h-px bg-slate-100" />

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
                    <span>{option}</span>

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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
        <FiAlertCircle size={28} />
      </div>

      <h3 className="mt-4 text-[15px] font-extrabold text-slate-800">
        پروژه‌ای پیدا نشد
      </h3>

      <p className="mt-2 text-[13px] font-semibold text-slate-500">
        عبارت جستجو یا فیلتر را تغییر دهید.
      </p>
    </div>
  );
}