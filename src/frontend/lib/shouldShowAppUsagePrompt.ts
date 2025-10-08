type ShouldShowAppUsagePromptProps = {
  completedOnboardingAt: number | null;
  lastPromptAt: number | null;
  promptCount: number;
};

export function shouldShowAppUsagePrompt({
  completedOnboardingAt,
  lastPromptAt,
  promptCount,
}: ShouldShowAppUsagePromptProps) {
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const threeMonths = 90 * 24 * 60 * 60 * 1000;

  const shouldShowInitialPrompt =
    !!completedOnboardingAt &&
    now - completedOnboardingAt >= oneWeek &&
    promptCount === 0;

  const shouldRePrompt =
    completedOnboardingAt !== null &&
    promptCount > 0 && // Only re-prompt if we've prompted before
    promptCount < 3 &&
    lastPromptAt !== null && // Only re-prompt if we have a last prompt time
    now - lastPromptAt >= threeMonths;

  return shouldShowInitialPrompt || shouldRePrompt;
}
