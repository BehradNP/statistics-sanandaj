import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-slate-50" dir="ltr">
      {/* Sidebar ثابت سمت راست */}
      <div className="fixed right-0 top-0 z-40 h-screen shrink-0" dir="rtl">
        <Sidebar />
      </div>

      {/* Main Content با فاصله از سایدبار */}
      <main
        className="
          min-h-screen
          bg-slate-50
          pr-[300px]
          transition-all
        "
        dir="rtl"
      >
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