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
- [Future Coverage Considerations](#future-coverage-considerations)

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

## Future Coverage Considerations

- Add tests for discard flow (tap X → Discard Track → confirm return to Map)
- Add test for deleting a track from the detail screen and verifying it is removed from the list
