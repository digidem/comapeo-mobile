import {expect} from '@wdio/globals';
import {describe, it} from 'mocha';
import {byResourceId, byText, byTextMatches} from '../../utils/selectors';

describe('Onboarding - Project Onboarding flow (join / create / map solo)', () => {
  it('can open Join Project then go back', async () => {
    await expect($(byText('Secure & Private Collaborations'))).toBeDisplayed();

    const joinBtn = await $(byText('Join an Existing Project'));
    await expect(joinBtn).toBeDisplayed();
    await joinBtn.click();
    const goBack = await $(byText('Go Back'));
    await expect(goBack).toBeDisplayed();
    await goBack.click();

    await expect($(byText('Secure & Private Collaborations'))).toBeDisplayed();
  });

  it('can open Start New Project then go back (without creating)', async () => {
    const startNewBtn = await $(byText('Start a New Project'));
    await expect(startNewBtn).toBeDisplayed();
    await startNewBtn.click();

    await expect($(byTextMatches('Start New Project'))).toBeDisplayed();
    const startBtn = await $(byText('Start'));
    await expect(startBtn).toBeDisplayed();
    await startBtn.click();

    await expect($(byText('Project Name'))).toBeDisplayed();
    await $(byResourceId('MAIN.header-back-btn')).click();

    await expect($(byTextMatches('Start New Project'))).toBeDisplayed();

    const goBack = await $(byText('Go Back'));
    await expect(goBack).toBeDisplayed();
    await goBack.click();

    await expect($(byText('Secure & Private Collaborations'))).toBeDisplayed();
  });

  it('can map solo (Go to Map → Start Mapping → land on Map)', async () => {
    const goToMapBtn = await $(byText('Go to Map'));
    await expect(goToMapBtn).toBeDisplayed();
    await goToMapBtn.click();

    await expect($(byText('Map on Your Own'))).toBeDisplayed();

    const startMappingBtn = await $(byText('Start Mapping'));
    await expect(startMappingBtn).toBeDisplayed();
    await startMappingBtn.click();

    const mapView = await $(byResourceId('MAIN.mapbox-map-view'));
    await expect(mapView).toBeDisplayed();
  });
});
