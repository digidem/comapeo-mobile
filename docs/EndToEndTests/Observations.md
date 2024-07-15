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

### Special Considerations

- All QA relating to the camera (that buttons appear where they should, adding photos, viewing photos, and deleting photos) will have to be done by a real person until we update Expo and Expo camera. See E2ENoGos.

## Adding Details

- This tests a little bit of the functionality and view related to adding details to observations

### Test Objectives

- Checks that the details screen has the back arrow, question number out of number, and done or next, the detail name, the and the placeholder.
- Checks that the text field input is open by default
- Checks that text can be input into that text field
- Checks that if it is question 1 or 1, that done appears

### Special Considerations

- There is no mock data with two questions, so functionality for advancing forward or backward through questions is not there.
- There is no mock data with a multi select, so functionality for doing that is not testable
- There is a bug in that hitting the back arrow does not return to "New Observation" as it should
- Adding details doesn't work right now and causes the new observation to be lost
