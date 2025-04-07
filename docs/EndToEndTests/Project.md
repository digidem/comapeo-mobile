### Table of Contents

[Projects and Project Settings](#projects-and-project-settings)

- [Overview](#overview)
- [No/ Solo Project Headers](#solo-project-headers)
  - [Test Objectives](#test-objectives-4)
  - [Special Considerations](#special-considerations-4)
- [Creating a project from the side drawer menu](#creating-a-project-from-the-side-drawer-menu)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Creating a project from the sync button](#creating-a-project-from-the-sync-button)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Unjoining a project](#unjoining-a-project)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)
- [Editing a Device Name](#editing-a-device-name)
  - [Test Objectives](#test-objectives-3)
  - [Special Considerations](#special-considerations-3)

## Projects and Project Settings

### Overview

These tests deal with projects, such as creating a project from the side drawer, creating a project from sync, and that the messaging about projects is correct.

## Solo Project Headers

This test checks the visibility and text of the headers and associated UI elements for a user who has not yet created a project (i.e., “My Solo Project”) and is on the default project.

#### Test Objectives

- Verifies that the **Map screen** header displays “My Solo Project” when no project is named.
- Verifies that the **ObservationsList** header also displays “My Solo Project,” along with a device icon (drawer button).
- Ensures that the “You’re mapping on your own.” card text is visible in the ObservationsList.

#### Special Considerations

- These tests require the app to be in a state where the default project is **unnamed** (solo).
- If the user has previously named the project, the tests will fail because the header text changes.

## Creating a project from the side drawer menu

- This tests a user creating a project for the first time.

### Test Objectives

- Ensures flow is present to Create a project through series of clicks
- Ensures user cannot create a project without entering a name first
- Checks for presence of Import Config Button
- Checks that user sees the 'success' screen and invite device and go to map buttons are present
- Checks that user can go to the map

### Special Considerations

- User can be taken to invite devices screen but no other devices will be present on an emulator
- If the user goes to the invite devices screen and tries to back out it doesn't work
- When the project is created, the name does not actually appear in the side drawer menu title

## Creating a project from the sync button

- This tests creating a project from the sync screen

### Test Objectives

- Ensures flow is present to Create a project through series of clicks
- Ensures user cannot create a project without entering a name first

### Special Considerations

- This test is run as part of an alternative flow to show that clearing out the app storage allows a user to create a new project

## Unjoining a project

- This tests the presence of a warning message indicating that the user will need to uninstall the app in order to create or join a new project, if they are already part of a project.

### Test Objectives

- Checks for correct wording
- Clears the state of the app, by removing all app-related data from the device (shared preferences, databases, accounts, etc.), uninstalls the app, and runs a new flow (see above) to create a new project

### Special Considerations

- This test relies on test(s) to create a device name and join a project

## Editing a Device Name

- This tests a user changing their device name.

### Test Objectives

- Ensures that a user can see their device name in project settings
- Ensures that a user can edit their device name
- Checks that if a user starts editing and decides to leave the page, a warning is shown
- Checks that a user can leave the page without saving and the device name doesn't change
- Checks that once a user saves the new device name, it appears on the screen
- Exits device name editing page and reenters it to make sure edited device name is persisted
