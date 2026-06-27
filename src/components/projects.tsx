"use client";

import { useMemo, useState } from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiBriefcase,
  FiCalendar,
  FiLayers,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiPauseCircle,
  FiBarChart2,
  FiMapPin,
  FiFileText,
  FiChevronDown,
} from "react-icons/fi";

type ProjectStatus = "در حال انجام" | "در انتظار" | "تکمیل شده" | "متوقف";

type Project = {
  id: number;
  title: string;
  format: string;
  organization: string;
  contractor: string;
  region: string;
  status: ProjectStatus;
  progress: number;
  startDate: string;
  description: string;
};

const projectFormats = [
  "پروژه عمرانی",
  "پروژه خدمات شهری",
  "پروژه فضای سبز",
];

const organizations = [
  "شهرداری منطقه ۱",
  "شهرداری منطقه ۲",
  "شهرداری منطقه ۳",
  "سازمان سیما و منظر",
];

const contractors = [
  "شرکت عمران کردستان",
  "شرکت راه‌سازان غرب",
  "پیمانکار روشنایی سنندج",
  "شرکت خدمات شهری",
];

const initialProjects: Project[] = [
  {
    id: 1,
    title: "احداث پارک پشتیبان",
    format: "پروژه فضای سبز",
    organization: "شهرداری منطقه ۱",
    contractor: "شرکت عمران کردستان",
    region: "ناحیه ۱",
    status: "در انتظار",
    progress: 25,
    startDate: "1404/08/12",
    description:
      "احداث پارک محله‌ای شامل مسیر پیاده‌روی، فضای بازی کودکان، نورپردازی و محوطه‌سازی.",
  },
  {
    id: 2,
    title: "ترمیم آسفالت محله فاطمیان",
    format: "پروژه عمرانی",
    organization: "شهرداری منطقه ۲",
    contractor: "شرکت راه‌سازان غرب",
    region: "ناحیه ۲",
    status: "در حال انجام",
    progress: 62,
    startDate: "1404/08/12",
    description:
      "ترمیم، لکه‌گیری و آسفالت معابر اصلی و فرعی محله فاطمیان با اولویت مسیرهای پرتردد.",
  },
  {
    id: 3,
    title: "روشنایی معابر جاده ساحلی",
    format: "پروژه خدمات شهری",
    organization: "شهرداری منطقه ۳",
    contractor: "پیمانکار روشنایی سنندج",
    region: "ناحیه ۳",
    status: "تکمیل شده",
    progress: 100,
    startDate: "1404/08/12",
    description:
      "اجرای شبکه روشنایی، نصب پایه چراغ و اصلاح نقاط تاریک مسیر جاده ساحلی.",
  },
  {
    id: 4,
    title: "ساماندهی تابلوهای شهری",
    format: "پروژه خدمات شهری",
    organization: "سازمان سیما و منظر",
    contractor: "شرکت خدمات شهری",
    region: "ناحیه ۴",
    status: "متوقف",
    progress: 40,
    startDate: "1404/08/15",
    description:
      "جمع‌آوری تابلوهای فرسوده، اصلاح تابلوهای نامنظم و نصب تابلوهای جدید شهری.",
  },
];

