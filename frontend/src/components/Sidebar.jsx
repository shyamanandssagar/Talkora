import { Link, useLocation } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, UsersIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const navItems = [
  { to: "/", icon: HomeIcon, label: "Home" },
  { to: "/friends", icon: UsersIcon, label: "Friends" },
  { to: "/notifications", icon: BellIcon, label: "Notifications" },
];

const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { theme } = useThemeStore();

  return (
    <aside
      data-theme={theme}
      className="hidden lg:flex flex-col w-64 overflow-hidden relative border-r bg-base-100 border-base-300"
    >
      
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full blur-3xl pointer-events-none z-0 bg-primary/10" />
      <div className="absolute top-40 -right-10 w-36 h-36 rounded-full blur-2xl pointer-events-none z-0 bg-secondary/10" />
      <div className="absolute bottom-24 -left-8 w-44 h-24 rounded-full blur-3xl pointer-events-none z-0 bg-primary/5" />

      
      <nav className="relative z-10 flex-1 flex flex-col gap-0.5 px-3 py-5">


        {navItems.map(({ to, icon, label }) => {
          const Icon = icon;
          const isActive = currentPath === to;

          return (
            <Link
              key={to}
              to={to}
              className={`
                relative flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-semibold
                transition-all duration-200 group overflow-hidden
                ${isActive ? "text-primary-content" : "text-base-content/55 hover:text-base-content"}
              `}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary to-secondary opacity-90 shadow-md shadow-primary/40" />
              )}
              {!isActive && (
                <span className="absolute inset-0 rounded-2xl bg-base-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
              {!isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 rounded-r bg-primary group-hover:h-5 transition-all duration-300" />
              )}

              <span className={`
                relative z-10 flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 flex-shrink-0
                ${isActive
                  ? "bg-white/20 text-primary-content"
                  : "bg-base-200 text-base-content/40 group-hover:bg-base-300 group-hover:text-base-content/80"
                }
              `}>
                {Icon && <Icon className="w-4 h-4" />}
              </span>

              <span className="relative z-10 flex-1 tracking-wide">{label}</span>

              {isActive && (
                <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      
      <div className="mx-5 h-px relative z-10 bg-gradient-to-r from-transparent via-base-300 to-transparent" />

      
      <div className="relative z-10 p-3 pb-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-base-200/70 hover:bg-base-200 border border-base-300/50 hover:border-primary/20 hover:shadow-sm transition-all duration-300 cursor-default group">
          <div className="avatar flex-shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20 group-hover:ring-primary/40 ring-offset-1 ring-offset-base-100 transition-all duration-300">
              <img src={authUser?.profilePic} alt="User Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-base-content truncate leading-tight">
              {authUser?.fullName}
            </p>
            <p className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-[10.5px] font-semibold text-success tracking-wide">Online</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;