# Build And Publishing Flow

### Background

This repo follows the develop/deploy git flow, where there are 2 main branches, `develop` and `deploy` which are used for keeping the production ready code and latest code seperate, but integrated. The `deploy` branch always reflects a production ready state, and is the code found in the apps being used by the general public. Any changes made to the `deploy` branch should be pushed out to the publicly released app. The `develop` branch reflects the codebase with the latest delivered devlopment changes which are slated for the upcoming release. Any new features that have not been released but are ready to be QA'd can be found in this branch. More about this flow can be found [here](https://nvie.com/posts/a-successful-git-branching-model/).

We use [EAS](https://expo.dev/pricing) to build our app. There are different types of builds for several use cases

- Release Candidate: A Release Candidate is an APK that is used for internal testing and QA purposes. It reflects the next public release, and should be extensively tested.
- Production: A Production build is an .aab that is used by the google play store to distribute the CoMapeo. A production build should have been extensively tested and reflects the latest changes found in the `deploy` branch.
- Pre: A pre build is an APK that is used for internal testing. It differs from a release candidate as it is typically not going to be used for a public release. This is most often used when there a features that want to be tested before they are ready to be QA's for an actual release

This repo used github action to dispatch the creation of these builds. See [How To](#how-to) for instruction on building.

### Versioning

CoMapeo uses [semantic versioning](https://semver.org/).

The `develop` branch will always be one `minor` version ahead of the released version and have the suffix "-pre". (eg, if the latest released version is 1.3.2, the `devlop` branch version will be 1.4.0-pre).

### How To

## Release Candidate

A Release Candidate can be built directly in the action tab on the the github repo. Click on the action "Create Release Branch and Build RC". This will automatically create a Pull Request from the latest devlop, with its base pointing to Deploy. As well, it will dispatch a build with EAS that will build a `Release Candidate` apk. The version of this build will be the version of devlop, with `pre` being replaced with `RC.0` plus the SHA number of the latest commit. (Eg. If the develop version is `1.4.0-pre`, this Release Candidate will be `1.4.0-Rc+{SHA#OfLatestCommit}').

## Production

A production AAB will automatically be built when a Branch created by the [ReleaseCandidate](#release-candidate) flow is merged into deploy. This will also increase the `minor` version of the develop branch

## Pre
