### Table of Contents

[Remote Archive](#remote-archive)

- [Remote Archive](#remote-archive)
  - [Overview](#overview)
- [Add Remote Archive - Error Flow](#add-remote-archive---error-flow)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Add Remote Archive - Success Flow](#add-remote-archive---success-flow)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Remove Remote Archive](#remove-remote-archive)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)

## Remote Archive

### Overview

These tests check the enabling and disabling of the Remote Archive feature within Project Settings.

## Add Remote Archive - Error Flow

This test simulates a user attempting to add an invalid server URL and ensures that an appropriate error screen appears.

#### Test Objectives

- Validate that the **Remote Archive is OFF** state is correctly displayed when no archive is connected.
- Confirm that an invalid URL (e.g., `example.com`) leads to an error state.
- Verify in project settings is still says “Remote Archive is Off” without any archive saved.

#### Special Considerations

- This test should run **before** the success flow to ensure Remote Archive is off.
- The test uses `example.com` as a predictable error URL.

## Add Remote Archive - Success Flow

This test verifies the full workflow of successfully adding a valid remote archive server.

#### Test Objectives

- Ensure that entering a valid server URL triggers the archive detection flow and loads archive details.
- Confirm that the preview screen displays the correct server name and URL.
- Validate that the **“See What is Included”** bottom sheet lists expected data types (Observations, Tracks, Device Names, Project Settings).
- Confirm that tapping **"Add Remote Archive"** completes successfully and shows a success screen.
- Verify that the archive appears with the correct name, URL, and the **current date** under "Date Added."
- Confirm that the Project Settings screen updates to show **“Remote Archive | ON”**.

#### Special Considerations

- Uses `comapeo-cloud.fly.dev` as the valid remote server URL.
- Requires test to run after the error flow and before the removal flow.

## Remove Remote Archive

This test ensures that a user can remove an added remote archive and that the UI updates accordingly.

#### Test Objectives

- Navigate to the Remote Archive screen while it is ON.
- Tap **"Remove Server"** and confirm the warning modal appears.
- Confirm removal and verify the success state reverts to "Remote Archive is Off".
- Verify Project Settings updates the card state to **OFF**.

#### Special Considerations

- Assumes Remote Archive is currently ON due to a prior success test.
- This test must run after the success test to ensure state is correct.
