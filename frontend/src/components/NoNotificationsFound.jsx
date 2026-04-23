import { BellIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

function NoNotificationsFound() {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme} className="flex flex-col items-center justify-center py-20 text-center">

      
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-primary/5 scale-150 animate-pulse" />
        <div className="absolute inset-0 rounded-full bg-primary/8 scale-125" />
        <div className="relative w-20 h-20 rounded-2xl bg-base-200 border border-base-300 flex items-center justify-center shadow-inner">
          <BellIcon className="w-9 h-9 text-base-content opacity-20" />
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 border-2 border-base-100 flex items-center justify-center">
            <span className="text-[9px] font-black text-base-content/30">0</span>
          </span>
        </div>
      </div>

      
      <div className="space-y-2 max-w-xs">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/25">
          Inbox
        </p>
        <h3 className="text-xl font-black text-base-content tracking-tight">
          All caught up!
        </h3>
        <p className="text-sm text-base-content/45 leading-relaxed">
          When you receive friend requests , they'll appear here.
        </p>
      </div>

      
      <div className="flex items-center gap-1.5 mt-8">
        <span className="w-1 h-1 rounded-full bg-base-content/10" />
        <span className="w-6 h-1 rounded-full bg-primary/20" />
        <span className="w-1 h-1 rounded-full bg-base-content/10" />
      </div>

    </div>
  );
}

export default NoNotificationsFound;