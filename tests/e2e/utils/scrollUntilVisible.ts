export async function scrollUntilVisible(
  selector: string,
  {
    maxSwipes = 10,
    direction = 'down',
  }: {maxSwipes?: number; direction?: 'down' | 'up'} = {},
) {
  if (await $(selector).isDisplayed()) return;

  const {width, height} = await driver.getWindowRect();
  const startX = Math.round(width / 2);
  const startY = Math.round(direction === 'down' ? height * 0.8 : height * 0.2);
  const endY = Math.round(direction === 'down' ? height * 0.2 : height * 0.8);

  for (let i = 0; i < maxSwipes; i++) {
    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: {pointerType: 'touch'},
        actions: [
          {
            type: 'pointerMove',
            origin: 'viewport',
            x: startX,
            y: startY,
            duration: 0,
          },
          {type: 'pointerDown', button: 0},
          {
            type: 'pointerMove',
            origin: 'viewport',
            x: startX,
            y: endY,
            duration: 300,
          },
          {type: 'pointerUp', button: 0},
        ],
      },
    ]);
    await driver.releaseActions();
    await driver.pause(200);

    if (await $(selector).isDisplayed()) return;
  }

  throw new Error(
    `Element ${selector} not visible after ${maxSwipes} swipes ${direction}`,
  );
}
