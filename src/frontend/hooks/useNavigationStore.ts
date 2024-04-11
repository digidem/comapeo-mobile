import {create} from 'zustand';

type NavigationStoreState = {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
};

export const useNavigationStore = create<NavigationStoreState>(set => ({
  currentTab: 'Map',
  setCurrentTab: (tab: string) => set(() => ({currentTab: tab})),
}));
