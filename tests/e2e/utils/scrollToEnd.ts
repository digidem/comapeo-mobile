export async function scrollToEnd(maxSwipes = 3) {
  const scrollable = await $('android=new UiSelector().scrollable(true)');

  for (let swipe = 0; swipe < maxSwipes; swipe++) {
    const canScrollMore = await driver.execute('mobile: scrollGesture', {
      elementId: scrollable.elementId,
      direction: 'down',
      percent: 1,
    });

    if (!canScrollMore) return;
  }
}
