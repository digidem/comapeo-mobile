### Table of Contents

- [Passcode/ Security](#passcode-security)
  - [Overview](#overview)
- [Set Passcode](#set-passcode)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Check Passcode Requirements](#check-passcode-requirements)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Post Passcode Setup](#post-passcode-setup)
  - [Test Objectives](#test-objectives-2)

## Passcode/ Security

### Overview

Passcode/ security e2e tests test the user's interactions with the security button within the settings menu. The tests deal with all of the different aspects of the passcode as they currently stand. I had to name the file and folders passcode instead of security because of VScode locks on files labeled 'security'.

## Set Passcode

- This tests the ability to find information about the app passcode and the ability to set it.

### Test Objectives

- All cancel and back buttons take the user out of the passcode settings screens
- The full feature description of the app passcode is shown
- Number keyboard is displayed and letters can't be entered
- Errors show appropriately when no passcode is entered, or if it is too short, or if it is 00000
- There is a re-enter passcode screen with a number keyboard where letters can't be entered
- Matching passcodes must be entered
- A warning message is shown that displays the passcode before setting it
- When the passcode is saved, "passcode is set" is shown on the opening screen

### Special Considerations

- Obscure passcode feature is hidden for now. When it is done, we should add tests for it.
- The back buttons work to go back, but they do not go back to the settings screen specifically as mentioned in the scripts.

## Check Passcode Requirements

- This tests that the passcode is required when entering the app.

### Test Objectives

- When CoMapeo is closed, passcode is required when it is reopened
- When CoMapeo is left running in the background, another app is opened, and then CoMapeo reopened, passcode is required
- When phone is turned off and back on, when reopening CoMapeo, passcode is required
- Number keyboard is displayed and letters can't be entered
- An error is displayed if the wrong passcode is entered

### Special Considerations

- Not sure if the tests exactly replicate closing and reopening app, but they are close!

## Post Passcode Setup

- This tests interactions in the app that take place after a passcode has been set up

### Test Objectives

- Passcode is required to enter the app passcode screen and it is a number keyboard and letters can't be input
- Back and cancel buttons take the user out of the passcode settings screens
- Appropriate warnings are displayed
- Incorrect passcodes display an error
- Correct passcode opens the app passcode screen
- Use app passcode checkbox is checked
- App passcode can be changed
- Use app passcode checkbox can be unchecked to turn off the passcode
