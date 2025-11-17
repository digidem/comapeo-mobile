### Table of Contents

- [Menu](#menu)
  - [Overview](#overview)
- [Menu - Basic Functionality](#menu---basic-functionality)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Menu - Default Project UI](#menu---default-project-ui)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)

## Menu

### Overview

These tests validate the side drawer menu functionality and the different user interfaces in CoMapeo depending on whether the user is on a solo (default) project or a named/collaborative project.

## Menu - Basic Functionality

This test validates the core menu navigation functionality, including opening/closing the menu and navigating to key sections of the app.

### Test Objectives

- Verify menu opens when header button is pressed
- Confirm all main menu options are displayed: Gather Observations, Background Maps, and CoMapeo Settings
- Verify menu closes when back button is pressed
- Confirm navigation to Background Maps screen works correctly
- Verify navigation to App Settings (CoMapeo Settings) displays expected settings options
- Confirm "Gather Observations" navigates to the map screen and shows the add observation button
- Verify "Gather Observations" returns user to map screen even when on observations list

### Special Considerations

- When the menu is open, the add observation button is pushed off-screen and not visible
- The "Gather Observations" option should always navigate to the map screen, regardless of which screen the user is currently on

## Menu - Default Project UI

This test validates the menu differences when a user is on the default (solo) project versus a named collaborative project.

### Test Objectives

- Verify "Just You" header and "You're mapping on your own." message appear when on default project
- Confirm "Collaborate" button is displayed instead of "Exchange" button
- Verify "Team" and "Coordinator Tools" buttons are not displayed on default project

### Special Considerations
