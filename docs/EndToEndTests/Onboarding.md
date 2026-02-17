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
- [Join Project Intro](#join-project-intro)
  - [Test Objectives](#test-objectives-3)
  - [Special Considerations](#special-considerations-1)
- [Map On Your Own Intro](#map-on-your-own-intro)
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
- Ensures the 'Go to Map' button is visible on the success screen.
- It makes sure the 'Go to Map' navigates to the map screen.

### Special Considerations

- This sceen only shows up on the initial installation of the app and when users are not a on project.
- Because of that the storage of the app needs to be cleared in order for the screen to be shown.
- Also, if it is a new installation of the app, subsequent tests cannot be run automatically unless this first test is run and the device is named.

## Join Project Intro

This test validates the Join Project intro screen that appears after device setup, providing information about joining a collaborative project.

### Test Objectives

- Verify navigation to Join Project Intro screen when tapping "Join a Project" button
- Confirm "Join a Project" title is displayed
- Verify intro description appears: "Coordinate with your team to receive a project invitation"
- Confirm "Close" button is present and functional
- Verify tapping "Close" returns user to the device success screen

### Special Considerations

- The test cannot validate actually joining another project as this is not possible in Browserstack.

## Map On Your Own Intro

This test validates the Map On Your Own intro screen that explains solo mapping features and creates a default project for the user.

### Test Objectives

- Verify navigation to Map On Your Own Intro screen when tapping "Map On Your Own" button
- Confirm "Map On Your Own" title is displayed
- Verify intro description appears
- Confirm all feature list items are displayed
- Confirm tapping "Go to Map" navigates to the map screen

### Special Considerations

- Tapping here is the quickest way to get the onboarding done and started
