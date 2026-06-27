"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { FiAlertCircle, FiBriefcase, FiCamera, FiEdit3, FiKey, FiMail, FiMapPin, FiPhone, FiRefreshCw, FiSave, FiShield, FiSmartphone, FiTrash2, FiUser, FiX } from "react-icons/fi";

type UserFile = {
  id?: number;
  guid?: string | null;
  fileName?: string | null;
  extension?: string | null;
  size?: number | null;
  data?: string | null;
  url?: string | null;
};

type UserDetail = {
  id?: number | string;
  guid?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  displayName?: string | null;
  userName?: string | null;
  nationalId?: string | null;
  nationalCode?: string | null;
  birthCertificateNo?: string | null;
  fatherName?: string | null;
  attendanceCardNo?: string | null;
  genderId?: number | null;
  birthDate?: string | null;
  issuePlace?: string | null;
  birthPlaceId?: number | null;
  postId?: number | null;
  unitId?: number | null;
  roleId?: number | null;
  hireDate?: string | null;
  workStartDate?: string | null;
  workEndDate?: string | null;
  degreeId?: number | null;
  marriageStatusId?: number | null;
  employementTypeId?: number | null;
  employementGroupId?: number | null;
  shahidChild?: boolean | null;
  janbaz?: boolean | null;
  janbazPercent?: number | string | null;
  phoneNo?: string | null;
  phone?: string | null;
  mobileNo?: string | null;
  mobile?: string | null;
  emailAddress?: string | null;
  address?: string | null;
  bankNumber?: string | null;
  bankId?: number | null;
  reward?: boolean | null;
  enable?: boolean | null;
  status?: string | null;
  description?: string | null;
  imageProfile?: UserFile | string | null;
  password?: string | null;
  keyPass?: string | null;
  [key: string]: any;
};

type ProfileField = {
  label: string;
  value: string;
};

type ContactForm = {
  phoneNo: string;
  mobileNo: string;
  emailAddress: string;
  address: string;
};

type MainForm = {
  firstName: string;
  lastName: string;
  userName: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
};

type RoleItem = {
  id: number;
  title: string;
};

const INPUT_CLASS = "h-11 w-full rounded-xl border border-slate-300 bg-white px-10 text-[13px] font-bold text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-[#2f7f86] focus:ring-2 focus:ring-[#2f7f86]/15 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500";

const STORAGE_KEY = "security-page-user-detail";

const roles: RoleItem[] = [
  { id: 1, title: "ادمین" },
  { id: 2, title: "کاربر سازمانی" },
  { id: 3, title: "مدیر واحد" },
];

const mockUserDetail: UserDetail = {
  id: 1,
  guid: "00000000-0000-0000-0000-000000000001",
  firstName: "محمد",
  lastName: "محمدی",
  displayName: "محمد محمدی",
  userName: "mohammad.mohammadi",
  nationalId: "۱۲۳۴۵۶۷۸۹۰",
  nationalCode: "۱۲۳۴۵۶۷۸۹۰",
  birthCertificateNo: "۱۲۳۴۵",
  fatherName: "احمد",
  attendanceCardNo: "10025",
  genderId: 1,
  birthDate: "1995-04-12",
  issuePlace: "سنندج",
  birthPlaceId: 1,
  postId: 387,
  unitId: 1,
  roleId: 1,
  hireDate: "2020-03-20",
  workStartDate: "2020-04-01",
  workEndDate: null,
  degreeId: 5,
  marriageStatusId: 2,
  employementTypeId: 35,
  employementGroupId: 1,
  shahidChild: false,
  janbaz: false,
  janbazPercent: 0,
  phoneNo: "۰۸۷۳۳۲۲۱۱۰۰",
  phone: "۰۸۷۳۳۲۲۱۱۰۰",
  mobileNo: "۰۹۱۸۰۰۰۰۰۰۰",
  mobile: "۰۹۱۸۰۰۰۰۰۰۰",
  emailAddress: "user@sanandaj.ir",
  address: "سنندج، شهرداری مرکزی",
  bankNumber: "۶۰۳۷۹۹۰۰۰۰۰۰۰۰۰۰",
  bankId: 1,
  reward: true,
  enable: true,
  status: "فعال",
  description: "کاربر نمونه جهت نمایش صفحه حساب کاربری و امنیت",
  imageProfile: null,
};

