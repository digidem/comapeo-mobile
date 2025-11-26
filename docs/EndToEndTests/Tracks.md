- [Onboarding](#onboarding)
  - [Overview](#overview)
- [Starting a Track](#starting-a-track)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Saving a Track](#saving-a-track)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Viewing and Editing a Track](#viewing-and-editing-a-track)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)
- [Track with No Movement](#track-with-no-movement)
  - [Test Objectives](#test-objectives-3)
  - [Special Considerations](#special-considerations-3)

## Onboarding

### Overview

These tests cover the GPS Tracks feature in CoMapeo, including starting, discarding, saving, viewing, and editing tracks. These tests assume that all permissions (foreground and background location) are pre-granted.

## Starting a Track

Verifies the flow for starting a GPS track and expected UI changes when tracking begins.

### Test Objectives

- Verify that the bottom sheet modal appears when the **Tracks** tab is tapped
- Verify the **Start Tracks** button is visible
- After tapping **Start Tracks**, confirms that the recording UI updates:
  - **Stop Tracks** button appears
  - Message: "You’ve been recording for [HH:MM:SS]" is displayed

### Special Considerations

- Assumes location permissions are granted
- We cannot simulate actual movement or GPS tracking in Browserstack, so line drawing, distance, or duration updates on the map are **not** validated.
- Cannot validate background tracking persistence

## Saving a Track

Covers stopping a track, handling the discard modal, entering a description, and saving the track.

### Test Objectives

- Checks that tapping the **Tracks** button again while recording, after observations have been created displays the **Stop Tracks** button
- Confirm the discard modal appears when the X in the top left is pressed
- When **Continue Editing** is chosen from the modal, confirms that user can continue editing.
- Confirms a description can be entered.
- Confirms that tapping the **Save** check mark saves the track and returns to the Map View.

### Special Considerations

- Cannot validate behavior when no observation or movement occurred
- Relies on previously saved observations for valid track context

## Viewing and Editing a Track

Ensures saved tracks appear in the Observations list, show correct data, and support editing the description.

### Test Objectives

- Confirms that the Track list items is visible in the Observations tab.
- Conforms that the track detail view is visible after clicking on the track list item.
  - Observation count is shown ("3")
  - Collapsible list of observations exists and expands
  - Observation labels (e.g., "Clay", "Gathering Site", "Lake") are visible
- Checks that tapping the pencil icon enters the **Edit Track** screen
- Checks that the description can be modified and saved
- Confirms that updated description is visible on the track detail view
- Confirms that the track is visible from one of the Observations created during it

### Special Considerations

- Assumes three observations were created during the track
- Does not validate map visuals or line data
- Does not test deletion flow

## Track with No Movement

This test validates the warning and recovery flow when a user attempts to stop tracking without moving beyond the minimum distance threshold.

### Test Objectives

- Verify track can be started from Tracks tab
- Confirm stopping track immediately (without movement) triggers warning modal
- Verify "No Track Recorded" warning message is displayed
- Confirm explanatory text appears: "You didn't move beyond one meter."
- Verify "Continue Recording" button allows user to resume tracking
- Confirm user can exit tracks normally after continuing recording

### Special Considerations

- In BrowserStack, we cannot simulate actual GPS movement, so the test validates the UI flow for insufficient movement
- Note: The current test listed under "Viewing and Editing a Track" is currently disabled in the test suite because since we require at least 1 meter of movement, it no longer works
