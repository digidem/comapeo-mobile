### Table of Contents

- [Onboarding](#onboarding)
  - [Overview](#overview)
- [Data \& Privacy](#data--privacy)
  - [Test Objectives](#test-objectives)
- [Privacy Policy](#privacy-policy)
  - [Test Objectives](#test-objectives-1)
- [Creating a Device Name](#creating-a-device-name)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations)
- [Projects Intro](#projects-intro)
  - [Test Objectives](#test-objectives-3)
  - [Special Considerations](#special-considerations-1)
- [Project Onboarding Flow (Join / Create / Map Solo)](#project-onboarding-flow-join--create--map-solo)
  - [Test Objectives](#test-objectives-4)
  - [Special Considerations](#special-considerations-2)

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
- Ensures the 'Join a Project' button is visible on the success screen.
- It makes sure the 'Join a Project' navigates to the project intro screen.

### Special Considerations

- This sceen only shows up on the initial installation of the app and when users are not a on project.
- Because of that the storage of the app needs to be cleared in order for the screen to be shown.
- Also, if it is a new installation of the app, subsequent tests cannot be run automatically unless this first test is run and the device is named.

## Projects Intro

- Users land here after device naming when no projects exist.

### Test Objectives

- Verify the screen shows the main heading (“Secure & Private Collaborations”) and key info text.
- Ensure the actions are visible: “Join an Existing Project”, “Start a New Project”, and “Go to Map”.

### Special Considerations

- This screen appears only when the device is named **and** there are zero projects.

## Project Onboarding Flow (Join / Create / Map Solo)

- Users can explore each path without committing to creating a project.

### Test Objectives

- User can see what it means to join a project and then go back.
- User can follow the steps to create a new project and then go all the way back.
- User can Go to the Map and a default solo project will be created

### Special Considerations

- Assumes device is already named and there are zero projects.
- Uses the default solo project instead of creating a named project so the rest of the flow can be tested.
