"use client";

import { useMemo, useState } from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiX,
  FiSearch,
  FiFileText,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
  FiList,
} from "react-icons/fi";

type ProjectFormat = {
  id: number;
  title: string;
  category: string;
  description: string;
};

const initialFormats: ProjectFormat[] = [
  {
    id: 1,
    title: "پروژه عمرانی",
    category: "عمرانی",
    description:
      "مناسب برای پروژه‌های بهسازی معابر، آسفالت، جدول‌گذاری و احداث مسیرهای شهری.",
  },
  {
    id: 2,
    title: "پروژه خدمات شهری",
    category: "خدمات شهری",
    description:
      "مناسب برای امور نظافت شهری، ساماندهی تابلوها، جمع‌آوری پسماند و خدمات محله‌ای.",
  },
  {
    id: 3,
    title: "پروژه فضای سبز",
    category: "سیما و منظر",
    description:
      "مناسب برای کاشت، نگهداری، زیباسازی پارک‌ها و توسعه فضای سبز شهری.",
  },
];

export default function DefiningTheProjectFormat() {
  const [formats, setFormats] = useState<ProjectFormat[]>(initialFormats);

  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectFormat | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");

  const filteredFormats = useMemo(() => {
    const q = search.trim();

    if (!q) return formats;

    return formats.filter(
      (item) =>
        item.title.includes(q) ||
        item.category.includes(q) ||
        item.description.includes(q)
    );
  }, [formats, search]);

  const openCreateModal = () => {
    setEditingItem(null);
    setTitle("");
    setCategory("");
    setDescription("");
    setOpenModal(true);
  };

  const openEditModal = (item: ProjectFormat) => {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingItem(null);
    setTitle("");
    setCategory("");
    setDescription("");
  };

  const handleRefresh = () => {
    setFormats(initialFormats);
    setSearch("");
  };

  const handleSubmit = () => {
    if (!title.trim() || !category.trim() || !description.trim()) {
      return;
    }

    if (editingItem) {
      setFormats((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                title: title.trim(),
                category: category.trim(),
                description: description.trim(),
              }
            : item
        )
      );
    } else {
      const newFormat: ProjectFormat = {
        id: Date.now(),
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
      };

      setFormats((prev) => [...prev, newFormat]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    setFormats((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <div className="space-y-6">
        {/* Page Header */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="absolute left-0 top-0 h-full w-64 bg-gradient-to-r from-[#2f7f86]/15 to-transparent" />

          <div className="relative flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
                <FiFileText size={26} />
              </div>

              <div>
                <h1 className="text-[24px] font-extrabold text-slate-950">
                  تعریف قالب پروژه
                </h1>
                <p className="mt-1 text-[13px] font-semibold text-slate-500">
                  مدیریت قالب‌ها و دسته‌بندی‌های استاندارد پروژه‌های شهرداری
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                <div className="text-[12px] font-bold text-slate-500">
                  تعداد قالب‌ها
                </div>
                <div className="mt-1 text-[22px] font-extrabold text-slate-950">
                  {formats.length}
                </div>
              </div>

<button type="button" onClick={() => (window.location.href = "/defining-the-project-format/create")} className="flex h-12 items-center gap-2 rounded-2xl bg-[#2f7f86] px-5 text-[13px] font-extrabold text-white shadow-sm transition hover:bg-[#256d73] hover:shadow-md">
  <FiPlus size={19} />
  تعریف قالب جدید
</button>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <FiSearch
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو در عنوان، دسته‌بندی یا توضیحات..."
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

            <button
              type="button"
              onClick={handleRefresh}
              className="
                flex h-12 items-center justify-center gap-2 rounded-2xl
                border border-slate-200 bg-white px-4
                text-[13px] font-extrabold text-slate-700
                transition hover:bg-slate-50
              "
            >
              <FiRefreshCw size={18} />
              بازیابی اطلاعات اولیه
            </button>
          </div>
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-extrabold text-slate-950">
                لیست قالب‌های پروژه
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-slate-500">
                نمایش قالب‌های تعریف‌شده برای پروژه‌ها
              </p>
            </div>

            <div className="rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[12px] font-extrabold text-[#2f7f86]">
              {filteredFormats.length} مورد
            </div>
          </div>

          {filteredFormats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-50 text-[12px] text-slate-600">
                    <th className="w-[90px] px-5 py-4 font-extrabold">
                      ردیف
                    </th>

                    <th className="min-w-[260px] px-5 py-4 font-extrabold">
                      عنوان قالب
                    </th>

                    <th className="min-w-[200px] px-5 py-4 font-extrabold">
                      دسته‌بندی
                    </th>

                    <th className="min-w-[620px] px-5 py-4 font-extrabold">
                      توضیحات
                    </th>

                    <th className="w-[130px] px-5 py-4 text-center font-extrabold">
                      عملیات
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredFormats.map((format, index) => (
                    <tr
                      key={format.id}
                      className="group transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-[13px] font-extrabold text-slate-700">
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#2f7f86]/10 text-[#2f7f86]">
                            <FiFileText size={18} />
                          </div>

                          <div>
                            <div className="text-[14px] font-extrabold text-slate-950">
                              {format.title}
                            </div>

                            <div className="mt-1 text-[11px] font-semibold text-slate-400">
                              شناسه قالب: {format.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[12px] font-extrabold text-[#2f7f86]">
                          <FiList size={14} />
                          {format.category}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-[13px] font-semibold leading-7 text-slate-600">
                          {format.description}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(format)}
                            className="
                              flex h-9 w-9 items-center justify-center rounded-xl
                              bg-blue-50 text-blue-600 transition hover:bg-blue-100
                            "
                            title="ویرایش"
                          >
                            <FiEdit2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(format.id)}
                            className="
                              flex h-9 w-9 items-center justify-center rounded-xl
                              bg-rose-50 text-rose-600 transition hover:bg-rose-100
                            "
                            title="حذف"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState text="قالبی پیدا نشد" />
          )}
        </section>
      </div>

      {/* Modal */}
      {openModal && (
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
                    {editingItem ? "ویرایش قالب پروژه" : "تعریف قالب جدید"}
                  </h2>

                  <p className="mt-1 text-[12px] font-semibold text-white/70">
                    اطلاعات قالب پروژه را وارد کنید
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    flex h-10 w-10 items-center justify-center rounded-2xl
                    bg-white/10 transition hover:bg-white/20
                  "
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
              <InputBox
                label="عنوان قالب"
                value={title}
                onChange={setTitle}
                placeholder="مثلاً پروژه عمرانی"
              />

              <InputBox
                label="دسته‌بندی"
                value={category}
                onChange={setCategory}
                placeholder="مثلاً عمرانی"
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-[13px] font-extrabold text-slate-700">
                  توضیحات
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیحات قالب پروژه را وارد کنید"
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

            <ModalFooter
              submitLabel={editingItem ? "ذخیره تغییرات" : "ثبت قالب"}
              disabled={!title.trim() || !category.trim() || !description.trim()}
              onCancel={closeModal}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </>
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

function ModalFooter({
  submitLabel,
  disabled,
  onCancel,
  onSubmit,
}: {
  submitLabel: string;
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
      <button
        type="button"
        onClick={onCancel}
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
        onClick={onSubmit}
        disabled={disabled}
        className="
          h-11 rounded-2xl bg-[#2f7f86] px-5
          text-[13px] font-extrabold text-white
          shadow-sm transition hover:bg-[#256d73]
          disabled:cursor-not-allowed disabled:bg-slate-300
          disabled:shadow-none
        "
      >
        {submitLabel}
      </button>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
        <FiAlertCircle size={28} />
      </div>

      <h3 className="mt-4 text-[15px] font-extrabold text-slate-800">
        {text}
      </h3>

      <p className="mt-2 text-[13px] font-semibold text-slate-500">
        عبارت جستجو را تغییر دهید یا مورد جدیدی ثبت کنید.
      </p>
    </div>
  );
}