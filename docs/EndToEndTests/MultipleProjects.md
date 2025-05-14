### Table of Contents

[Multiple Projects](#multiple-projects)

- [Multiple Projects](#multiple-projects)
  - [Overview](#overview)
- [Create and Switch Between Projects](#create-and-switch-between-projects)
  - [Test Objectives](#test-objectives)
  - [Special Considerations](#special-considerations)
- [Project Data Retention](#project-data-retention)
  - [Test Objectives](#test-objectives-1)
  - [Special Considerations](#special-considerations-1)
- [All Projects Screen](#all-projects-screen)
  - [Test Objectives](#test-objectives-2)
  - [Special Considerations](#special-considerations-2)

## Multiple Projects

### Overview

These tests validate functionality and UX related to managing and switching between multiple projects in CoMapeo.

## Create and Switch Between Projects

This test validates the core flow of creating a second project and switching between the new and original (solo) project.

#### Test Objectives

- Ensure that a new project can be created via the All Projects screen.
- Verify that upon creation, the new project becomes the active one.
- Confirm that the user can switch back to the original solo project.
- Ensure the map header updates appropriately after each switch.

#### Special Considerations

- Assumes the original project ("My Solo Project") exists before this test begins.
- Depends on predictable project names from `output.names`.

## Project Data Retention

This test ensures that each project stores its own set of observations and data does not leak between projects.

#### Test Objectives

- Create an observation in the second project.
- Create a third project and confirm that the observation does not appear there.
- Switch back to the second project and confirm the observation is still visible.

#### Special Considerations

- We can't check what happens if a user is invited to a project.

## All Projects Screen

This test validates the All Projects UI, including role labels and sort order.

#### Test Objectives

- Verify that all created projects are listed and visible.
- Confirm that the correct role ("coordinator") is shown for each.
- Ensure that “mapping on your own” and “participant” roles are not displayed if not expected.
- Validate that the projects appear in the expected order:
  1. Original project
  2. Second project
  3. Third project

#### Special Considerations

- Can't check for participant at this time because we cannot do the invitation flow.
