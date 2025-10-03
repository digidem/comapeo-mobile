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
    promptCount < 3 &&
    now - (lastPromptAt || 0) >= threeMonths;

  return shouldShowInitialPrompt || shouldRePrompt;
}
