import { MessageSquareTextIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

function ChatLoader() {
  const { theme } = useThemeStore();

  return (
    <div data-theme={theme} className="h-screen flex flex-col items-center justify-center bg-base-100 gap-6">

      
      <div className="relative flex items-center justify-center">
        
        <span className="absolute w-20 h-20 rounded-2xl bg-primary/10 animate-ping" />
       
        <span className="absolute w-16 h-16 rounded-2xl bg-primary/15" />
        
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <MessageSquareTextIcon className="w-7 h-7 text-primary-content" />
        </div>
      </div>

      
      <div className="flex flex-col items-center gap-2">
        <p className="text-base font-black tracking-wide text-base-content">
          Connecting to chat
        </p>
        
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 rounded-full bg-base-300 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 70%; margin-left: 15%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}

export default ChatLoader;