# What can't be done with end to end testing for CoMapeo

## Overview

This document outlines the tests that will need to be run by hand for QA and cannot be automated through our Maestro end to end testing suite.

## Categories

### Map

1. **Scale Bar**:

- Scale bar appears and shows proper measurements based on the zoom of the map

2. **Navigation Centering Button**:

- Navigation centering button [to turn on] shows blue dot in crosshairs and centers position.
- While device is moving, blue dot on map remains centered and map tracks movement
- Navigation centering button [to turn off] shows empty crosshairs

3. **Connectivity**:

- If no custom offline map has been added on device and there IS internet connectivity, default map shows all relevant data at all zoom levels
- If no custom offline map has been added on device and there is NO internet connectivity, default offline map with minimal detail appears

### Observations

**Camera related**
Camera does not work on emulator, see "Platform Compatibility" at the top. https://docs.expo.dev/versions/v50.0.0/sdk/camera/. Should work if we upgrade to Expo 51 at some point.

- Screen shows view from the device rear camera
- Create observation button goes to Categories screen from home Camera screen

**Other**

- If category names are long, text wraps using hyphenation at expected points (none are long enough to wrap)
- Circular color border is visible for each icon in default config (this kind of visibility is not possible within testing)
-
