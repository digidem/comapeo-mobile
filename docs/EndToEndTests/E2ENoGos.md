# What can't be done with end to end testing for CoMapeo

## Overview

This document outlines the tests that will need to be run by hand for QA and cannot be automated through our Maestro end to end testing suite.

## Categories

### Map

1. **Navigation Centering Button**:

- [On click] Navigation centering button [to turn on] shows blue dot in crosshairs and centers position.
- While device is moving, blue dot on map remains centered and map tracks movement
- [On click] Navigation centering button [to turn off] shows empty crosshairs

2. **Connectivity**:

- If no custom offline map has been added on device and there IS internet connectivity, default map shows all relevant data at all zoom levels
- If no custom offline map has been added on device and there is NO internet connectivity, default offline map with minimal detail appears
