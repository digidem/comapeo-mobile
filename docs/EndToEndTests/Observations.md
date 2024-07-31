- [Creating Observations](#creating-observations)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Adding Details](#adding-details)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [Viewing Observations](#viewing-observations)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)

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

- All QA relating to the camera (that buttons appear where they should, adding photos, viewing photos, and deleting photos) will have to be done by a real person until we update Expo and Expo camera. See E2ENoGos.

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

- First the test changes locations slightly and adds observations with different preset categories
- Takes a screenshot of the map so someone can check the dots if they want
- Checks that clicking on a point on the map goes to that observation
- Checks that all of the back buttons work
- Checks that the observations list button goes to the observations list screen from map and the camera screen
- Checks that observation names, time captures, thumbnails and icons display as expected on the list screen and the show observation screen

### Special Considerations

- There is no way to automatically test the appearance of the dots, but it can be checked on a screenshot
