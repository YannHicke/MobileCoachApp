import { StackNavigator } from 'react-navigation'
import PersonalData from '../../Containers/PersonalData'
import AddMedication from '../../Containers/Me/AddMedication'
import Impressum from '../../Containers/Me/Impressum'
import Support from '../../Containers/Me/Support'
import Sources from '../../Containers/Me/Sources'
import Me from '../../Containers/Me/Me'

export const initialRouteName = 'Me'

export const codeScanMandatory = false

// Manifest of possible screens
const MeNav = StackNavigator(
  {
    // Start screen with logo
    Me: {
      screen: Me
    },
    PersonalData: {
      screen: PersonalData
    },
    ScreenAddMedication: {
      screen: AddMedication
    },
    ScreenImpressum: {
      screen: Impressum
    },
    ScreenSupport: {
      screen: Support
    },
    ScreenSources: {
      screen: Sources
    }
  },
  {
    headerMode: 'none',
    initialRouteName,
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default MeNav
