import { Link } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, LogOutIcon, MessageSquareTextIcon } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogout from "../hooks/useLogout";
import { useThemeStore } from "../store/useThemeStore";

const Navbar = () => {
  const { authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const { logoutMutation } = useLogout();

  return (
    <nav
      data-theme={theme}
      className="sticky top-0 z-30 h-16 flex items-center px-4 bg-base-200/90 backdrop-blur-md border-b border-base-300 shadow-sm"
    >
      {/* Logo - pinned left */}
      <Link to="/" className="flex items-center gap-3 group mr-auto">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-md shadow-primary/30 group-hover:scale-105 group-hover:shadow-primary/50 transition-all duration-300">
          <MessageSquareTextIcon className="w-5 h-5 text-primary-content" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Talkora
          </span>
          <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-base-content/30">
            connect · chat
          </span>
        </div>
      </Link>

      {/* Right-side actions */}
      <div className="flex items-center gap-1">
        <Link to="/notifications">
          <button className="btn btn-ghost btn-sm btn-circle hover:bg-base-300 transition-colors duration-200">
            <BellIcon className="w-5 h-5 text-base-content/60" />
          </button>
        </Link>

        <ThemeSelector />

        <div className="w-px h-6 bg-base-300/70 mx-1" />

        <div className="avatar">
          <div className="w-8 h-8 rounded-xl ring-2 ring-primary/20 ring-offset-1 ring-offset-base-200 hover:ring-primary/40 transition-all duration-200 overflow-hidden cursor-pointer">
            <img src={authUser?.profilePic} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
        </div>

        <button
          className="btn btn-ghost btn-sm btn-circle hover:bg-error/10 hover:text-error transition-all duration-200 group"
          onClick={logoutMutation}
        >
          <LogOutIcon className="w-4 h-4 text-base-content/50 group-hover:text-error transition-colors duration-200" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;