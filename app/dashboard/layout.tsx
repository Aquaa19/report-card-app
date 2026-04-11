import TopNav from "@/components/TopNav";
import SideNav from "@/components/SideNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen font-body text-on-background">
      <TopNav />
      <SideNav />
      <div className="min-h-screen lg:pl-64 pt-32">{children}</div>
    </div>
  );
}
