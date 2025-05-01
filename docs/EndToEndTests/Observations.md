- [Creating Observations](#creating-observations)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Adding Details](#adding-details)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Viewing Observations](#viewing-observations)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)
- [Editing Observations](#editing-observations)
  - [Test Objectives](#test-objectives-3)
  - [Special Considerations](#special-considerations-3)
- [Deleting Observations](#deleting-observations)
  - [Test Objectives](#test-objectives-4)
  - [Special Considerations](#special-considerations-4)

### Overview

These tests deal with all issues related to the main screens of the app.

## Creating Observations

- This tests the looks and functioning of creating an observation including the categories screen, the edit observation screen, and cancelling the adding of an observation.

### Test Objectives

- Tests the categories screen, that icons are displayed, and that cancelling causes the user to choose between discarding the observation or continuing to edit
- If the user chooses to discard the observation, they are returned to the previous screen
- In a new observation, checks that all buttons, including: x close, check save, change, add photo, add details, add description, GPS bar with data, category icon, and category name are there
- Checks that the change button goes back to the categories screen and category can be changed
- Checks that a description can be added and when doing so, the add bar appears above the keyboard and collapses when click above the keyboard
- Saves the observation

### Special Considerations

- All QA relating to the camera (that buttons appear where they should, adding photos, viewing photos, and deleting photos) has not been added yet.

## Adding Details

- This tests a little bit of the functionality and view related to adding details to observations

### Test Objectives

- Checks that the details screen has the back arrow, question number out of number, and done or next, the detail name, the and the placeholder.
- Checks that the back arrow returns to the new observation screen
- Checks that the text field input is open by default
- Checks that text can be input into that text field
- Checks that if it is question 1 or 1, that done appears
- Checks that if hitting done, returns to the new observation screen
- Saves the observation

### Special Considerations

- There is no mock data with two questions, so functionality for advancing forward or backward through questions is not there.
- There is no mock data with a multi select, so functionality for doing that is not testable

## Viewing Observations

- This tests viewing observations on the map, from the home screen, on the list screen, and individually

### Test Objectives

- First the test adds observations with different preset categories
- Checks that all of the back buttons work
- Checks that the observations list button goes to the observations list screen from map and the camera screen
- Checks that observation names, time captures, thumbnails and icons display as expected on the list screen and the show observation screen
- Checks the “You’re a coordinator on this project.” or “You’re mapping on your own.” text is displayed at the top of the ObservationsList.

### Special Considerations

- The test does not check the locations of the dots at this time
- We are not able to change the location for the app during testing at this time

## Editing Observations

- This tests the experience of editing an existing observation after it has been created and saved

### Test Objectives

- Opens an observation from the list screen and verifies that it has the edit button
- Navigates to the Edit Observation screen and checks for presence of buttons and input fields (change, save, description, details)
- Updates the description field and collapses the keyboard by tapping above it
- Navigates to the details screen, enters a detail, and clicks done
- Saves the observation and confirms that the updated description and detail are displayed on the view screen

### Special Considerations

- Assumes that at least one editable observation (e.g., with the “Lake” preset) exists and is visible in the observations list before the test begins
- Does not test changing the category or adding a photo in this flow

## Deleting Observations

- This tests deleting an observation from the view observation screen

### Test Objectives

- Opens an editable observation (with the “Threat” preset), verifies presence of Share and Delete buttons
- Opens the delete confirmation dialog and tests the cancel flow (returns to view screen)
- Confirms the delete flow by pressing “Yes, delete” and verifies that the observation no longer appears in the list

### Special Considerations

- Assumes that an observation with the “Threat” preset exists and is editable by the current device
- Does not currently verify that the deleted document is removed from storage or synced state, only that it no longer appears in the list
