### Table of Contents

- [Settings](#settings)
  - [Overview](#overview)
- [Language](#language)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Coordinates](#coordinates)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [About Screen](#about-screen)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)

## Settings

### Overview

Settings e2e tests test the user's interactions with many things within the side drawer/ settings menu.

## Language

- Language button enables user to change the language in the app

### Test Objectives

- Clicking on App Settings shows option to change language
- Clicking on a particular language changes the language in the app
- Clicking back to English (or another language) changes it again

### Special Considerations

- A lot of the translations haven't been done yet. Ideally this test will be added to when the translations are done to check the language changes throughout the app. In each script there is a call to check the language, but for testing purposes it will be much more efficient to just check the language changes in one test.

## Coordinates

- Coordinate button enables user to see and change the coordinate formats

### Test Objectives

- Clicking on App Settings shows option to change coordinate system
- There are three coordinate systems visible
- Back buttons work to return to settings screen

### Special Considerations

- It is not possible within Maestro to test the functioning of the Radio buttons, although theoretically I should have been able to.

## About Screen

- This tests the ability to see information about CoMapeo and the phone

### Test Objectives

- Clicking on About CoMapeo goes to about screen
- Tests for the presence of the details text
- Back button takes user to map screen

### Special Considerations

- This does not test what appears in the subheadings of the details because that will change frequently and is specific to the phone
- Technically, the back button is supposed to go back to the settings drawer open screen but that is not prioritized right now.
