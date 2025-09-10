import * as React from 'react';
import {View, StyleSheet} from 'react-native';
import {defineMessages, useIntl} from 'react-intl';
import {SecondaryButton} from '../../sharedComponents/Buttons';
import {HeaderText} from '../../sharedComponents/Text/HeaderText';
import {BodyText} from '../../sharedComponents/Text/BodyText';
import {useActiveProjectIdActions} from '../../contexts/ActiveProjectIdStoreContext';
import {type NativeRootNavigationProps} from '../../sharedTypes/navigation';
import GreenCheck from '../../images/Success.svg';
import {BLACK, NEW_DARK_GREY} from '../../lib/styles';

const m = defineMessages({
  title: {
    id: 'ProjectOnboarding.Success.title',
    defaultMessage: 'Success!',
  },
  body: {
    id: 'ProjectOnboarding.Success.body',
    defaultMessage: 'is ready for collaboration.',
  },
  done: {id: 'ProjectOnboarding.Success.done', defaultMessage: 'Done'},
});

type Props = NativeRootNavigationProps<'ProjectCreatedOnboarding'>;

export const ProjectCreated: React.FC<Props> = ({route}) => {
  const {formatMessage: t} = useIntl();
  const {setActiveProjectId} = useActiveProjectIdActions();

  const handleDone = () => {
    setActiveProjectId(route.params.projectId);
  };

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center', gap: 30}}>
        <GreenCheck />
        <HeaderText
          variant="header1"
          style={{
            textAlign: 'center',
            color: BLACK,
          }}>
          {t(m.title)}
        </HeaderText>
        <View style={{gap: 10}}>
          <HeaderText
            variant="header5"
            style={{
              textAlign: 'center',
            }}>
            {route.params.name}
          </HeaderText>
          <BodyText
            style={{
              textAlign: 'center',
              color: NEW_DARK_GREY,
            }}>
            {t(m.body)}
          </BodyText>
        </View>
      </View>
      <View style={{width: '100%', alignItems: 'center'}}>
        <SecondaryButton fullSize text={t(m.done)} onPress={handleDone} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'space-between',
  },
});
