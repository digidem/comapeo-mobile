import NewProjectIcon from '../../images/AddSquare.svg';
import {StartNewProjectBaseScreen} from '../../sharedComponents/Projects/StartNewProjectBase';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

type Props = NativeRootNavigationProps<'StartNewProject'>;

export const StartNewProject: React.FC<Props> = ({navigation}) => (
  <StartNewProjectBaseScreen
    TopIcon={NewProjectIcon}
    iconProps={{width: 80, height: 80}}
    onGoBack={navigation.goBack}
    onStart={() => navigation.navigate('CreateProject')}
  />
);
