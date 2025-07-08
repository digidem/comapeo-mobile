import type {ChainablePromiseElement} from 'webdriverio';

export async function tapAboveElement(
  chainableElem: ChainablePromiseElement,
  offset = 50,
) {
  const el = await chainableElem;
  const elementId = await el.elementId;
  const rect = await driver.getElementRect(elementId);
  const xCoord = Math.round(rect.x + rect.width / 2);
  const yCoord = Math.round(rect.y - offset);

  await driver.performActions([
    {
      type: 'pointer',
      id: 'finger1',
      parameters: {pointerType: 'touch'},
      actions: [
        {
          type: 'pointerMove',
          origin: 'viewport',
          x: xCoord,
          y: yCoord,
          duration: 100,
        },
        {type: 'pointerDown', button: 0},
        {type: 'pointerUp', button: 0},
      ],
    },
  ]);
  await driver.releaseActions();
}
