import * as React from 'react';
import * as Linking from 'expo-linking';
import {parseInviteLink, type ReceivedInviteLink} from '../../lib/inviteLinks';
import {isInviteScreen, isEditingScreen} from '../../lib/screenNameChecks';

/**
 * Wrapped so that opening the same link twice is two separate object:
 * `useLinkingURL` holds a string, so the second tap changes nothing and is
 * silently dropped.
 */
type LinkArrival = {url: string};

function initialArrival(): LinkArrival | null {
  const url = Linking.getLinkingURL();
  return url ? {url} : null;
}

export const DeepLinkListener = ({
  currentRouteName,
  navigateToRequestToJoin,
}: {
  currentRouteName: string | undefined;
  navigateToRequestToJoin: (invite: ReceivedInviteLink) => void;
}) => {
  const [arrival, setArrival] = React.useState(initialArrival);
  const handled = React.useRef<LinkArrival | null>(null);

  React.useEffect(() => {
    function onUrl({url}: {url: string}) {
      setArrival({url});
    }

    // React Native dropped removeEventListener in favor of the returned
    // subscription, so the paired-listener rule cannot be satisfied here.
    // eslint-disable-next-line @eslint-react/web-api-no-leaked-event-listener
    const subscription = Linking.addEventListener('url', onUrl);
    return () => subscription.remove();
  }, []);

  React.useEffect(() => {
    if (!arrival || arrival === handled.current || !currentRouteName) return;
    if (isInviteScreen(currentRouteName)) return;
    if (isEditingScreen(currentRouteName)) return;

    handled.current = arrival;
    // Stops a reload resurrecting the launch url from `getLinkingURL`.
    Linking.clearInitialURL();

    const invite = parseInviteLink(arrival.url);
    if (!invite) return;

    navigateToRequestToJoin({...invite, url: arrival.url});
  }, [arrival, currentRouteName, navigateToRequestToJoin]);

  return null;
};
