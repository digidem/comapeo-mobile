import NewProjectIcon from '../../images/AddSquare.svg';
import {StartNewProjectBaseScreen} from '../../sharedComponents/StartNewProjectBase';
import {NativeRootNavigationProps} from '../../sharedTypes/navigation';

type Props = NativeRootNavigationProps<'StartNewProject'>;

export const StartNewProject: React.FC<Props> = props => (
  <StartNewProjectBaseScreen
    {...props}
    TopIcon={NewProjectIcon}
    iconProps={{width: 80, height: 80}}
    onGoBack={props.navigation.goBack}
    onStart={() => console.log('Going to go to the new create project screen')}
  />
);