const genderMap: Record<number, string> = {
  1: "مرد",
  2: "زن",
};

const marriageMap: Record<number, string> = {
  1: "مجرد",
  2: "متاهل",
  3: "معیل",
  4: "متکفل",
  5: "زن سرپرست خانوار",
  6: "نامشخص",
};

const degreeMap: Record<number, string> = {
  1: "زیر دیپلم",
  3: "دیپلم",
  4: "کاردانی",
  5: "کارشناسی",
  6: "کارشناسی ارشد",
  7: "دکترا",
  12: "دکتری تخصصی",
  13: "دکتری حرفه‌ای",
  14: "بی‌سواد",
  15: "زیر سیکل",
  16: "نامشخص",
  17: "تحصیلات حوزه‌ای",
  21: "درجه هنری",
  28: "دانشوری",
  29: "دانشنامه تخصصی",
  30: "تخصصی - پره برد",
  31: "بورد تخصصی",
  32: "فوق تخصص بالینی",
  33: "تکمیلی تخصصی",
  34: "دکتری تخصصی فلوشیپ",
  35: "نامشخص",
};

const employmentTypeMap: Record<number, string> = {
  35: "شرکتی",
};

const postMap: Record<number, string> = {
  387: "کارشناس نرم افزار",
};

const unitMap: Record<number, string> = {
  1: "واحد فناوری اطلاعات",
};

const bankMap: Record<number, string> = {
  1: "بانک ملی",
};

const employmentGroupMap: Record<number, string> = {
  1: "گروه اصلی شهرداری",
};

function getText(...values: unknown[]) {
  for (const value of values) {
    if (value === 0) return "0";
    if (value === false) return "False";
    if (value === true) return "True";

    const text = String(value ?? "").trim();

    if (text) return text;
  }

  return "-";
}

function getLookupValue(map: Record<number, string>, id?: number | null, fallbackLabel = "شناسه") {
  if (id === null || id === undefined) return null;

  const numericId = Number(id);

  if (Number.isNaN(numericId)) return null;

  return map[numericId] || `${fallbackLabel}: ${numericId}`;
}

function nullableText(value: string) {
  const text = value.trim();

  return text ? text : null;
}

function booleanFa(value: unknown) {
  if (value === true) return "بله";
  if (value === false) return "خیر";

  return "-";
}

function formatDate(value?: string | null) {
  if (!value) return "-";

  if (value.includes("/")) return value;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getImageSrc(imageProfile?: UserFile | string | null) {
  if (!imageProfile) return null;

  if (typeof imageProfile === "string") {
    return imageProfile.trim() ? imageProfile : null;
  }

  if (imageProfile.url) return imageProfile.url;

  if (imageProfile.data) {
    const extension = imageProfile.extension || "png";

    return `data:image/${extension.replace(".", "")};base64,${imageProfile.data}`;
  }

  return null;
}

function fileToApiImage(file: File): Promise<UserFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = String(reader.result || "");
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      const extension = file.name.includes(".") ? file.name.split(".").pop() || "" : "";

      resolve({
        fileName: file.name,
        extension,
        size: file.size,
        data: base64,
        url: null,
        id: 0,
        guid: "00000000-0000-0000-0000-000000000000",
      });
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getRoleTitle(roleList: RoleItem[], roleId?: number | null) {
  if (!roleId) return "-";

  const role = roleList.find((item) => item.id === Number(roleId));

  return role?.title || `شناسه نقش: ${roleId}`;
}

function readSavedUser() {
  if (typeof window === "undefined") return mockUserDetail;

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return mockUserDetail;

  try {
    return JSON.parse(saved) as UserDetail;
  } catch {
    return mockUserDetail;
  }
}

function saveUserToStorage(user: UserDetail) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function DashboardPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-slate-50" dir="ltr">
      <div className="fixed right-0 top-0 z-40 h-screen shrink-0" dir="rtl">
        <Sidebar />
      </div>

      <main className="min-h-screen bg-slate-50 pr-[300px] transition-all" dir="rtl">
        <Header />

        <div className="px-8 py-6">
          <div className="mx-auto w-full max-w-[2100px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoRow({ label, value }: ProfileField) {
  return (
    <div className="grid grid-cols-1 border-b border-slate-100 last:border-b-0 md:grid-cols-[190px_1fr]">
      <div className="bg-slate-50/80 px-4 py-3 text-[13px] font-extrabold text-slate-600">{label}</div>
      <div className="px-4 py-3 text-[13px] font-bold text-slate-900">{value || "-"}</div>
    </div>
  );
}

