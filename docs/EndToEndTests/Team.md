### Table of Contents

- [Team](#team)
  - [Overview](#overview)
- [Team Screen as Coordinator](#team-screen-as-coordinator)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Collaborator Info as Coordinator](#collaborator-info-as-coordinator)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)

## Team

### Overview

These tests validate the Team page functionality and user interface for coordinators in CoMapeo.

## Team Screen as Coordinator

This test validates the Team screen UI when accessed as a coordinator with only one device (the coordinator's own device).

### Test Objectives

- Verify Team screen displays all three sections: Coordinators, Participants, and Past Collaborators
- Confirm Invite Device button is visible for coordinators
- Verify own device appears in coordinators list with "This Device" indicator
- Confirm all section descriptions are present

### Special Considerations

- On BrowserStack, we cannot add team members, so this test only validates the UI with one coordinator
- All section descriptions must be present even when sections are empty (except for coordinators, which has one entry)

## Collaborator Info as Coordinator

This test validates the Collaborator Info screen when a coordinator clicks on their own device from the Team screen.

### Test Objectives

- Verify Collaborator Info screen displays device details correctly
- Confirm "This Device" appears as header for own device
- Verify coordinator role is shown
- Confirm no action buttons appear (Leave Project, Remove Device)

### Special Considerations

- Cannot test participant view or other team members on BrowserStack due to invitation limitations
