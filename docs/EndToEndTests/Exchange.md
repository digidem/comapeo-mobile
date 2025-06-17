### Table of Contents

- [Exchange – Solo Project](#exchange--solo-project)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Exchange – No Devices Available](#exchange--no-devices-available)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Exchange – Exchange Settings: Everything](#exchange--exchange-settings-everything)
  - [Test Objectives](#test-objectives-2)
- [Exchange – Exchange Settings: Previews Only](#exchange--exchange-settings-previews-only)
  - [Test Objectives](#test-objectives-3)
  - [Special Considerations](#special-considerations-2)

### Overview

These tests deal with some UI related to the exchange screen and exchange setting.

## Exchange – Solo Project

This test verifies the experience of a solo user viewing the Exchange screen before joining or creating a project.

### Test Objectives

- Opens the Exchange screen from the side drawer.
- Confirms header reads **Exchange**.
- Verifies text:

  - "Securely share observations"
  - "Get started in two simple ways"
  - "Invite collaborators"
  - "Join an existing project"

- Confirms the “Go Back” button is visible.

### Special Considerations

- Assumes the user is in the **solo project** state (no project joined or named).
- Should run before any tests that create or join a project.

## Exchange – No Devices Available

This test verifies the display of the Exchange screen when the device is not connected to any peer and has wifi.

### Test Objectives

- Opens the Exchange screen.
- Confirms the **Exchange** screen header.
- Verifies:

  - Wi-Fi icon appears.
  - "No devices found." message is shown
  - “Close” button is present

### Special Considerations

- Ensure the emulator or test device is offline or cannot detect other Comapeo devices in its project.
- We cannot test having other devices available and thus the other screen view since we can only test one device on its own.

## Exchange – Exchange Settings: Everything

This test verifies the settings and selected state when the user chooses **Exchange Everything**.

### Test Objectives

- Confirms content:
  - "Exchange everything"
  - "Full size photos and audio"
  - "Uses more storage"
- Taps "Change Settings"
- Verifies:
  - Exchange Everything option is visible and selected
- Closes the settings modal
- Confirms main screen still shows **Exchange Everything** content

## Exchange – Exchange Settings: Previews Only

This test changes the sync preference to **Previews Only** and verifies persistence.

### Test Objectives

- Opens the Exchange settings modal via "Change Settings"
- Verifies:
  - "Exchange Previews Only" is shown
  - Related descriptions are visible:
    - "Reduced smaller size photos."
    - "No audio included."
- Selects "Previews Only"
- Confirms the selection is applied.
- Saves and closes the modal
- Confirms the main Exchange screen updates to reflect the new setting:
  - "Exchange previews only"
  - The same two description lines as in the modal.

### Special Considerations

May be able to add a test in the future to verify the no wifi screen.
