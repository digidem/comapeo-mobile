import {expect, element, by} from 'detox';

describe('Onboarding - Privacy Policy Screen', () => {
  it('should display Privacy Policy content', async () => {
    await element(by.text('Learn More')).tap();
    await expect(element(by.text('CoMapeo Data Privacy'))).toBeVisible();
  });

  it('should toggle "About Awana Digital" section', async () => {
    await element(by.text('About Awana Digital')).tap();
    await expect(
      element(
        by.text(
          'CoMapeo is developed by Awana Digital, a 501c3 non-profit organization registered in the United States. Awana Digital works in solidarity with frontline communities to use technology to defend their rights and fight climate change.',
        ),
      ),
    ).toBeVisible();

    await element(by.text('About Awana Digital')).tap();
    await expect(
      element(
        by.text(
          'CoMapeo is developed by Awana Digital, a 501c3 non-profit organization registered in the United States. Awana Digital works in solidarity with frontline communities to use technology to defend their rights and fight climate change.',
        ),
      ),
    ).not.toBeVisible();
  });

  it('should toggle "Open Source" section', async () => {
    await element(by.text('Open Source and the "Official" Version')).tap();
    await expect(
      element(
        by.text(
          'CoMapeo is an open-source application. This means that anyone can view the code that makes the app work and can verify the privacy declarations in this document. It also means that anyone can adapt the app to their own needs and release an alternative version. This document refers to data collected by the official releases of CoMapeo, digitally signed by Awana Digital, available from the Google Play Store or the Awana Digital website. Unofficial releases of CoMapeo obtained from other channels are outside our control and may share additional information with other organizations.',
        ),
      ),
    ).toBeVisible();

    await element(by.text('Open Source and the "Official" Version')).tap();
    await expect(
      element(
        by.text(
          'CoMapeo is an open-source application. This means that anyone can view the code that makes the app work and can verify the privacy declarations in this document. It also means that anyone can adapt the app to their own needs and release an alternative version. This document refers to data collected by the official releases of CoMapeo, digitally signed by Awana Digital, available from the Google Play Store or the Awana Digital website. Unofficial releases of CoMapeo obtained from other channels are outside our control and may share additional information with other organizations.',
        ),
      ),
    ).not.toBeVisible();
  });

  it('should navigate back to Data & Privacy screen', async () => {
    await device.pressBack();
    await expect(
      element(by.text('Your data stays on your devices.')),
    ).toBeVisible();
  });
});
