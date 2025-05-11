import { create } from 'zustand';

type CommentsBottomSheetState = {
  isOpen: boolean;
  reporteId: number | null;
  open: (reporteId: number) => void;
  close: () => void;
};

export const useCommentsBottomSheetStore = create<CommentsBottomSheetState>((set) => ({
  isOpen: false,
  reporteId: null,
  open: (reporteId) => set({ isOpen: true, reporteId }),
  close: () => set({ isOpen: false }),
})); 