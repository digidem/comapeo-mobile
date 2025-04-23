### Table of Contents

[Projects and Project Settings](#projects-and-project-settings)

- [Projects and Project Settings](#projects-and-project-settings)
  - [Overview](#overview)
- [Solo Project Headers](#solo-project-headers)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Inviting Collaborators While Solo](#inviting-collaborators-while-solo)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Creating a project from the side drawer menu](#creating-a-project-from-the-side-drawer-menu)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)
- [Unjoining a project](#unjoining-a-project)
  - [Test Objectives](#test-objectives-3)
  - [Special Considerations](#special-considerations-3)
- [Editing a Device Name](#editing-a-device-name)
  - [Test Objectives](#test-objectives-4)
- [Project Settings - Solo Project](#project-settings---solo-project)
  - [Test Objectives](#test-objectives-5)
  - [Special Considerations](#special-considerations-4)
- [Project Settings - Named Project (Coordinator)](#project-settings---named-project-coordinator)
  - [Test Objectives](#test-objectives-6)
  - [Special Considerations](#special-considerations-5)

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

## Inviting Collaborators While Solo

This test validates that a user on the default “solo” project can open the side drawer, select “Invite” to reach the **Invite Collaborators** screen, and optionally proceed to name the project.

### Test Objectives

- Confirms that **My Solo Project** is shown in the side drawer when no named project exists.
- Ensures an **Invite** button is visible to solo users.
- Verifies the **Invite Collaborators** screen appears with the correct heading and bullet points when Invite is pressed.
- Checks that tapping **Name My Project** navigates to the **Name (Create) Project** flow.

### Special Considerations

- This test must run before any other test that names the project.
- This test doesn’t fully create a project; it only confirms navigation into `CreateProject` (Name a project) -- see below.

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

## Project Settings - Solo Project

This test verifies that a solo user can access and view the **Project Settings** screen which will have two "cards."

### Test Objectives

- Opens the **side drawer** and navigates to **Project Settings** via the **View** button.
- Confirms the **Project Settings** screen header is visible.
- Verifies the first card displays a description of it as a solo project and a button to invite collaborators.
- Verifies the second card displays information about importing categories.

### Special Considerations

- This test requires the app to be in an **unnamed project state** (solo).
- Must run before any test that names the project.
- This test does not enter sub-settings like Config or Invite screens — only validates the card content.

## Project Settings - Named Project (Coordinator)

This test verifies that a user who has named a project (becoming a coordinator) can access and view the updated **Project Settings** screen. The layout now includes three cards reflecting project name, collaborators, and categories.

### Test Objectives

- Opens the **side drawer** and navigates to **Project Settings** via the **View** button.
- Confirms the **Project Settings** screen header is visible.
- Verifies the first card displays the project name and an **Edit Info** button.
- Verifies the second card shows project collaborator and a **View Team** button.
- Verifies the third card displays the information about the categories.

### Special Considerations

- This test assumes a project has already been named in a previous test.
- It does **not** test editing the project name or navigating into the team or config sub-screens.
- Cannot currently verify participant view in BrowserStack (can't invite a second device).
