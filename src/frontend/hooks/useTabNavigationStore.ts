import {create} from 'zustand';
import {TabName} from '../Navigation/types';

type NavigationStoreState = {
  currentTab: TabName;
  initialRouteName: TabName;
  prevTab?: TabName;
  setCurrentTab: (tab: TabName) => void;
};

export const useTabNavigationStore = create<NavigationStoreState>(
  (set, get) => ({
    initialRouteName: 'Map',
    currentTab: 'Map',
    setCurrentTab: (tab: TabName) =>
      set(() => ({
        prevTab: get().currentTab,
        currentTab: tab,
      })),
  }),
);
