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

#### Camera related

Camera does not work on emulator, see "Platform Compatibility" at the top. https://docs.expo.dev/versions/v50.0.0/sdk/camera/. Should work if we upgrade to Expo 51 at some point.

- Screen shows view from the device rear camera
- Create observation button goes to Categories screen from home Camera screen

##### Adding Photos

- Capture button on camera from adding observation makes shutter sound, takes photo, adds photo thumbnails (in the orientation taken) to **New observation** screen
- After 3+ photos are added, thumbnail bar scrolls right and scroll bar appears and functions
- [On click] thumbnail photo goes to **View image** screen and photo appears in the orientation taken
- [On click] **X Close** returns to **New observation** screen

##### Deleting Photos

- When photo is opened in View image screen, X (Close) and Delete Image buttons appear on the top of the screen
- Anywhere on the screen (except button areas) hides X (Close) and Delete Image buttons
- Anywhere on the screen shows X (Close) and Delete Image buttons again
- [On click] X Delete Image shows bottom bottom sheet with deletion confirmation prompt in selected app language
- [On click] Cancel closes bottom sheet and photo is still visible in View image screen
- [On click] confirmation (Delete Image) returns to New observation screen
- Deleted image is not present on New observation screen
- After saving observation and re-opening, deleted image is not present on View observation screen

#### Other

- If category names are long, text wraps using hyphenation at expected points (none are long enough to wrap)
- Circular color border is visible for each icon in default config (this kind of visibility is not possible within testing)
- When adding details, there is no mock data with more than one question, so we cannot automatically test the functionality of going to the next question or hitting the back arrow to return to the previous question
- When adding details, there is no mock data with a multi select so there is no way to automatically test that functionality
- When selecting a detail with select one radial, visual confirmation is required to check that clicking on a radial adds a dot to it
