import ProjectIcon from '../../../images/ObservationsProject.svg';
import {StartNewProjectBaseScreen} from '../../../sharedComponents/Projects/StartNewProjectBase';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

type Props = NativeRootNavigationProps<'StartNewProject'>;

export const StartNewProjectScreen: React.FC<Props> = ({navigation}) => (
  <StartNewProjectBaseScreen
    TopIcon={ProjectIcon}
    onGoBack={navigation.goBack}
    onStart={() => navigation.replace('CreateProject')}
  />
);
