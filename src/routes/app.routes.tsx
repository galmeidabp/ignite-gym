import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { Exercise } from '@screens/Exercise'
import { History } from '@screens/History'
import { Home } from '@screens/Home'
import { Profile } from '@screens/Profile'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'

type AppRoutes = {
  home: undefined
  exercise: undefined
  profile: undefined
  history: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  return(
    <Navigator screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Screen name='home' component={Home} options={{tabBarIcon: () => <HomeSvg />}} />
      <Screen name='history' component={History} />
      <Screen name='profile' component={Profile} />

      <Screen name='exercise' component={Exercise} />
    </Navigator>
  )
}