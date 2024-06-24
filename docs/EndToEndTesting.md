# End-to-End Testing with Maestro

## Overview

This document outlines the setup and usage of end-to-end (E2E) testing for our project using Maestro. Maestro is a mobile UI testing framework that provides a simple and effective way to automate testing of CoMapeo. This guide will cover how to run tests, our architectural decisions regarding the use of Maestro, and provide links to relevant documentation.

## Prerequisites

Before running Maestro tests, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Maestro CLI](https://maestro.mobile.dev/getting-started/installation)
- Android Emulator

## Setup

1. **Maestro Installation**: Follow the instructions on the [Maestro installation guide](https://maestro.mobile.dev/getting-started/installation) to install the Maestro CLI.

## Running a Test

To run a Maestro test, follow these steps:

1. **Start Emulator**: Ensure your Android Emulator is running.

2. **Execute the Test**: Run the test using the Maestro CLI.

   ```sh
   maestro test path/to/your/test.yaml
   ```

   For example, if you have a single test file to run named `gps-pill.yaml` in the `e2e/main` directory, the command would be:

   ```sh
   maestro test e2e/main/gps-pill.yaml
   ```

   Another option is to run all of our tests sequentially, as they are all called from the flow file and the config.yaml file tells Maestro what to run within our folder.

   ```sh
   maestro test e2e
   ```

## Architectural Decisions

### Why Maestro?

We chose Maestro for our end-to-end testing for several reasons:

- **Simplicity**: Maestro provides a straightforward way to write and execute tests using YAML, making it accessible to all team members. Configuration is super simple and requires almost no modification of our app.
- **CLI**: No code CLI where one can easily visually select elements to add to testing flows. To open, run `maestro studio`.

### Test Structure

Our test files are stored in the `e2e` directory at the root of the project. Each test scenario is written in a separate YAML file to maintain modularity and readability.

File folders are set up to group tests pertaining to various features.

Tests are called sequentially from the `main/flow.yaml` file.

### Test IDs

The best way for tests to find certain elements is to add Test IDs. There are many Test IDs already in CoMapeo that were ported over from Mapeo. However, we are ammending these to follow the best naming practices for Test IDs as outlined in the [following document](https://wix.github.io/Detox/docs/guide/test-id#test-id-naming---best-practices) as we build tests that use them. The folder in which the test resides provides the prefix, which is in all caps (eg. MAIN) and then the specific element gets kebab case. We are using suffixes like btn, icon, scrn etc to identify type of element as well.

### Variables

We are using various ENVIRONMENT variables and other scripts to simplify code and eliminate repetitiveness.

### CI/CD Integration

When this is figured out, instructions will go here ;0)

## Additional Resources

- [Maestro Documentation](https://maestro.mobile.dev/docs/)
- [Maestro GitHub Repository](https://github.com/mobile-dev-inc/maestro)
