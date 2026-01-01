import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
