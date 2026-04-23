import { PaletteIcon, CheckIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  const activeTheme = THEMES.find((t) => t.name === theme);

  return (
    <div className="dropdown dropdown-end">

      
      <button
        tabIndex={0}
        className="btn btn-ghost btn-sm btn-circle hover:bg-base-300 transition-all duration-200 group"
        title="Change theme"
      >
        <PaletteIcon className="w-4 h-4 text-base-content/60 group-hover:text-primary transition-colors duration-200" />
      </button>

      
      <div
        tabIndex={0}
        className="dropdown-content mt-3 shadow-2xl rounded-2xl border border-base-300/60 bg-base-100 backdrop-blur-xl overflow-hidden"
        style={{ width: "220px" }}
      >
        
        <div className="px-4 pt-4 pb-3 border-b border-base-200">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/30">
            Appearance
          </p>
          <p className="text-sm font-bold text-base-content mt-0.5">
            {activeTheme?.label ?? theme}
          </p>
          
          <div className="flex gap-1 mt-2">
            {activeTheme?.colors.map((color, i) => (
              <span
                key={i}
                className="h-1 flex-1 rounded-full"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        
        <div className="p-2 max-h-72 overflow-y-auto space-y-0.5 scrollbar-thin">
          {THEMES.map((themeOption) => {
            const isActive = theme === themeOption.name;
            return (
              <button
                key={themeOption.name}
                onClick={() => setTheme(themeOption.name)}
                className={`
                  w-full px-3 py-2.5 rounded-xl flex items-center gap-3 transition-all duration-150 group
                  ${isActive
                    ? "bg-primary/10 ring-1 ring-primary/20"
                    : "hover:bg-base-200"
                  }
                `}
              >
                
                <div className="flex gap-0.5 flex-shrink-0">
                  {themeOption.colors.slice(0, 3).map((color, i) => (
                    <span
                      key={i}
                      className="w-3 h-5 first:rounded-l-md last:rounded-r-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                
                <span className={`
                  text-sm font-semibold flex-1 text-left
                  ${isActive ? "text-primary" : "text-base-content/70 group-hover:text-base-content"}
                `}>
                  {themeOption.label}
                </span>

                
                {isActive && (
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <CheckIcon className="w-2.5 h-2.5 text-primary-content" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;