import React from "react";
import { MessageCircle } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {

  const {theme}=useThemeStore()
  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center bg-base-300 gap-6"
      data-theme={theme}
    >
      
      <div className="relative flex items-center justify-center">

        
        <span className="absolute inline-flex h-24 w-24 rounded-full bg-primary/20 animate-ping" />

        
        <span className="absolute inline-flex h-16 w-16 rounded-full bg-primary/30 animate-ping [animation-delay:300ms]" />

        
        <div className="relative z-10 bg-primary rounded-2xl p-4 shadow-xl shadow-primary/30">
          <MessageCircle className="w-8 h-8 text-primary-content" />
        </div>
      </div>

      
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-2xl font-black tracking-tight text-base-content">
          Talk<span className="text-primary">ora</span>
        </h1>

        
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
        </div>
      </div>

      
      <p className="text-xs text-base-content/40 tracking-widest uppercase">
        Loading, please wait
      </p>
    </div>
  );
};

export default PageLoader;