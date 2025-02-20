### Table of Contents

- [Onboarding](#onboarding)
  - [Overview](#overview)
- [Creating a Device Name](#creating-a-device-name)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)

## Onboarding

### Overview

Onboarding e2e tests test the user's inital interaction with the app.

## Data & Privacy

- Users are informed about how their data is handled before they can proceed.

### Test Objectives

- Ensure that the Data & Privacy screen is displayed after tapping "Get Started".
- Verify that the "Learn More" and "Next" buttons are present on the screen.
- Confirm that tapping "Learn More" navigates to the Privacy Policy screen.
- Validate that tapping "Next" navigates the user to the Device Naming screen.

## Privacy Policy

- Users can review details about CoMapeo's privacy policies.

### Test Objectives

- Ensure that the Privacy Policy content is displayed when the user taps "Learn More".
- Verify that users can toggle the "About Awana Digital" section.
- Verify that users can toggle the "Open Source and the 'Official' Version" section.
- Ensure that tapping the back button returns the user to the Data & Privacy screen.

## Creating a Device Name

- Users are required to name their device.

### Test Objectives

- Ensure that tapping "Next" from the Data & Privacy screen navigates to the Device Naming screen.
- User can enter a device name
- User can't leave the device name blank and move on
- Checks that a success message appears on the screen and that the entered device name is displayed after it is added.
- Ensures the 'Go to Map' button is visible on the success screen.
- It makes sure the 'Go to Map' navigates to the map screen.

### Special Considerations

- This sceen only shows up on the initial installation of the app and when users are not a on project.
- Because of that the storage of the app needs to be cleared in order for the screen to be shown.
- Also, if it is a new installation of the app, subsequent tests cannot be run automatically unless this first test is run and the device is named.
