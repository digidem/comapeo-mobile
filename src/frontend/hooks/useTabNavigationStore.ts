import {create} from 'zustand';
import {TabName} from '../sharedTypes/navigation';

type NavigationStoreState = {
  currentTab: TabName;
  initialRouteName: 'Map';
  setCurrentTab: (tab: TabName) => void;
};

export const useTabNavigationStore = create<NavigationStoreState>(set => ({
  initialRouteName: 'Map',
  currentTab: 'Map',
  setCurrentTab: (tab: TabName) => set(() => ({currentTab: tab})),
}));
