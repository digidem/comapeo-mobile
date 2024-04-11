import {create} from 'zustand';
import {HomeTabsList} from '../Navigation/ScreenGroups/AppScreens';

type TabName = keyof HomeTabsList;

type NavigationStoreState = {
  currentTab: TabName;
  setCurrentTab: (tab: TabName) => void;
};

export const useNavigationStore = create<NavigationStoreState>(set => ({
  currentTab: 'Map' as TabName,
  setCurrentTab: (tab: TabName) => set(() => ({currentTab: tab})),
}));
