import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full font-body text-on-background flex flex-col">
      {children}
    </div>
  );
}
