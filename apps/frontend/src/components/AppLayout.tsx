import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";

export default function AppLayout() {
  return (
    <div className="flex h-screen w-full bg-base-100 text-base-content overflow-hidden">
      <SideBar />
      <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 lg:p-8 bg-base-200/50">
        <Outlet />
      </main>
    </div>
  );
}
