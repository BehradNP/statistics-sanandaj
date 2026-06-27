"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { IconType } from "react-icons";
import { FiAlignRight, FiArrowDown, FiArrowRight, FiArrowUp, FiCalendar, FiCheck, FiCheckSquare, FiChevronDown, FiCircle, FiClock, FiCopy, FiEye, FiFileText, FiHash, FiImage, FiList, FiMail, FiMove, FiPhone, FiPlus, FiRefreshCcw, FiSave, FiSettings, FiSmartphone, FiToggleRight, FiTrash2, FiType, FiUploadCloud, FiX, FiZap } from "react-icons/fi";

type BuilderTab = "design"  | "template";
type FieldType = "text" | "number" | "textarea" | "phone" | "mobile" | "email" | "date" | "time" | "select" | "radio" | "checkbox" | "file" | "image" | "status";

type FieldOption = {
  id: string;
  label: string;
  value: string;
};

type UploadedFileValue = {
  fileName: string;
  size: number;
  type: string;
  dataUrl?: string;
};

type FieldValue = string | boolean | string[] | UploadedFileValue | null;

type BuilderField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  helper: string;
  required: boolean;
  width: "full" | "half";
  options?: FieldOption[];
};

type FieldTemplate = {
  type: FieldType;
  title: string;
  icon: IconType;
  accent: string;
};

