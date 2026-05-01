import { create } from "zustand"

type AppState = {
  isUploading: boolean
  isAnalyzing: boolean
  setIsUploading: (val: boolean) => void
  setIsAnalyzing: (val: boolean) => void
}

export const useResumeStore = create<AppState>((set) => ({
  isUploading: false,
  isAnalyzing: false,
  setIsUploading: (val) => set({ isUploading: val }),
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),
}))
