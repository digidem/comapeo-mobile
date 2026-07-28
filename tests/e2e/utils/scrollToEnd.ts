export async function scrollToEnd(maxSwipes = 3) {
  await $(
    `android=new UiScrollable(new UiSelector().scrollable(true)).scrollToEnd(${maxSwipes})`,
  );
}
