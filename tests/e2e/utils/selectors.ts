// Cross-platform selector helpers. React Native maps `testID` to an Android
// `resource-id` but to an iOS `accessibilityIdentifier`; text is queried via
// UiSelector on Android and an NSPredicate on iOS. Each helper branches on the
// running platform so the same spec runs on both. Accessibility-label
// selectors (`$('~Label')`) already work on both platforms and are used
// directly in the specs.
const isIOS = () => driver.isIOS;

const escapeForPredicate = (value: string) => value.replace(/'/g, "\\'");

export const byResourceId = (id: string) =>
  isIOS() ? `~${id}` : `android=new UiSelector().resourceId("${id}")`;

// iOS combines icon+text into one accessibility label, often with leading/
// trailing ", " artifacts (e.g. ", Learn More", "Next, "), so exact-match
// predicates miss. Match on CONTAINS, which still uniquely identifies these
// onboarding/button strings.
export const byText = (text: string) =>
  isIOS()
    ? `-ios predicate string:label CONTAINS '${escapeForPredicate(
        text,
      )}' OR name CONTAINS '${escapeForPredicate(text)}'`
    : `android=new UiSelector().text("${text}")`;

export const byTextMatches = (text: string) =>
  isIOS()
    ? `-ios predicate string:label CONTAINS[c] '${escapeForPredicate(
        text,
      )}' OR name CONTAINS[c] '${escapeForPredicate(text)}'`
    : `android=new UiSelector().textMatches("(?i).*${text}.*")`;

export const byTextContains = (text: string) =>
  isIOS()
    ? `-ios predicate string:label CONTAINS '${escapeForPredicate(
        text,
      )}' OR name CONTAINS '${escapeForPredicate(text)}'`
    : `android=new UiSelector().textContains("${text}")`;
