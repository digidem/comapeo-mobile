import React, {useState} from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  FadeInUp,
  FadeOutUp,
  LinearTransition,
} from 'react-native-reanimated';
import {Text} from '../../sharedComponents/Text.tsx';
import ChainIcon from '../../images/Chain.svg';
import Chevrondown from '../../images/chevrondown.svg';
import ChevrondownDefault from '../../images/chevrondown-expanded.svg';
import {Observation} from '@mapeo/schema';
import {ObservationListItem} from '../ObservationsList/ObservationListItem.tsx';
import {useNavigationFromRoot} from '../../hooks/useNavigationWithTypes.ts';
import {defineMessages, useIntl} from 'react-intl';

interface TrackObservation {
  observations: Observation[];
}

const m = defineMessages({
  observations: {
    id: 'screens.Track.ObservationList.observations',
    defaultMessage: 'Observations',
  },
});

export function ObservationList({observations}: TrackObservation) {
  const [expanded, setExpanded] = useState(false);
  const navigation = useNavigationFromRoot();
  const {formatMessage} = useIntl();
  const Icon = expanded ? Chevrondown : ChevrondownDefault;

  return (
    <Animated.View
      layout={LinearTransition.easing(Easing.inOut(Easing.ease)).duration(400)}>
      <Pressable
        onPress={() => {
          setExpanded(prev => !prev);
        }}
        style={[styles.wrapper, styles.elementWrapper]}>
        <View style={styles.wrapper}>
          <Text style={styles.text}>{observations.length}</Text>
          <ChainIcon style={{marginRight: 10, marginLeft: 2}} />
          <Text style={styles.text}>{formatMessage(m.observations)}</Text>
        </View>
        <Icon />
      </Pressable>
      <Animated.View entering={FadeInUp} exiting={FadeOutUp}>
        {expanded &&
          observations.map((observation, index) => (
            <ObservationListItem
              key={index}
              observation={observation}
              onPress={() => {
                navigation.navigate('Observation', {
                  observationId: observation.docId,
                });
              }}
              testID={'id' + index}
            />
          ))}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  elementWrapper: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