function SectionCard({ title, description, icon, children }: { title: string; description?: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#163647]/10 text-[#163647]">{icon}</span>

          <div>
            <h2 className="text-[14px] font-black text-slate-900">{title}</h2>
            {description ? <p className="mt-1 text-[11px] font-bold text-slate-500">{description}</p> : null}
          </div>
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}

function TextInput({ label, value, onChange, icon, type = "text", placeholder, disabled = false }: { label: string; value: string; onChange: (value: string) => void; icon?: React.ReactNode; type?: string; placeholder?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="mb-2 block text-[12px] font-black text-slate-700">{label}</label>

      <div className="relative">
        <input type={type} value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={INPUT_CLASS} dir="rtl" />
        {icon ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span> : null}
      </div>
    </div>
  );
}

function AlertBox({ type, message, onClose }: { type: "success" | "error"; message: string; onClose: () => void }) {
  return (
    <div className={["flex items-center justify-between rounded-2xl border px-4 py-3 text-[13px] font-bold shadow-sm", type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"].join(" ")}>
      <div className="flex items-center gap-2">
        <FiAlertCircle size={18} />
        {message}
      </div>

      <button type="button" onClick={onClose} className="cursor-pointer rounded-lg p-1 transition hover:bg-black/5">
        <FiX size={18} />
      </button>
    </div>
  );
}

function ProfileImageUploader({ currentImage, isEditing, onImageChange }: { currentImage: UserFile | string | null | undefined; isEditing: boolean; onImageChange: (image: UserFile | string | null | undefined) => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const currentImageSrc = getImageSrc(currentImage);
  const shownImage = localPreview || (!removed ? currentImageSrc : null);

  useEffect(() => {
    setLocalPreview(null);
    setRemoved(false);
    setSelectedFileName("");
  }, [currentImageSrc]);

  const handlePickImage = () => {
    if (!isEditing) return;

    inputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("لطفاً فقط فایل تصویر انتخاب کنید.");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const apiImage = await fileToApiImage(file);

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setLocalPreview(previewUrl);
    setSelectedFileName(file.name);
    setRemoved(false);
    onImageChange(apiImage);
  };

  const handleRemoveImage = () => {
    if (!isEditing) return;

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    setLocalPreview(null);
    setSelectedFileName("");
    setRemoved(true);
    onImageChange(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative h-full rounded-3xl border border-slate-200 bg-slate-50 p-4 text-center">
      <input ref={inputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

      <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-3xl bg-slate-200 text-slate-400">
        {shownImage ? <img src={shownImage} alt="تصویر پروفایل" className="h-full w-full object-cover" /> : <FiUser size={72} />}
      </div>

      <button type="button" onClick={handlePickImage} disabled={!isEditing} className={["mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border text-[12px] font-black transition", isEditing ? "cursor-pointer border-slate-300 bg-white text-slate-600 hover:bg-slate-100" : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"].join(" ")}>
        <FiCamera size={15} />
        انتخاب تصویر
      </button>

      {shownImage ? (
        <button type="button" onClick={handleRemoveImage} disabled={!isEditing} className={["mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl border text-[12px] font-black transition", isEditing ? "cursor-pointer border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100" : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"].join(" ")}>
          <FiTrash2 size={14} />
          حذف تصویر
        </button>
      ) : null}

      {selectedFileName ? <div className="mt-2 truncate text-[11px] font-bold text-slate-500">{selectedFileName}</div> : null}

      {!isEditing ? <div className="mt-2 text-[11px] font-bold text-slate-400">برای تغییر تصویر، ابتدا ویرایش اطلاعات را فعال کنید</div> : null}
    </div>
  );
}

function ProfileSummaryCard({ detail, roles }: { detail: UserDetail | null; roles: RoleItem[] }) {
  const fullName = getText(detail?.displayName, `${detail?.firstName || ""} ${detail?.lastName || ""}`.trim(), detail?.userName);
  const position = getText((detail as any)?.postTitle, (detail as any)?.postName, (detail as any)?.position, getLookupValue(postMap, detail?.postId, "شناسه پست"));
  const unit = getText((detail as any)?.unitTitle, (detail as any)?.unitName, (detail as any)?.unit, getLookupValue(unitMap, detail?.unitId, "شناسه واحد"));
  const roleTitle = getRoleTitle(roles, detail?.roleId);

  return (
    <div className="flex h-full min-h-[190px] items-center rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#163647]/10 text-[#163647]">
          <FiUser size={30} />
        </div>

        <div>
          <div className="text-[21px] font-black text-slate-950">{fullName}</div>

          <div className="mt-2 flex items-center gap-2 text-[13px] font-extrabold text-slate-500">
            <FiBriefcase size={15} />
            {position}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black text-slate-500">واحد: {unit}</span>
            <span className="inline-flex rounded-full bg-[#2f7f86]/10 px-3 py-1 text-[11px] font-black text-[#2f7f86]">نقش: {roleTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SecurityPage() {
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imagePayload, setImagePayload] = useState<UserFile | string | null | undefined>(undefined);

  const [mainForm, setMainForm] = useState<MainForm>({
    firstName: "",
    lastName: "",
    userName: "",
  });

  const [contactForm, setContactForm] = useState<ContactForm>({
    phoneNo: "",
    mobileNo: "",
    emailAddress: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const hydrateForms = (user: UserDetail | null) => {
    setMainForm({
      firstName: getText(user?.firstName) === "-" ? "" : getText(user?.firstName),
      lastName: getText(user?.lastName) === "-" ? "" : getText(user?.lastName),
      userName: getText(user?.userName) === "-" ? "" : getText(user?.userName),
    });

    setContactForm({
      phoneNo: getText(user?.phoneNo, user?.phone) === "-" ? "" : getText(user?.phoneNo, user?.phone),
      mobileNo: getText(user?.mobileNo, user?.mobile) === "-" ? "" : getText(user?.mobileNo, user?.mobile),
      emailAddress: getText(user?.emailAddress) === "-" ? "" : getText(user?.emailAddress),
      address: getText(user?.address) === "-" ? "" : getText(user?.address),
    });

    setImagePayload(undefined);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const savedUser = readSavedUser();

      setDetail(savedUser);
      hydrateForms(savedUser);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const personalFields = useMemo<ProfileField[]>(() => {
    const genderTitle = getText((detail as any)?.genderTitle, (detail as any)?.genderName, getLookupValue(genderMap, detail?.genderId, "شناسه جنسیت"));
    const degreeTitle = getText((detail as any)?.degreeTitle, (detail as any)?.degreeName, (detail as any)?.degree, getLookupValue(degreeMap, detail?.degreeId, "شناسه مقطع"));
    const marriageTitle = getText((detail as any)?.marriageStatusTitle, (detail as any)?.marriageStatusName, (detail as any)?.marriageStatus, getLookupValue(marriageMap, detail?.marriageStatusId, "شناسه وضعیت"));
    const employmentTypeTitle = getText((detail as any)?.employementTypeTitle, (detail as any)?.employmentTypeTitle, (detail as any)?.employementTypeName, (detail as any)?.employmentTypeName, (detail as any)?.employementType, (detail as any)?.employmentType, getLookupValue(employmentTypeMap, detail?.employementTypeId, "شناسه نوع نیرو"));
    const unitTitle = getText((detail as any)?.unitTitle, (detail as any)?.unitName, (detail as any)?.unit, getLookupValue(unitMap, detail?.unitId, "شناسه واحد"));
    const postTitle = getText((detail as any)?.postTitle, (detail as any)?.postName, (detail as any)?.position, getLookupValue(postMap, detail?.postId, "شناسه پست"));
    const bankTitle = getText((detail as any)?.bankTitle, (detail as any)?.bankName, getLookupValue(bankMap, detail?.bankId, "شناسه بانک"));
    const employmentGroupTitle = getText((detail as any)?.employementGroupTitle, (detail as any)?.employmentGroupTitle, (detail as any)?.employementGroupName, (detail as any)?.employmentGroupName, (detail as any)?.employementGroup, (detail as any)?.employmentGroup, getLookupValue(employmentGroupMap, detail?.employementGroupId, "شناسه گروه"));

    return [
      { label: "نام", value: getText(detail?.firstName) },
      { label: "نام خانوادگی", value: getText(detail?.lastName) },
      { label: "نام کاربری", value: getText(detail?.userName) },
      { label: "نقش", value: getRoleTitle(roles, detail?.roleId) },
      { label: "کد ملی", value: getText(detail?.nationalId, detail?.nationalCode) },
      { label: "شماره شناسنامه", value: getText(detail?.birthCertificateNo) },
      { label: "نام پدر", value: getText(detail?.fatherName) },
      { label: "شماره کارت حضور", value: getText(detail?.attendanceCardNo) },
      { label: "جنسیت", value: genderTitle },
      { label: "تاریخ تولد", value: formatDate(detail?.birthDate) },
      { label: "محل صدور", value: getText(detail?.issuePlace) },
      { label: "محل تولد", value: getText(detail?.birthPlaceId ? `شناسه محل تولد: ${detail.birthPlaceId}` : null) },
      { label: "پست سازمانی", value: postTitle },
      { label: "واحد محل خدمت", value: unitTitle },
      { label: "تاریخ استخدام", value: formatDate(detail?.hireDate) },
      { label: "تاریخ شروع به کار", value: formatDate(detail?.workStartDate) },
      { label: "تاریخ پایان کار", value: formatDate(detail?.workEndDate) },
      { label: "مقطع تحصیلی", value: degreeTitle },
      { label: "وضعیت تأهل", value: marriageTitle },
      { label: "نوع نیرو", value: employmentTypeTitle },
      { label: "نوع قانون", value: getText((detail as any)?.lawTypeTitle, (detail as any)?.lawTypeName, (detail as any)?.lawType) },
      { label: "فرزند شهید", value: booleanFa(detail?.shahidChild) },
      { label: "جانباز", value: booleanFa(detail?.janbaz) },
      { label: "درصد جانبازی", value: getText(detail?.janbazPercent) },
      { label: "شماره حساب بانکی", value: getText(detail?.bankNumber) },
      { label: "نام بانک", value: bankTitle },
      { label: "گروه اصلی", value: employmentGroupTitle },
      { label: "مشمول کارانه", value: booleanFa(detail?.reward) },
      { label: "وضعیت کاربر", value: detail?.enable === true ? "فعال" : detail?.enable === false ? "غیرفعال" : getText(detail?.status) },
      { label: "آدرس", value: getText(detail?.address) },
      { label: "توضیحات", value: getText(detail?.description) },
    ];
  }, [detail]);

  const updateMain = (key: keyof MainForm, value: string) => {
    setMainForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateContact = (key: keyof ContactForm, value: string) => {
    setContactForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePassword = (key: keyof PasswordForm, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setAlert(null);
  };

  const handleCancelEdit = () => {
    hydrateForms(detail);
    setIsEditing(false);
    setAlert(null);
  };

  const buildPayload = (patch: Partial<UserDetail>): UserDetail => {
    const firstName = patch.firstName ?? mainForm.firstName;
    const lastName = patch.lastName ?? mainForm.lastName;
    const displayName = getText(patch.displayName, `${firstName || ""} ${lastName || ""}`.trim(), detail?.displayName);

    return {
      ...(detail || {}),
      ...patch,
      firstName,
      lastName,
      displayName,
      id: detail?.id,
      guid: detail?.guid,
    };
  };

  const handleSaveInfo = () => {
    if (!detail) return;

    if (!mainForm.firstName.trim() || !mainForm.lastName.trim() || !mainForm.userName.trim()) {
      setAlert({
        type: "error",
        message: "نام، نام خانوادگی و نام کاربری الزامی هستند.",
      });
      return;
    }

    setSaving(true);
    setAlert(null);

    setTimeout(() => {
      const payload = buildPayload({
        firstName: mainForm.firstName.trim(),
        lastName: mainForm.lastName.trim(),
        userName: mainForm.userName.trim(),
        phoneNo: nullableText(contactForm.phoneNo),
        phone: nullableText(contactForm.phoneNo),
        mobileNo: nullableText(contactForm.mobileNo),
        mobile: nullableText(contactForm.mobileNo),
        emailAddress: nullableText(contactForm.emailAddress),
        address: nullableText(contactForm.address),
        imageProfile: imagePayload === undefined ? detail.imageProfile ?? null : imagePayload,
      });

      setDetail(payload);
      saveUserToStorage(payload);
      setIsEditing(false);
      setImagePayload(undefined);
      setSaving(false);

      setAlert({
        type: "success",
        message: "اطلاعات کاربر با موفقیت ذخیره شد.",
      });
    }, 500);
  };

  const handleChangePassword = () => {
    if (!detail) return;

    if (!passwordForm.currentPassword.trim() || !passwordForm.newPassword.trim() || !passwordForm.repeatPassword.trim()) {
      setAlert({
        type: "error",
        message: "برای تغییر رمز عبور، همه فیلدهای رمز را کامل کنید.",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.repeatPassword) {
      setAlert({
        type: "error",
        message: "رمز عبور جدید و تکرار آن یکسان نیست.",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({
        type: "error",
        message: "رمز عبور جدید باید حداقل ۶ کاراکتر باشد.",
      });
      return;
    }

    setSaving(true);
    setAlert(null);

    setTimeout(() => {
      const payload = buildPayload({
        password: passwordForm.newPassword,
        keyPass: passwordForm.currentPassword,
      });

      setDetail(payload);
      saveUserToStorage(payload);

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        repeatPassword: "",
      });

      setSaving(false);

      setAlert({
        type: "success",
        message: "رمز عبور با موفقیت تغییر کرد.",
      });
    }, 500);
  };

  const handleResetMockData = () => {
    setDetail(mockUserDetail);
    hydrateForms(mockUserDetail);
    saveUserToStorage(mockUserDetail);
    setIsEditing(false);
    setImagePayload(undefined);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    });
    setAlert({
      type: "success",
      message: "اطلاعات نمونه دوباره بارگذاری شد.",
    });
  };

  if (loading) {
    return (
      <DashboardPageShell>
        <div className="flex min-h-[420px] items-center justify-center" dir="rtl">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-center shadow-sm">
            <FiRefreshCw className="mx-auto mb-3 animate-spin text-[#2f7f86]" size={28} />
            <div className="text-[13px] font-black text-slate-700">در حال دریافت اطلاعات حساب کاربری...</div>
          </div>
        </div>
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell>
      <div className="space-y-6" dir="rtl">
        {alert ? <AlertBox type={alert.type} message={alert.message} onClose={() => setAlert(null)} /> : null}

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 bg-[#1e5161] px-5 py-4 text-white md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/10">
                <FiShield size={18} />
              </span>

              <div>
                <h1 className="text-[15px] font-black">حساب کاربری و امنیت</h1>
                <p className="mt-1 text-[11px] font-bold text-white/70">مشاهده اطلاعات پرسنلی، ویرایش اطلاعات تماس و تغییر رمز عبور</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={handleResetMockData} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-[12px] font-black text-white ring-1 ring-white/20 transition hover:bg-white/15">
                <FiRefreshCw size={16} />
                بازنشانی نمونه
              </button>

              {!isEditing ? (
                <button type="button" onClick={handleStartEdit} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/95 px-4 py-2 text-[12px] font-black text-[#163647] shadow-sm transition hover:bg-white">
                  <FiEdit3 size={16} />
                  ویرایش اطلاعات
                </button>
              ) : (
                <>
                  <button type="button" onClick={handleCancelEdit} disabled={saving} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-[12px] font-black text-white ring-1 ring-white/20 transition hover:bg-white/15 disabled:opacity-60">
                    <FiX size={16} />
                    انصراف
                  </button>

                  <button type="button" onClick={handleSaveInfo} disabled={saving} className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-[12px] font-black text-[#163647] shadow-sm transition hover:bg-slate-50 disabled:opacity-60">
                    <FiSave size={16} />
                    {saving ? "در حال ذخیره..." : "ذخیره اطلاعات"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-5 xl:grid-cols-[1fr_260px]">
            <ProfileSummaryCard detail={detail} roles={roles} />
            <ProfileImageUploader currentImage={detail?.imageProfile} isEditing={isEditing} onImageChange={setImagePayload} />
          </div>
        </section>

        <SectionCard title="ویرایش اطلاعات اصلی" description={isEditing ? "حالت ویرایش فعال است" : "برای ویرایش، دکمه ویرایش اطلاعات را بزنید"} icon={<FiUser size={17} />}>
          <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
            <TextInput label="نام" value={mainForm.firstName} onChange={(value) => updateMain("firstName", value)} icon={<FiUser size={16} />} placeholder="نام" disabled={!isEditing} />
            <TextInput label="نام خانوادگی" value={mainForm.lastName} onChange={(value) => updateMain("lastName", value)} icon={<FiUser size={16} />} placeholder="نام خانوادگی" disabled={!isEditing} />
            <TextInput label="نام کاربری" value={mainForm.userName} onChange={(value) => updateMain("userName", value)} icon={<FiUser size={16} />} placeholder="نام کاربری" disabled={!isEditing} />
          </div>

          {isEditing ? (
            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 md:hidden">
              <button type="button" onClick={handleCancelEdit} disabled={saving} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-[13px] font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-60">
                <FiX size={16} />
                انصراف
              </button>

              <button type="button" onClick={handleSaveInfo} disabled={saving} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#2f7f86] px-6 text-[13px] font-black text-white shadow-sm transition hover:bg-[#256b71] disabled:opacity-60">
                <FiSave size={16} />
                ذخیره
              </button>
            </div>
          ) : null}
        </SectionCard>

        <SectionCard title="اطلاعات پرسنلی" description="در این نسخه، اطلاعات از داده نمونه داخل همین صفحه خوانده می‌شود." icon={<FiUser size={17} />}>
          <div className="grid grid-cols-1 xl:grid-cols-2">
            {personalFields.map((field) => (
              <InfoRow key={field.label} label={field.label} value={field.value} />
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <SectionCard title="اطلاعات تماس" description={isEditing ? "حالت ویرایش فعال است" : "برای ویرایش، دکمه ویرایش اطلاعات را بزنید"} icon={<FiPhone size={17} />}>
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              <TextInput label="شماره تلفن ثابت / داخلی" value={contactForm.phoneNo} onChange={(value) => updateContact("phoneNo", value)} icon={<FiPhone size={16} />} placeholder="شماره تلفن ثابت یا داخلی" disabled={!isEditing} />
              <TextInput label="شماره تلفن همراه" value={contactForm.mobileNo} onChange={(value) => updateContact("mobileNo", value)} icon={<FiSmartphone size={16} />} placeholder="شماره تلفن همراه" disabled={!isEditing} />
              <TextInput label="پست الکترونیک" value={contactForm.emailAddress} onChange={(value) => updateContact("emailAddress", value)} icon={<FiMail size={16} />} placeholder="پست الکترونیک" disabled={!isEditing} />
              <TextInput label="آدرس" value={contactForm.address} onChange={(value) => updateContact("address", value)} icon={<FiMapPin size={16} />} placeholder="آدرس" disabled={!isEditing} />

              {isEditing ? (
                <div className="flex justify-end gap-2 md:col-span-2 xl:col-span-1 2xl:col-span-2">
                  <button type="button" onClick={handleSaveInfo} disabled={saving} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#2f7f86] px-6 text-[13px] font-black text-white shadow-sm transition hover:bg-[#256b71] disabled:opacity-60">
                    <FiSave size={16} />
                    ذخیره اطلاعات تماس
                  </button>
                </div>
              ) : null}
            </div>
          </SectionCard>

          <SectionCard title="تغییر رمز عبور" description="در این نسخه، رمز فقط داخل همین صفحه شبیه‌سازی می‌شود." icon={<FiKey size={17} />}>
            <div className="p-5">
              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[13px] font-bold leading-6 text-slate-600">در صورتی که تمایل به تعویض رمز عبور خود دارید، فیلدهای زیر را تکمیل نمایید.</div>

              <div className="grid grid-cols-1 gap-4">
                <TextInput label="رمز عبور فعلی" value={passwordForm.currentPassword} onChange={(value) => updatePassword("currentPassword", value)} icon={<FiKey size={16} />} type="password" placeholder="رمز عبور فعلی" />
                <TextInput label="رمز عبور جدید" value={passwordForm.newPassword} onChange={(value) => updatePassword("newPassword", value)} icon={<FiKey size={16} />} type="password" placeholder="رمز عبور جدید" />
                <TextInput label="تکرار رمز عبور جدید" value={passwordForm.repeatPassword} onChange={(value) => updatePassword("repeatPassword", value)} icon={<FiKey size={16} />} type="password" placeholder="تکرار رمز عبور جدید" />
              </div>

              <div className="mt-5 flex justify-end">
                <button type="button" onClick={handleChangePassword} disabled={saving} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#163647] px-6 text-[13px] font-black text-white shadow-sm transition hover:bg-[#102b38] disabled:opacity-60">
                  <FiKey size={16} />
                  {saving ? "در حال ثبت..." : "ثبت تغییر رمز عبور"}
                </button>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </DashboardPageShell>
  );
}