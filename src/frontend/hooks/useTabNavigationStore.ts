import {create} from 'zustand';
import {TabName} from '../Navigation/types';

type NavigationStoreState = {
  currentTab: TabName;
  initialRouteName: TabName.Map;
  setCurrentTab: (tab: TabName) => void;
};

export const useTabNavigationStore = create<NavigationStoreState>(set => ({
  initialRouteName: TabName.Map,
  currentTab: TabName.Map,
  setCurrentTab: (tab: TabName) => set(() => ({currentTab: tab})),
}));