import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useLocation } from "react-router";

const Layout = ({ children, showSidebar = false }) => {
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const showSide = showSidebar && !isChatPage;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {showSide && <Sidebar />}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;