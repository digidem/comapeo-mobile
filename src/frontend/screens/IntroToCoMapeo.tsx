import * as React from 'react';
import TopoBackground from '../images/TopoLogo.svg';
import CoMapeoTextAsSVG from '../images/CoMapeoText.svg';
import {StyleSheet, Text, View} from 'react-native';
import {WHITE} from '../lib/styles';

export const IntroToCoMapeo = () => {
  return (
    <View style={{backgroundColor: '#050F77'}}>
      <TopoBackground height={'100%'} />
      <View style={styles.content}>
        <Text style={[styles.text, {fontSize: 40}]}>MAPEO</Text>
        <Text style={[styles.text, {fontSize: 20, marginTop: 20}]}>is now</Text>
        <CoMapeoTextAsSVG style={{marginTop: -30}} width={'90%'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: WHITE,
  },
});
