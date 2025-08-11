import ProjectIcon from '../../../images/ObservationsProject.svg';
import {StartNewProjectBaseScreen} from '../../../sharedComponents/StartNewProjectBase';
import {NativeRootNavigationProps} from '../../../sharedTypes/navigation';

type Props = NativeRootNavigationProps<'StartNewProject'>;

export const StartNewProjectScreen: React.FC<Props> = props => (
  <StartNewProjectBaseScreen
    {...props}
    TopIcon={ProjectIcon}
    onGoBack={props.navigation.goBack}
    onStart={() => props.navigation.replace('CreateProject')}
  />
);
