- [Audio](#audio)
  - [Overview](#overview)
- [Recording Audio](#recording-audio)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Playback and Delete](#playback-and-delete)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Adding Multiple Audio Clips](#adding-multiple-audio-clips)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)
- [Todo (these are broken right now)](#todo-these-are-broken-right-now)

## Audio

### Overview

These tests cover the audio recording functionality in CoMapeo. Users can record audio clips (up to 5 minutes) as part of an observation, play them back, delete them, or add additional recordings in edit mode. These tests assume that microphone permissions are already granted.

## Recording Audio

Verifies the ability to begin and stop audio recording, and the correct display of the success modal after a recording.

### Test Objectives

- Verify the microphone button appears in the observation editor
- Tap the mic button and confirm the "Record up to 5 minutes" prompt is visible
- Start recording and verify:
  - Timer starts
  - Message updates to "Less than 5 minutes left"
- Stop recording manually after a few seconds
- Confirm that:
  - Total recording time is displayed
  - Success modal appears
  - "Return to Editor" and "Record Another" buttons are shown
  - Audio thumbnail is visible upon returning to editor

### Special Considerations

- Actual recorded audio content cannot be verified in automation
- Cannot validate auto-stop at 5 minutes due to test time constraints

## Playback and Delete

Covers entering the playback screen, verifying audio controls, and deleting the recording from the playback screen.

### Test Objectives

- Tap the audio thumbnail and verify playback screen opens
- Confirm total length and delete button are visible
- Tap delete, verify confirmation modal
- Cancel the delete action, then confirm delete
- Confirm user is returned to the observation and audio is removed
- Save the updated observation

### Special Considerations

- Cannot validate audio playback sound
- Handles optional GPS warning dialog during save

## Adding Multiple Audio Clips

Tests the ability to add more than one recording to the same observation via the “Record Another” option.

### Test Objectives

- Start a new observation and record an audio clip
- After stopping, choose "Record Another"
- Start and stop a second recording
- Return to the editor and verify that at least two audio thumbnails are visible

### Special Considerations

- Assumes previous recording workflow already functions
- Validates UI behavior only (not content of recordings)

## Todo (these are broken right now)

- Check for playback of audio from a saved observation
- Check for adding an audio file when editing an observation
