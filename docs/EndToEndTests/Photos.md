### Table of Contents

- [Photos](#photos)
  - [Overview](#overview)
- [Photo While Creating Observation](#photo-while-creating-observation)
  - [Test Objectives](#test-objectives)
- [Validated Photos](#validated-photos)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations)

## Photos

### Overview

These tests check that photos can be successfully added and deleted when creating an observation. Checks that the proper photo screen opens when the photo is a draft photo vs when the photo is an attached photo

## Photo While Creating Observation

This test simulates a user adding a photo, deleting the photo, and saving a photo to an observation

#### Test Objectives

- Validate that a photo is taken, and can be opened while taking an observation.
- Validate that the photo can be deleted.
- Verify that when a photo is being opened, it shows the photo preview modal (that does not have the "Validated By CoMapeo" acordian).

## Validated Photos

This test verifies that a saved photo opens the Attached Photo Preview Modal which has the "Validated By CoMapeo" acordian

#### Test Objectives

- Simulates the user viewing an observation and opening a photo in that observations
- Confirms that the Attached Photo Preview Modal opens which "Validated By CoMapeo" acordian
- Verifies that the "Validated By CoMapeo" can open and close, and indicated that it the photo was attached at the time of the observation

#### Special Considerations

- Relies on the `Photo While Creating Observation` test to create the observation with the photo in the first place

## Photo Added After Observation Saved

This test verifies that a photo can be added to an observation after the observation has already been saved. Confirms that the attached photo view and draft photo view is showed in the appropriate photos when add a new photo

#### Test Objectives

- Simulates the user editing an observation and adding a new photo
- Confirms that the new photo does not show the attached photo view until after the observation has been edited.

#### Special Considerations

- Relies on the `Validated Photos` test to be open on the correct observation that sets up these tests.