const fieldTemplates: FieldTemplate[] = [
  { type: "text", title: "متن", icon: FiType, accent: "bg-blue-50 text-blue-700 border-blue-100" },
  { type: "number", title: "عدد", icon: FiHash, accent: "bg-amber-50 text-amber-700 border-amber-100" },
  { type: "textarea", title: "متن چند خطی", icon: FiAlignRight, accent: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  { type: "phone", title: "تلفن", icon: FiPhone, accent: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  { type: "mobile", title: "موبایل", icon: FiSmartphone, accent: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100" },
  { type: "email", title: "ایمیل", icon: FiMail, accent: "bg-orange-50 text-orange-700 border-orange-100" },
  { type: "date", title: "تاریخ", icon: FiCalendar, accent: "bg-teal-50 text-teal-700 border-teal-100" },
  { type: "time", title: "ساعت", icon: FiClock, accent: "bg-yellow-50 text-yellow-700 border-yellow-100" },
  { type: "select", title: "لیست کشویی", icon: FiList, accent: "bg-sky-50 text-sky-700 border-sky-100" },
  { type: "radio", title: "دکمه رادیویی", icon: FiCircle, accent: "bg-cyan-50 text-cyan-700 border-cyan-100" },
  { type: "checkbox", title: "چک‌باکس", icon: FiCheckSquare, accent: "bg-rose-50 text-rose-700 border-rose-100" },
  { type: "file", title: "فایل", icon: FiFileText, accent: "bg-slate-50 text-slate-700 border-slate-100" },
  { type: "image", title: "تصویر", icon: FiImage, accent: "bg-green-50 text-green-700 border-green-100" },
  { type: "status", title: "وضعیت", icon: FiToggleRight, accent: "bg-violet-50 text-violet-700 border-violet-100" },
];

const defaultFields: BuilderField[] = [
  { id: "field-title", type: "text", label: "عنوان پروژه", placeholder: "عنوان پروژه را وارد کنید", helper: "نام کوتاه و قابل تشخیص برای پروژه", required: true, width: "full" },
  { id: "field-category", type: "select", label: "دسته‌بندی پروژه", placeholder: "انتخاب دسته‌بندی", helper: "دسته‌بندی پروژه را انتخاب کنید", required: true, width: "half", options: [{ id: "option-1", label: "عمرانی", value: "عمرانی" }, { id: "option-2", label: "خدمات شهری", value: "خدمات شهری" }, { id: "option-3", label: "سیما و منظر", value: "سیما و منظر" }] },
];

function makeId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDefaultOptions(type: FieldType): FieldOption[] | undefined {
  if (!["select", "radio", "checkbox"].includes(type)) return undefined;
  return [{ id: makeId("option"), label: "گزینه اول", value: "گزینه اول" }, { id: makeId("option"), label: "گزینه دوم", value: "گزینه دوم" }];
}

function getInitialValue(type: FieldType): FieldValue {
  if (type === "checkbox") return [];
  if (type === "status") return false;
  if (type === "file" || type === "image") return null;
  return "";
}

function makeField(template: FieldTemplate): BuilderField {
  return { id: makeId("field"), type: template.type, label: template.title, placeholder: `${template.title} را وارد کنید`, helper: "", required: false, width: "full", options: getDefaultOptions(template.type) };
}

function createInitialValues(fields: BuilderField[]) {
  return fields.reduce<Record<string, FieldValue>>((acc, field) => {
    acc[field.id] = getInitialValue(field.type);
    return acc;
  }, {});
}

function getTemplate(type: FieldType) {
  return fieldTemplates.find((item) => item.type === type) ?? fieldTemplates[0];
}

function isEmptyValue(field: BuilderField, value: FieldValue) {
  if (!field.required) return false;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (value === null) return true;
  return false;
}

function formatSize(size: number) {
  if (size < 1024) return `${size} بایت`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} کیلوبایت`;
  return `${(size / 1024 / 1024).toFixed(1)} مگابایت`;
}

function RenderFormField({ field, value, onChange, error }: { field: BuilderField; value: FieldValue; onChange: (value: FieldValue) => void; error?: boolean }) {
  const textValue = typeof value === "string" ? value : "";
  const boolValue = typeof value === "boolean" ? value : false;
  const selectedValues = Array.isArray(value) ? value : [];
  const fileValue = value && typeof value === "object" && !Array.isArray(value) ? value as UploadedFileValue : null;

  const inputClass = `h-12 w-full rounded-2xl border ${error ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"} px-4 text-[13px] font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2f7f86] focus:bg-white`;

  if (field.type === "textarea") return <textarea value={textValue} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className={`min-h-28 w-full resize-none rounded-2xl border ${error ? "border-rose-300 bg-rose-50" : "border-slate-200 bg-slate-50"} px-4 py-3 text-[13px] font-bold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#2f7f86] focus:bg-white`} />;

  if (field.type === "select") return (
    <div className="relative">
      <select value={textValue} onChange={(event) => onChange(event.target.value)} className={`${inputClass} appearance-none`}>
        <option value="">{field.placeholder || "انتخاب کنید"}</option>
        {(field.options ?? []).map((option) => <option key={option.id} value={option.value}>{option.label}</option>)}
      </select>
      <FiChevronDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
    </div>
  );

  if (field.type === "radio") return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {(field.options ?? []).map((option) => (
        <button key={option.id} type="button" onClick={() => onChange(option.value)} className={`flex h-12 items-center gap-3 rounded-2xl border px-4 text-right text-[13px] font-extrabold transition ${textValue === option.value ? "border-[#2f7f86] bg-[#eaf5f5] text-[#2f7f86]" : error ? "border-rose-200 bg-rose-50 text-slate-600" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"}`}>
          <span className={`flex size-5 items-center justify-center rounded-full border ${textValue === option.value ? "border-[#2f7f86]" : "border-slate-300"}`}>{textValue === option.value && <span className="size-2.5 rounded-full bg-[#2f7f86]" />}</span>
          {option.label}
        </button>
      ))}
    </div>
  );

  if (field.type === "checkbox") return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {(field.options ?? []).map((option) => {
        const checked = selectedValues.includes(option.value);
        return (
          <button key={option.id} type="button" onClick={() => onChange(checked ? selectedValues.filter((item) => item !== option.value) : [...selectedValues, option.value])} className={`flex h-12 items-center gap-3 rounded-2xl border px-4 text-right text-[13px] font-extrabold transition ${checked ? "border-[#2f7f86] bg-[#eaf5f5] text-[#2f7f86]" : error ? "border-rose-200 bg-rose-50 text-slate-600" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"}`}>
            <span className={`flex size-5 items-center justify-center rounded-md border ${checked ? "border-[#2f7f86] bg-[#2f7f86] text-white" : "border-slate-300 bg-white"}`}>{checked && <FiCheck size={14} />}</span>
            {option.label}
          </button>
        );
      })}
    </div>
  );

  if (field.type === "file" || field.type === "image") return (
    <label className={`flex min-h-32 cursor-pointer items-center justify-center rounded-2xl border border-dashed ${error ? "border-rose-300 bg-rose-50" : "border-slate-300 bg-slate-50"} px-4 py-5 transition hover:bg-white`}>
      <input type="file" accept={field.type === "image" ? "image/*" : undefined} className="hidden" onChange={(event) => {
        const file = event.target.files?.[0];
        if (!file) return onChange(null);
        if (field.type === "image") {
          const reader = new FileReader();
          reader.onloadend = () => onChange({ fileName: file.name, size: file.size, type: file.type, dataUrl: typeof reader.result === "string" ? reader.result : "" });
          reader.readAsDataURL(file);
          return;
        }
        onChange({ fileName: file.name, size: file.size, type: file.type });
      }} />
      {fileValue ? (
        <div className="w-full text-center">
          {field.type === "image" && fileValue.dataUrl && <img src={fileValue.dataUrl} alt={fileValue.fileName} className="mx-auto mb-3 h-28 w-40 rounded-2xl object-cover" />}
          <p className="text-[13px] font-black text-slate-800">{fileValue.fileName}</p>
          <p className="mt-1 text-[12px] font-bold text-slate-500">{formatSize(fileValue.size)}</p>
        </div>
      ) : (
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-white text-[#2f7f86] shadow-sm"><FiUploadCloud size={24} /></div>
          <p className="text-[13px] font-black text-slate-700">برای انتخاب {field.type === "image" ? "تصویر" : "فایل"} کلیک کنید</p>
          <p className="mt-1 text-[12px] font-bold text-slate-400">{field.placeholder}</p>
        </div>
      )}
    </label>
  );

  if (field.type === "status") return (
    <button type="button" onClick={() => onChange(!boolValue)} className={`flex h-12 w-full items-center justify-between rounded-2xl border px-4 text-[13px] font-extrabold transition ${boolValue ? "border-[#2f7f86] bg-[#eaf5f5] text-[#2f7f86]" : error ? "border-rose-200 bg-rose-50 text-slate-600" : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-white"}`}>
      <span>{boolValue ? "فعال" : "غیرفعال"}</span>
      <span className={`flex h-6 w-11 items-center rounded-full p-1 transition ${boolValue ? "justify-start bg-[#2f7f86]" : "justify-end bg-slate-300"}`}><span className="size-4 rounded-full bg-white" /></span>
    </button>
  );

  return <input type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "date" ? "date" : field.type === "time" ? "time" : field.type === "phone" || field.type === "mobile" ? "tel" : "text"} value={textValue} onChange={(event) => onChange(event.target.value)} placeholder={field.placeholder} className={inputClass} />;
}

export default function CreateProjectFormatPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BuilderTab>("design");
  const [formTitle, setFormTitle] = useState("قالب پروژه جدید");
  const [formDescription, setFormDescription] = useState("توضیحات مربوط به قالب فرم در اینجا نمایش داده می‌شود");
  const [fields, setFields] = useState<BuilderField[]>(defaultFields);
  const [selectedId, setSelectedId] = useState(defaultFields[0].id);
  const [formValues, setFormValues] = useState<Record<string, FieldValue>>(createInitialValues(defaultFields));
  const [message, setMessage] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewErrors, setPreviewErrors] = useState<string[]>([]);

  const selectedField = useMemo(() => fields.find((field) => field.id === selectedId) ?? null, [fields, selectedId]);

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3000);
  };

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/defining-the-project-format");
  };

  const addField = (template: FieldTemplate) => {
    const newField = makeField(template);
    setFields((prev) => [...prev, newField]);
    setFormValues((prev) => ({ ...prev, [newField.id]: getInitialValue(newField.type) }));
    setSelectedId(newField.id);
    showMessage("فیلد جدید به فرم اضافه شد.");
  };

  const removeField = (id: string) => {
    setFields((prev) => {
      const next = prev.filter((field) => field.id !== id);
      if (selectedId === id) setSelectedId(next[0]?.id ?? "");
      return next;
    });
    setFormValues((prev) => {
      const clone = { ...prev };
      delete clone[id];
      return clone;
    });
    showMessage("فیلد از فرم حذف شد.");
  };

  const duplicateField = (field: BuilderField) => {
    const newField: BuilderField = { ...field, id: makeId("field"), label: `${field.label} کپی`, options: field.options?.map((option) => ({ ...option, id: makeId("option") })) };
    setFields((prev) => [...prev, newField]);
    setFormValues((prev) => ({ ...prev, [newField.id]: getInitialValue(newField.type) }));
    setSelectedId(newField.id);
    showMessage("یک کپی از فیلد ساخته شد.");
  };

  const updateSelectedField = (patch: Partial<BuilderField>) => {
    if (!selectedField) return;
    setFields((prev) => prev.map((field) => field.id === selectedField.id ? { ...field, ...patch } : field));
  };

  const updateFieldValue = (fieldId: string, value: FieldValue) => {
    setFormValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const moveField = (id: string, direction: "up" | "down") => {
    setFields((prev) => {
      const index = prev.findIndex((field) => field.id === id);
      const nextIndex = direction === "up" ? index - 1 : index + 1;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.length) return prev;
      const clone = [...prev];
      const current = clone[index];
      clone[index] = clone[nextIndex];
      clone[nextIndex] = current;
      return clone;
    });
  };

  const resetBuilder = () => {
    setFields(defaultFields);
    setSelectedId(defaultFields[0].id);
    setFormValues(createInitialValues(defaultFields));
    setFormTitle("قالب پروژه جدید");
    setFormDescription("توضیحات مربوط به قالب فرم در اینجا نمایش داده می‌شود");
    showMessage("فرم به حالت اولیه برگشت.");
  };

  const saveTemplate = () => {
    const payload = { title: formTitle, description: formDescription, fields, values: formValues };
    console.log("FORM_TEMPLATE_PAYLOAD:", payload);
    showMessage("فعلاً ذخیره واقعی انجام نمی‌شود؛ خروجی قالب داخل console ثبت شد.");
  };

  const submitPreview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = fields.filter((field) => isEmptyValue(field, formValues[field.id])).map((field) => field.id);
    setPreviewErrors(errors);
    if (errors.length > 0) return showMessage("لطفاً فیلدهای اجباری را در پیش‌نمایش تکمیل کنید.");
    console.log("PREVIEW_FORM_VALUES:", formValues);
    showMessage("اطلاعات پیش‌نمایش با موفقیت ثبت شد و داخل console قابل مشاهده است.");
  };

  const changeOptionsText = (text: string) => {
    const options = text.split("\n").map((item) => item.trim()).filter(Boolean).map((label) => ({ id: makeId("option"), label, value: label }));
    updateSelectedField({ options });
    if (selectedField?.type === "checkbox") updateFieldValue(selectedField.id, []);
    else if (selectedField) updateFieldValue(selectedField.id, "");
  };

  const schemaPreview = useMemo(() => JSON.stringify({ title: formTitle, description: formDescription, fields: fields.map((field) => ({ type: field.type, label: field.label, placeholder: field.placeholder, helper: field.helper, required: field.required, width: field.width, options: field.options })) }, null, 2), [formTitle, formDescription, fields]);

  return (
    <div className="min-h-screen bg-slate-50 px-5 py-6 text-slate-900" dir="rtl">
      <div className="mx-auto w-full max-w-[1760px] space-y-5">
        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-[#eaf5f5] text-[#2f7f86]"><FiZap size={30} /></div>
              <div>
                <h1 className="text-2xl font-black text-slate-950">فرم ساز قالب پروژه</h1>
                <p className="mt-2 text-sm font-bold text-slate-500">ساخت قالب‌های استاندارد برای ثبت، گزارش‌گیری و مدیریت پروژه‌های شهرداری</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={goBack} className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"><FiArrowRight size={18} /> بازگشت</button>
              <button type="button" onClick={() => setPreviewOpen(true)} className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:shadow-md"><FiEye size={18} /> پیش‌نمایش</button>
              <button type="button" onClick={saveTemplate} className="flex h-12 items-center gap-2 rounded-2xl bg-[#2f7f86] px-5 text-[13px] font-extrabold text-white shadow-sm transition hover:bg-[#256d73] hover:shadow-md"><FiSave size={18} /> ثبت فرم</button>
            </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => setActiveTab("design")} className={`h-12 rounded-2xl px-8 text-sm font-black transition ${activeTab === "design" ? "bg-[#eaf5f5] text-[#2f7f86]" : "text-slate-500 hover:bg-slate-50"}`}>طراحی</button>
              <button type="button" onClick={() => setActiveTab("template")} className={`h-12 rounded-2xl px-8 text-sm font-black transition ${activeTab === "template" ? "bg-[#eaf5f5] text-[#2f7f86]" : "text-slate-500 hover:bg-slate-50"}`}>قالب</button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm font-black text-slate-600">تعداد فیلدها: <span className="text-[#2f7f86]">{fields.length}</span></div>
<div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm font-black text-slate-600">حالت: <span className="text-[#2f7f86]">{activeTab === "design" ? "طراحی" : "قالب"}</span></div>            </div>
          </div>
        </section>

        {message && <div className="rounded-2xl border border-[#bfe2e2] bg-[#eefafa] px-5 py-4 text-sm font-black text-[#2f7f86]">{message}</div>}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_430px]" dir="ltr">
          <main className="space-y-5" dir="rtl">
            {activeTab !== "template" ? (
              <>
                <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-black text-slate-950">اطلاعات اصلی فرم</h2>
                      <p className="mt-1 text-sm font-bold text-slate-500">عنوان و توضیحات قالب را مشخص کنید</p>
                    </div>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eaf5f5] text-[#2f7f86]"><FiSettings size={22} /></div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-black text-slate-500">نام فرم</label>
                      <input value={formTitle} onChange={(event) => setFormTitle(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700 outline-none transition focus:border-[#2f7f86] focus:bg-white" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-black text-slate-500">توضیحات فرم</label>
                      <input value={formDescription} onChange={(event) => setFormDescription(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 outline-none transition focus:border-[#2f7f86] focus:bg-white" />
                    </div>
                  </div>
                </div>

                <div className="rounded-[26px] border border-slate-200 bg-white shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-black text-slate-950">پنل فرم</h2>
                      <p className="mt-1 text-sm font-bold text-slate-500">فیلدها را اضافه کنید، تنظیم کنید و دیتای نمونه بگیرید</p>
                    </div>
                    <button type="button" onClick={resetBuilder} className="flex h-12 w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-[13px] font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50"><FiRefreshCcw size={17} /> بازنشانی</button>
                  </div>

                  <div className="min-h-[620px] bg-gradient-to-b from-slate-50 to-white p-5">
                    {fields.length === 0 ? (
                      <div className="flex min-h-[460px] items-center justify-center rounded-[26px] border border-dashed border-slate-300 bg-white">
                        <div className="text-center">
                          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-[#eaf5f5] text-[#2f7f86]"><FiPlus size={30} /></div>
                          <h3 className="text-lg font-black text-slate-800">هنوز فیلدی اضافه نشده</h3>
                          <p className="mt-2 text-sm font-bold text-slate-500">از پنل سمت راست یک فیلد انتخاب کنید</p>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {fields.map((field, index) => {
                          const template = getTemplate(field.type);
                          const Icon = template.icon;
                          return (
                            <div key={field.id} onClick={() => setSelectedId(field.id)} className={`${field.width === "full" ? "lg:col-span-2" : ""} cursor-pointer rounded-[24px] border bg-white p-4 shadow-sm transition ${selectedId === field.id ? "border-[#2f7f86] ring-4 ring-[#2f7f86]/10" : "border-slate-200 hover:border-slate-300"}`}>
                              <div className="mb-4 flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400"><FiMove size={18} /></div>
                                  <div className={`flex size-11 items-center justify-center rounded-xl border ${template.accent}`}><Icon size={20} /></div>
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h3 className="text-sm font-black text-slate-900">{field.label}</h3>
                                      {field.required && <span className="rounded-full bg-rose-50 px-2 py-1 text-[10px] font-black text-rose-600">اجباری</span>}
                                    </div>
                                    <p className="mt-1 text-xs font-bold text-slate-400">فیلد شماره {index + 1}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <button type="button" onClick={(event) => { event.stopPropagation(); moveField(field.id, "up"); }} className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"><FiArrowUp size={16} /></button>
                                  <button type="button" onClick={(event) => { event.stopPropagation(); moveField(field.id, "down"); }} className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"><FiArrowDown size={16} /></button>
                                  <button type="button" onClick={(event) => { event.stopPropagation(); duplicateField(field); }} className="flex size-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"><FiCopy size={16} /></button>
                                  <button type="button" onClick={(event) => { event.stopPropagation(); removeField(field.id); }} className="flex size-9 items-center justify-center rounded-xl text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"><FiTrash2 size={16} /></button>
                                </div>
                              </div>
                              <div>
                                <label className="mb-2 block text-xs font-black text-slate-500">{field.label} {field.required && <span className="text-rose-500">*</span>}</label>
                                <RenderFormField field={field} value={formValues[field.id]} onChange={(value) => updateFieldValue(field.id, value)} error={previewErrors.includes(field.id)} />
                                {field.helper && <p className="mt-2 text-xs font-bold text-slate-400">{field.helper}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h2 className="text-lg font-black text-slate-950">خروجی قالب فرم</h2>
                  <p className="mt-1 text-sm font-bold text-slate-500">این ساختار بعداً می‌تواند برای API و دیتابیس ارسال شود</p>
                </div>
                <pre dir="ltr" className="max-h-[720px] overflow-auto rounded-2xl border border-slate-200 bg-slate-950 p-5 text-left text-xs leading-6 text-slate-100">{schemaPreview}</pre>
              </div>
            )}
          </main>

          <aside className="space-y-5" dir="rtl">
            <div className="sticky top-5 space-y-5">
              <div className="rounded-[26px] border border-[#2f7f86]/40 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">افزودن فیلد</h2>
                    <p className="mt-1 text-xs font-bold text-slate-500">فیلدهای موردنیاز فرم را انتخاب کنید</p>
                  </div>
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[#eaf5f5] text-[#2f7f86]"><FiPlus size={24} /></div>
                </div>
                <div className="rounded-2xl bg-[#2f7f86] px-4 py-4 text-sm font-black text-white">فیلدهای پایه</div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {fieldTemplates.map((template) => {
                    const Icon = template.icon;
                    return (
                      <button key={template.type} type="button" onClick={() => addField(template)} className="flex min-h-16 items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 text-right transition hover:border-[#2f7f86] hover:bg-[#f5fbfb]">
                        <span className="text-xs font-black text-slate-700">{template.title}</span>
                        <span className={`flex size-9 items-center justify-center rounded-xl border ${template.accent}`}><Icon size={19} /></span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-50 text-[#2f7f86]"><FiSettings size={22} /></div>
                  <div>
                    <h2 className="text-base font-black text-slate-950">تنظیمات فیلد</h2>
                    <p className="mt-1 text-xs font-bold text-slate-500">فیلد انتخاب‌شده را ویرایش کنید</p>
                  </div>
                </div>

                {selectedField ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-black text-slate-500">عنوان فیلد</label>
                      <input value={selectedField.label} onChange={(event) => updateSelectedField({ label: event.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-black text-slate-700 outline-none transition focus:border-[#2f7f86] focus:bg-white" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-black text-slate-500">متن راهنما داخل فیلد</label>
                      <input value={selectedField.placeholder} onChange={(event) => updateSelectedField({ placeholder: event.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#2f7f86] focus:bg-white" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-black text-slate-500">توضیح زیر فیلد</label>
                      <input value={selectedField.helper} onChange={(event) => updateSelectedField({ helper: event.target.value })} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#2f7f86] focus:bg-white" />
                    </div>
                    {["select", "radio", "checkbox"].includes(selectedField.type) && (
                      <div>
                        <label className="mb-2 block text-xs font-black text-slate-500">گزینه‌ها؛ هر خط یک گزینه</label>
                        <textarea value={(selectedField.options ?? []).map((option) => option.label).join("\n")} onChange={(event) => changeOptionsText(event.target.value)} className="min-h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none transition focus:border-[#2f7f86] focus:bg-white" />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => updateSelectedField({ required: !selectedField.required })} className={`h-11 rounded-xl border text-xs font-black transition ${selectedField.required ? "border-[#2f7f86] bg-[#eaf5f5] text-[#2f7f86]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}`}>اجباری</button>
                      <button type="button" onClick={() => updateSelectedField({ width: selectedField.width === "full" ? "half" : "full" })} className="h-11 rounded-xl border border-slate-200 bg-white text-xs font-black text-slate-500 transition hover:bg-slate-50">{selectedField.width === "full" ? "تمام عرض" : "نیم عرض"}</button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm font-bold text-slate-500">برای ویرایش، یک فیلد را انتخاب کنید</div>
                )}
              </div>
            </div>
          </aside>
        </section>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[30px] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-slate-950">پیش‌نمایش فرم</h2>
                <p className="mt-1 text-sm font-bold text-slate-500">{formTitle}</p>
              </div>
              <button type="button" onClick={() => setPreviewOpen(false)} className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-500 transition hover:bg-slate-50"><FiX size={20} /></button>
            </div>
            <form onSubmit={submitPreview} className="max-h-[calc(92vh-95px)] overflow-auto p-6">
              <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                <h3 className="text-lg font-black text-slate-900">{formTitle}</h3>
                <p className="mt-2 text-sm font-bold text-slate-500">{formDescription}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {fields.map((field) => (
                  <div key={field.id} className={field.width === "full" ? "lg:col-span-2" : ""}>
                    <label className="mb-2 block text-xs font-black text-slate-500">{field.label} {field.required && <span className="text-rose-500">*</span>}</label>
                    <RenderFormField field={field} value={formValues[field.id]} onChange={(value) => updateFieldValue(field.id, value)} error={previewErrors.includes(field.id)} />
                    {field.helper && <p className="mt-2 text-xs font-bold text-slate-400">{field.helper}</p>}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="button" onClick={() => setPreviewOpen(false)} className="h-12 rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700 transition hover:bg-slate-50">بستن</button>
                <button type="submit" className="h-12 rounded-2xl bg-[#2f7f86] px-7 text-sm font-black text-white transition hover:bg-[#256d73]">ثبت اطلاعات نمونه</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}