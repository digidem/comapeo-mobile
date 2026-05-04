import * as React from 'react';
import * as ExpoLinking from 'expo-linking';

// When a deep link arrives while the app is not ready (passcode locked or
// mid-onboarding), React Navigation cannot route to the target screen because
// it is not registered yet. This context captures the URL
// so the app navigator can get it once the navigation is ready.

type PendingDeepLinkContextType = {
  pendingUrl: string | null;
  clearPendingUrl: () => void;
  setNotReadyForInvite: (notReadyForInvite: boolean) => void;
};

const PendingDeepLinkContext =
  React.createContext<PendingDeepLinkContextType | null>(null);

export const usePendingDeepLink = () => {
  const value = React.useContext(PendingDeepLinkContext);
  if (!value) throw new Error('Must be used inside PendingDeepLinkProvider');
  return value;
};

export const PendingDeepLinkProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const url = ExpoLinking.useURL();
  const [pendingUrl, setPendingUrl] = React.useState<string | null>(null);
  // Track not ready for invite state via ref so the URL effect always sees the latest value
  // without needing to re-subscribe.
  const isNotReadyForInviteRef = React.useRef(true);

  const setNotReadyForInvite = React.useCallback(
    (notReadyForInvite: boolean) => {
      isNotReadyForInviteRef.current = notReadyForInvite;
    },
    [],
  );

  React.useEffect(() => {
    if (!url) return;
    if (isNotReadyForInviteRef.current) {
      // Store the URL for when the app is ready to handle the invite
      setPendingUrl(url);
    }
    // When not not ready for invite, React Navigation's linking prop handles the URL directly
  }, [url]);

  const clearPendingUrl = React.useCallback(() => {
    setPendingUrl(null);
  }, []);

  const contextValue = React.useMemo(
    () => ({pendingUrl, clearPendingUrl, setNotReadyForInvite}),
    [pendingUrl, clearPendingUrl, setNotReadyForInvite],
  );

  return (
    <PendingDeepLinkContext value={contextValue}>
      {children}
    </PendingDeepLinkContext>
  );
};
