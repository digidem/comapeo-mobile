### Table of Contents

[Projects and Project Settings](#projects-and-project-settings)

- [Overview](#overview)
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

## Creating a project from the side drawer menu

- This tests a user creating a project for the first time.

### Test Objectives

- Ensures flow is present to Create a project through series of clicks
- Ensures user cannot create a project without entering a name first
- Checks for presence of Import Config Button
- Checks that user is now a coordinator and can click on invite devices

### Special Considerations

- User can be taken to invite devices screen but no other devices will be present on an emulator

## Creating a project from the sync button

- This test tests an alternate way to create a project for the first time

### Test Objectives

- Ensures flow is present to Create a project through series of clicks
- Ensures user cannot create a project without entering a name first

### Special Considerations

- This test is run as part of an alternative flow to show that clearing out the app storage allows a user to create a new project

## Unjoining a project

- This test primarily checks for the wording about needing to uninstall the app in order to create or join a new project.

### Test Objectives

- Checks for correct wording
- Clear the app and run a new flow (see above) to create a new project

### Special Considerations

- This test relies on test(s) to create a device name and join a project

## Editing a Device Name

- This tests a user changing their device name.

### Test Objectives

- Ensures that a user can see their device name in project settings
- Ensures that a user can edit their device name
- Checks that if a user starts editing and decides to leave the page, a warning is shown
- Checks that a user can leave the page without saving and the device name doesn't change

### Special Considerations

- This test does not test the save button as it is not working. An issue has been created.
