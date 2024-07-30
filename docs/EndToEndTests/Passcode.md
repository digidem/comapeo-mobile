## Passcode/ Security

### Overview

Security e2e tests test the user's interactions with the security button within the settings menu. The tests deal with all of the different aspects of the passcode as they currently stand.

## Set Passcode

- This tests the ability to find information about the app passcode and the ability to set it.

### Test Objectives

- Tests that all cancel and back buttons take the user out of the passcode settings screens.
- Tests that the full feature description of the app passcode is shown
- Tests that number keyboard is displayed and that letters can't be entered
- Tests that errors show appropriately when no passcode is entered, or if it is too short, or if it is 00000
- Tests that there is a re-enter passcode screen with a number keyboard where letters can't be entered
- Tests that matching passcodes must be entered
- Tests that a warning message is shown that displays the passcode
- Tests that when the passcode is saved, "passcode is set" is shown on the opening screen

### Special Considerations

- Obscure passcode feature is hidden for now. When it is done, we should add tests for it.
- The back buttons work to go back, but they do not go back to the settings screen specifically as mentioned in the scripts.

## Check Passcode Requirements

- This tests that the passcode is required when entering the app.

### Test Objectives

- Tests that when CoMapeo is closed, passcode is required when it is reopened
- Tests that when CoMapeo is left running in the background, another app is opened, and then CoMapeo reopened, passcode is required
- Tests that when phone is turned off and back on, when reopening CoMapeo, passcode is required
- Tests that number keyboard is displayed and that letters can't be entered
- Tests that an error is displayed if the wrong passcode is entered

### Special Considerations

- Not sure if the tests exactly replicate closing and reopening app, but they are close!

## Post Passcode Setup

- This tests interactions in the app that take place after a passcode has been set up.

### Test Objectives

- Tests that passcode is required to enter the app passcode screen and that is a number keyboard and letters can't be input
- Tests the back and cancel buttons take the user out of the passcode settings screens
- Tests that appropriate warnings are displayed
- Tests that incorrect passcodes display an error
- Tests that correct passcode opens the app passcode screen
- Tests that the use app passcode checkbox is checked
- Tests that the app passcode can be changed
- Tests that the use app passcode checkbox can be unchecked to turn off the passcode