const statusOptions: ProjectStatus[] = [
  "در حال انجام",
  "در انتظار",
  "تکمیل شده",
  "متوقف",
];

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"همه" | ProjectStatus>(
    "همه"
  );

  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [format, setFormat] = useState("");
  const [organization, setOrganization] = useState("");
  const [contractor, setContractor] = useState("");
  const [region, setRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");

  const filteredProjects = useMemo(() => {
    const q = search.trim();

    return projects.filter((item) => {
      const matchesSearch =
        !q ||
        item.title.includes(q) ||
        item.format.includes(q) ||
        item.organization.includes(q) ||
        item.contractor.includes(q) ||
        item.region.includes(q) ||
        item.description.includes(q);

      const matchesStatus =
        statusFilter === "همه" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: projects.length,
      doing: projects.filter((p) => p.status === "در حال انجام").length,
      waiting: projects.filter((p) => p.status === "در انتظار").length,
      done: projects.filter((p) => p.status === "تکمیل شده").length,
    };
  }, [projects]);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setFormat("");
    setOrganization("");
    setContractor("");
    setRegion("");
    setStartDate("");
    setDescription("");
    setOpenModal(true);
  };

  const openEditModal = (item: Project) => {
    setEditingItem(item);
    setTitle(item.title);
    setFormat(item.format);
    setOrganization(item.organization);
    setContractor(item.contractor);
    setRegion(item.region);
    setStartDate(item.startDate);
    setDescription(item.description);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingItem(null);
  };

  const handleRefresh = () => {
    setProjects(initialProjects);
    setSearch("");
    setStatusFilter("همه");
  };

  const handleSubmit = () => {
    if (
      !title.trim() ||
      !format.trim() ||
      !organization.trim() ||
      !region.trim() ||
      !startDate.trim() ||
      !description.trim()
    ) {
      return;
    }

    if (editingItem) {
      setProjects((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: title.trim(),
                format: format.trim(),
                organization: organization.trim(),
                contractor: contractor.trim(),
                region: region.trim(),
                startDate: startDate.trim(),
                description: description.trim(),
              }
            : item
        )
      );
    } else {
      const newProject: Project = {
        id: Date.now(),
        title: title.trim(),
        format: format.trim(),
        organization: organization.trim(),
        contractor: contractor.trim(),
        region: region.trim(),
        status: "در انتظار",
        progress: 0,
        startDate: startDate.trim(),
        description: description.trim(),
      };

      setProjects((prev) => [newProject, ...prev]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const isSubmitDisabled =
    !title.trim() ||
    !format.trim() ||
    !organization.trim() ||
    !region.trim() ||
    !startDate.trim() ||
    !description.trim();

  return (
    <>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute left-0 top-0 h-full w-72 bg-gradient-to-r from-[#2f7f86]/15 to-transparent" />

          <div className="relative flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
                <FiBriefcase size={26} />
              </div>

              <div>
                <h1 className="text-[24px] font-extrabold text-slate-950">
                  پروژه‌ها
                </h1>
                <p className="mt-1 text-[13px] font-semibold text-slate-500">
                  مدیریت، بررسی و پیگیری پروژه‌های تعریف‌شده در سامانه شهرداری
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <MiniStat title="کل پروژه‌ها" value={stats.total} />
              <MiniStat title="در حال انجام" value={stats.doing} />

              <button
                type="button"
                onClick={openCreateModal}
                className="
                  flex h-12 items-center gap-2 rounded-2xl
                  bg-[#2f7f86] px-5
                  text-[13px] font-extrabold text-white
                  shadow-sm transition
                  hover:bg-[#256d73] hover:shadow-md
                "
              >
                <FiPlus size={19} />
                ایجاد پروژه جدید
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ProjectStatCard
            title="تعداد کل پروژه‌ها"
            value={stats.total}
            icon={<FiBriefcase size={22} />}
            tone="blue"
          />

          <ProjectStatCard
            title="پروژه‌های در حال انجام"
            value={stats.doing}
            icon={<FiBarChart2 size={22} />}
            tone="green"
          />

          <ProjectStatCard
            title="پروژه‌های در انتظار"
            value={stats.waiting}
            icon={<FiClock size={22} />}
            tone="orange"
          />

          <ProjectStatCard
            title="پروژه‌های تکمیل‌شده"
            value={stats.done}
            icon={<FiCheckCircle size={22} />}
            tone="purple"
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
                placeholder="جستجو در عنوان، قالب، سازمان، پیمانکار یا منطقه..."
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
              {(["همه", ...statusOptions] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatusFilter(item)}
                  className={[
                    "h-11 rounded-2xl px-4 text-[12px] font-extrabold transition",
                    statusFilter === item
                      ? "bg-[#2f7f86] text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {item}
                </button>
              ))}

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
                پروژه‌های ایجاد شده
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-slate-500">
                لیست پروژه‌ها همراه با وضعیت، پیشرفت، سازمان و پیمانکار
              </p>
            </div>

            <div className="rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[12px] font-extrabold text-[#2f7f86]">
              {filteredProjects.length} مورد
            </div>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={() => openEditModal(project)}
                  onDelete={() => handleDelete(project.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </section>
      </div>

      {openModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative max-h-[92vh] w-[760px] max-w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="bg-gradient-to-l from-[#2f7f86] to-[#163647] px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-extrabold">
                    {editingItem ? "ویرایش پروژه" : "ایجاد پروژه جدید"}
                  </h2>

                  <p className="mt-1 text-[12px] font-semibold text-white/70">
                    اطلاعات پروژه را کامل وارد کنید تا در لیست پروژه‌ها ثبت شود
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

            <div className="max-h-[65vh] overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputBox
                  label="عنوان پروژه"
                  value={title}
                  onChange={setTitle}
                  placeholder="مثلاً ترمیم آسفالت محله فاطمیان"
                />

                <SelectBox
                  label="قالب پروژه"
                  value={format}
                  onChange={setFormat}
                  placeholder="قالب پروژه را انتخاب کنید"
                  options={projectFormats}
                />

                <SelectBox
                  label="سازمان / واحد"
                  value={organization}
                  onChange={setOrganization}
                  placeholder="سازمان یا واحد را انتخاب کنید"
                  options={organizations}
                />

                <SelectBox
                  label="پیمانکار / مجری"
                  value={contractor}
                  onChange={setContractor}
                  placeholder="اختیاری - پیمانکار یا مجری را انتخاب کنید"
                  options={contractors}
                />

                <InputBox
                  label="منطقه / ناحیه"
                  value={region}
                  onChange={setRegion}
                  placeholder="مثلاً ناحیه ۲"
                />

                <PersianDateBox
                  label="تاریخ شروع"
                  value={startDate}
                  onChange={setStartDate}
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-[13px] font-extrabold text-slate-700">
                    توضیحات پروژه
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="شرح کوتاهی از پروژه، محدوده اجرا و هدف آن را وارد کنید"
                    rows={4}
                    className="
                      w-full resize-none rounded-2xl border border-slate-200
                      bg-slate-50 px-4 py-3
                      text-[14px] font-semibold leading-7 text-slate-800
                      outline-none transition
                      placeholder:text-slate-400
                      focus:border-[#2f7f86] focus:bg-white
                      focus:ring-4 focus:ring-[#2f7f86]/10
                    "
                  />
                </div>
              </div>
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
                onClick={handleSubmit}
                disabled={isSubmitDisabled}
                className="
                  h-11 rounded-2xl bg-[#2f7f86] px-5
                  text-[13px] font-extrabold text-white
                  shadow-sm transition hover:bg-[#256d73]
                  disabled:cursor-not-allowed disabled:bg-slate-300
                  disabled:shadow-none
                "
              >
                {editingItem ? "ذخیره تغییرات" : "ثبت پروژه"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusStyle = getStatusStyle(project.status);

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={[
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
              statusStyle.iconBg,
              statusStyle.iconText,
            ].join(" ")}
          >
            {statusStyle.icon}
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

        <StatusBadge status={project.status} />
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
          icon={<FiUsers size={15} />}
          label="پیمانکار"
          value={project.contractor || "تعیین نشده"}
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
      </div>

      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[12px] font-extrabold text-slate-700">
            پیشرفت پروژه
          </span>

          <span className="text-[13px] font-extrabold text-[#2f7f86]">
            {project.progress}٪
          </span>
        </div>

        <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#2f7f86] transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="text-[11px] font-semibold text-slate-400">
          شناسه پروژه: {project.id}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition hover:bg-blue-100"
            title="ویرایش"
          >
            <FiEdit2 size={16} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600 transition hover:bg-rose-100"
            title="حذف"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </article>
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

function ProjectStatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  tone: "blue" | "green" | "orange" | "purple";
}) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
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

function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    "در حال انجام": "bg-emerald-100 text-emerald-700",
    "در انتظار": "bg-orange-100 text-orange-700",
    "تکمیل شده": "bg-blue-100 text-blue-700",
    متوقف: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-extrabold ${styles[status]}`}
    >
      {status}
    </span>
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

function InputBox({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[13px] font-extrabold text-slate-700">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          h-12 w-full rounded-2xl border border-slate-200
          bg-slate-50 px-4
          text-[14px] font-semibold text-slate-800
          outline-none transition
          placeholder:text-slate-400
          focus:border-[#2f7f86] focus:bg-white
          focus:ring-4 focus:ring-[#2f7f86]/10
        "
      />
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
              absolute right-0 top-[78px] z-[9999]
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

function PersianDateBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const years = Array.from({ length: 16 }, (_, index) => 1400 + index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  const [selectedYear, setSelectedYear] = useState(
    value ? value.split("/")[0] : ""
  );
  const [selectedMonth, setSelectedMonth] = useState(
    value ? value.split("/")[1] : ""
  );
  const [selectedDay, setSelectedDay] = useState(
    value ? value.split("/")[2] : ""
  );

  const getDaysCount = (month: string) => {
    const m = Number(month);

    if (!m) return 31;
    if (m <= 6) return 31;
    if (m <= 11) return 30;

    return 29;
  };

  const days = Array.from(
    { length: getDaysCount(selectedMonth) },
    (_, index) => index + 1
  );

  const toTwoDigits = (num: string | number) => String(num).padStart(2, "0");

  const updateDate = (year: string, month: string, day: string) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDay(day);

    if (year && month && day) {
      onChange(`${year}/${toTwoDigits(month)}/${toTwoDigits(day)}`);
    } else {
      onChange("");
    }
  };

  return (
    <div>
      <label className="mb-2 block text-[13px] font-extrabold text-slate-700">
        {label}
      </label>

      <div className="grid grid-cols-3 gap-3">
        <SmallSelectBox
          value={selectedYear}
          onChange={(newYear) =>
            updateDate(newYear, selectedMonth, selectedDay)
          }
          placeholder="سال"
          options={years.map(String)}
        />

        <SmallSelectBox
          value={selectedMonth}
          onChange={(newMonth) =>
            updateDate(selectedYear, newMonth, selectedDay)
          }
          placeholder="ماه"
          options={months.map((month) => toTwoDigits(month))}
        />

        <SmallSelectBox
          value={selectedDay}
          onChange={(newDay) =>
            updateDate(selectedYear, selectedMonth, newDay)
          }
          placeholder="روز"
          options={days.map((day) => toTwoDigits(day))}
        />
      </div>

      {value && (
        <div className="mt-2 text-[12px] font-bold text-[#2f7f86]">
          تاریخ انتخاب‌شده: {value}
        </div>
      )}
    </div>
  );
}

function SmallSelectBox({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          `
            flex h-12 w-full items-center justify-between
            rounded-2xl border bg-slate-50 px-3
            text-[13px] font-extrabold outline-none transition
          `,
          open
            ? "border-[#2f7f86] bg-white ring-4 ring-[#2f7f86]/10"
            : "border-slate-200 hover:border-slate-300",
          value ? "text-slate-800" : "text-slate-400",
        ].join(" ")}
      >
        <span>{value || placeholder}</span>

        <FiChevronDown
          size={16}
          className={[
            "text-slate-400 transition",
            open ? "rotate-180 text-[#2f7f86]" : "",
          ].join(" ")}
        />
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
              absolute right-0 top-[54px] z-[9999]
              max-h-56 w-full overflow-hidden rounded-2xl
              border border-slate-200 bg-white
              shadow-2xl shadow-slate-900/10
            "
          >
            <div className="max-h-56 overflow-y-auto p-2">
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
                        flex w-full items-center justify-between
                        rounded-xl px-3 py-2.5 text-right
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
                        "h-2 w-2 rounded-full transition",
                        active ? "bg-[#2f7f86]" : "bg-slate-200",
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
        عبارت جستجو یا فیلتر وضعیت را تغییر دهید یا پروژه جدیدی ایجاد کنید.
      </p>
    </div>
  );
}

function getStatusStyle(status: ProjectStatus) {
  switch (status) {
    case "در حال انجام":
      return {
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        icon: <FiBarChart2 size={22} />,
      };

    case "در انتظار":
      return {
        iconBg: "bg-orange-50",
        iconText: "text-orange-600",
        icon: <FiClock size={22} />,
      };

    case "تکمیل شده":
      return {
        iconBg: "bg-blue-50",
        iconText: "text-blue-600",
        icon: <FiCheckCircle size={22} />,
      };

    case "متوقف":
      return {
        iconBg: "bg-rose-50",
        iconText: "text-rose-600",
        icon: <FiPauseCircle size={22} />,
      };
  }
}