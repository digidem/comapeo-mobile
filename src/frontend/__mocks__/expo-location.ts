export enum Accuracy {
  Lowest = 1,
  Low = 2,
  Balanced = 3,
  High = 4,
  Highest = 5,
  BestForNavigation = 6,
}

export const getForegroundPermissionsAsync = () =>
  Promise.resolve({
    status: 'granted' as const,
    expires: 'never' as const,
    granted: true,
    canAskAgain: true,
  });

export const getProviderStatusAsync = () =>
  Promise.resolve({
    locationServicesEnabled: true,
    backgroundModeEnabled: true,
  });

export const getLastKnownPositionAsync = () => Promise.resolve(null);

export const watchPositionAsync = () => Promise.resolve({remove: () => {}});
