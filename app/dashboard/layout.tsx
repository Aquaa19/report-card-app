import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full font-body text-slate-900 dark:text-text-primary flex flex-col transition-colors duration-500">
      {children}
    </div>
  );
}
