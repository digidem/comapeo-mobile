/**
 * Shown by `withRealNavigator` while `useFlowState` is still applying a
 * spec. Renders the spec being applied as text so a story that hangs
 * mid-seed is diagnosable from a screenshot alone (PRD Task 1.5 / Risk 6).
 */
import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {LoadingIndicator} from '../../src/frontend/sharedComponents/LoadingIndicator';

import type {FlowStateSpec} from './flowState';

export function FlowStatePlaceholder({spec}: {spec?: FlowStateSpec}) {
  return (
    <View style={styles.container}>
      <LoadingIndicator size="small" />
      <Text style={styles.label}>Applying flow state…</Text>
      <Text style={styles.spec}>{JSON.stringify(spec ?? null, null, 2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  spec: {
    fontFamily: 'monospace',
    fontSize: 12,
    textAlign: 'left',
  },
});
