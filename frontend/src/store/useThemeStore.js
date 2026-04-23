import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme:localStorage.getItem("talkora-theme") || "coffee",
    setTheme:(theme)=>{
      localStorage.setItem("talkora-theme",theme)
      set({theme})
    }
}))