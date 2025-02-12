export const byResourceId = (id: string) =>
  `android=new UiSelector().resourceId("${id}")`;
export const byText = (text: string) =>
  `android=new UiSelector().text("${text}")`;
export const byTextMatches = (text: string) =>
  `android=new UiSelector().textMatches("${text}")`;
export const byTextContains = (text: string) =>
  `android=new UiSelector().textContains("${text}")`;
