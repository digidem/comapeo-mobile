### Table of Contents

- [Onboarding](#onboarding)
  - [Overview](#overview)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)

## Onboarding

### Overview

Onboarding e2e tests test the user's inital interaction with the app. Users are required to name their device.

### Test Objectives

- User can enter a device name
- User can't leave the device name blank and move on
- Checks that a success message appears on the screen and that the entered device name is displayed after it is added.
- Ensures the 'Go to Map' button is visible on the success screen.
- It makes sure the 'Go to Map' navigates to the map screen.

### Special Considerations

- This sceen only shows up on the initial installation of the app and when users are not a on project.
- Because of that the storage of the app needs to be cleared in order for the screen to be shown.
- Also, if it is a new installation of the app, subsequent tests cannot be run automatically unless this first test is run and the device is named.
