### Table of Contents

- [Side Drawer Menu](#side-drawer-menu)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [GPS](#gps)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Map](#map)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)

### Overview

These tests deal with all issues related to the main screens of the app.

## Side Drawer Menu

- This tests the look and functioning of the side drawer menu with and without a project.

### Test Objectives

- Tests that all of the hamburger menu can be opened and closed from the map screen
- Ensures that the list items that should be present are present
- Checks that if the user is not on a project the header suggests creating or joining a project
- Once on a project, checks that the project name is visible in the header of the drawer

### Special Considerations

- These tests need to run before and after the project naming tests.

## GPS

This tests the GPS pill that is on the main map screen and the main camera screen.

### Test Objectives

- On home **Map** screen, tests that GPS details button shows current device status
- On home **Camera** screen, tests that GPS details button shows current device status
- Tests that **GPS details** button from home **Map** screen navigates to **GPS details** screen
- Tests that **GPS details** button from **Home** camera screen navigates to **GPS details** screen
- **GPS details** screen shows detailed navigation data of device
- Tests that the **Back** button returns to last home screen (**Map** or **Camera**)

### Special Considerations

- This test sets the location to Ecuador before the test

## Map

This tests that some of the buttons appear on the map and that an observation can be created from the map.

### Test Objectives

- The sync button, drawer icon, and plus button appear where they should
- The **Create observation** button goes to categories screen from **Home** map screen

### Special Considerations

- A lot of the functionality for the map has to be tested by QA, and is listed in 'docs/EndToEndTests/E2ENoGos.md'
