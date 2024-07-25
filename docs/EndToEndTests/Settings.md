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

- A lot have the translations haven't been done yet. Ideally this test will be added to when they are done to check the language change throughout the app. In each script there is a call to check the language, but for testing purposes it will be much more efficient to just check the language changes in one test

## Coordinates

- Coordinate button enables user to change the see and change the coordinate formats

### Test Objectives

- Clicking on App Settings shows option to change coordinate system
- There are three coordinate systems visible
- Back buttons work

### Special Considerations

- It is not possible within Maestro to test the functioning of the Radio buttons, although theoretically I should have been able to. Settings is spelled setttings in the screen...
