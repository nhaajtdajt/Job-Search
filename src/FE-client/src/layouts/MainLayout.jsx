import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="min-h-dvh flex flex-col bg-white text-slate-900">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
