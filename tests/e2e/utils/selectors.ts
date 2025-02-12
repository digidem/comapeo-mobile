export const byResourceId = (id: string) =>
  `android=new UiSelector().resourceId("${id}")`;
export const byText = (text: string) =>
  `android=new UiSelector().text("${text}")`;
