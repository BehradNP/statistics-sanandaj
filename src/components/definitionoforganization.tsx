"use client";

import { useMemo, useState } from "react";
import {
  FiPlus,
  FiRefreshCw,
  FiX,
  FiSearch,
  FiLayers,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";

type Organization = {
  id: number;
  name: string;
  address: string;
};

const initialOrganizations: Organization[] = [
  {
    id: 1,
    name: "شهرداری منطقه ۱",
    address:
      "سنندج، خیابان فردوسی، بعد از چهارراه بهاران، کوچه کارگزارش ۵، پلاک ۱۳، واحد ۲",
  },
  {
    id: 2,
    name: "شهرداری منطقه ۲",
    address:
      "سنندج، بلوار شیبلی، نرسیده به میدان معلم، مجتمع مسکونی آفتاب، بلوک C، طبقه سوم",
  },
  {
    id: 3,
    name: "شهرداری منطقه ۳",
    address:
      "سنندج، بلوار ۲۲ بهمن، بعد از پل قشلاق، روبروی مدرسه بعثت، کوچه مهر، پلاک ۷۵",
  },
];

export default function DefinitionOfOrganization() {
  const [organizations, setOrganizations] =
    useState<Organization[]>(initialOrganizations);

  const [openModal, setOpenModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Organization | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [search, setSearch] = useState("");

  const filteredOrganizations = useMemo(() => {
    const q = search.trim();

    if (!q) return organizations;

    return organizations.filter(
      (item) => item.name.includes(q) || item.address.includes(q)
    );
  }, [organizations, search]);

  const openCreateModal = () => {
    setEditingItem(null);
    setName("");
    setAddress("");
    setOpenModal(true);
  };

  const openEditModal = (item: Organization) => {
    setEditingItem(item);
    setName(item.name);
    setAddress(item.address);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditingItem(null);
    setName("");
    setAddress("");
  };

  const handleRefresh = () => {
    setOrganizations(initialOrganizations);
    setSearch("");
  };

  const handleSubmit = () => {
    if (!name.trim() || !address.trim()) return;

    if (editingItem) {
      setOrganizations((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: name.trim(),
                address: address.trim(),
              }
            : item
        )
      );
    } else {
      const newOrganization: Organization = {
        id: Date.now(),
        name: name.trim(),
        address: address.trim(),
      };

      setOrganizations((prev) => [...prev, newOrganization]);
    }

    closeModal();
  };

  const handleDelete = (id: number) => {
    setOrganizations((prev) => prev.filter((item) => item.id !== id));
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
                <FiLayers size={26} />
              </div>

              <div>
                <h1 className="text-[24px] font-extrabold text-slate-950">
                  تعریف بخش / سازمان
                </h1>
                <p className="mt-1 text-[13px] font-semibold text-slate-500">
                  مدیریت سازمان‌ها، مناطق و واحدهای مرتبط با پروژه‌های شهرداری
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                <div className="text-[12px] font-bold text-slate-500">
                  تعداد سازمان‌ها
                </div>
                <div className="mt-1 text-[22px] font-extrabold text-slate-950">
                  {organizations.length}
                </div>
              </div>

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
                تعریف سازمان جدید
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
                placeholder="جستجو در نام سازمان یا آدرس..."
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

        {/* Table Card */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="text-[15px] font-extrabold text-slate-950">
                لیست سازمان‌ها
              </h2>
              <p className="mt-1 text-[12px] font-semibold text-slate-500">
                نمایش سازمان‌های ثبت‌شده در سامانه
              </p>
            </div>

            <div className="rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[12px] font-extrabold text-[#2f7f86]">
              {filteredOrganizations.length} مورد
            </div>
          </div>

          {filteredOrganizations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-slate-50 text-[12px] text-slate-600">
                    <th className="w-[90px] px-5 py-4 font-extrabold">
                      ردیف
                    </th>
                    <th className="min-w-[260px] px-5 py-4 font-extrabold">
                      نام سازمان
                    </th>
                    <th className="min-w-[520px] px-5 py-4 font-extrabold">
                      آدرس
                    </th>
                    <th className="w-[130px] px-5 py-4 text-center font-extrabold">
                      عملیات
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredOrganizations.map((organization, index) => (
                    <tr
                      key={organization.id}
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
                            <FiLayers size={18} />
                          </div>

                          <div>
                            <div className="text-[14px] font-extrabold text-slate-950">
                              {organization.name}
                            </div>
                            <div className="mt-1 text-[11px] font-semibold text-slate-400">
                              شناسه سازمان: {organization.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2 text-[13px] font-semibold leading-7 text-slate-600">
                          <FiMapPin
                            size={17}
                            className="mt-1 shrink-0 text-slate-400"
                          />
                          <span>{organization.address}</span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(organization)}
                            className="
                              flex h-9 w-9 items-center justify-center rounded-xl
                              bg-blue-50 text-blue-600 transition
                              hover:bg-blue-100
                            "
                            title="ویرایش"
                          >
                            <FiEdit2 size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(organization.id)}
                            className="
                              flex h-9 w-9 items-center justify-center rounded-xl
                              bg-rose-50 text-rose-600 transition
                              hover:bg-rose-100
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
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
                <FiAlertCircle size={28} />
              </div>
              <h3 className="mt-4 text-[15px] font-extrabold text-slate-800">
                سازمانی پیدا نشد
              </h3>
              <p className="mt-2 text-[13px] font-semibold text-slate-500">
                عبارت جستجو را تغییر دهید یا سازمان جدیدی ثبت کنید.
              </p>
            </div>
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

          <div
            className="
              relative w-[560px] max-w-full overflow-hidden rounded-3xl
              border border-slate-200 bg-white shadow-2xl
            "
          >
            <div className="bg-gradient-to-l from-[#2f7f86] to-[#163647] px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-extrabold">
                    {editingItem ? "ویرایش سازمان" : "تعریف سازمان جدید"}
                  </h2>
                  <p className="mt-1 text-[12px] font-semibold text-white/70">
                    اطلاعات سازمان یا بخش موردنظر را وارد کنید
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
              <div>
                <label className="mb-2 block text-[13px] font-extrabold text-slate-700">
                  نام سازمان
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثلاً شهرداری منطقه ۴"
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

              <div>
                <label className="mb-2 block text-[13px] font-extrabold text-slate-700">
                  آدرس
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="آدرس کامل سازمان را وارد کنید"
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
                disabled={!name.trim() || !address.trim()}
                className="
                  h-11 rounded-2xl
                  bg-[#2f7f86] px-5
                  text-[13px] font-extrabold text-white
                  shadow-sm transition
                  hover:bg-[#256d73]
                  disabled:cursor-not-allowed disabled:bg-slate-300
                  disabled:shadow-none
                "
              >
                {editingItem ? "ذخیره تغییرات" : "ثبت سازمان"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}