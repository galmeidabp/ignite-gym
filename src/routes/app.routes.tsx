import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { gluestackUIConfig } from '@gluestack-ui/config';
import { Platform } from 'react-native';


import { Exercise } from '@screens/Exercise';
import { History } from '@screens/History';
import { Home } from '@screens/Home';
import { Profile } from '@screens/Profile';

import HomeSvg from '@assets/home.svg';
import HistorySvg from '@assets/history.svg';
import ProfileSvg from '@assets/profile.svg';

type AppRoutes = {
  home: undefined
  exercise: {exerciseId: string}
  profile: undefined
  history: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {
  const { tokens } = gluestackUIConfig
  const iconSize = tokens.space['6']

  return(
    <Navigator 
      screenOptions={{headerShown: false, 
      tabBarShowLabel: false, 
      tabBarActiveTintColor: tokens.colors.green500,
      tabBarInactiveTintColor: tokens.colors.coolGray200, //ta na cor errada nessa porcariaaaaa
      tabBarStyle: {
        backgroundColor: tokens.colors.coolGray600,
        borderTopWidth: 0,
        height: Platform.OS === 'android' ? 'auto' : 96,
        paddingBottom: tokens.space['10'],
        paddingTop: tokens.space['6']
      }
    }}>

      <Screen name='home' component={Home} options={{tabBarIcon: ({color}) => <HomeSvg
        fill={color} width={iconSize} height={iconSize} />}} />

      <Screen name='history' component={History} options={{tabBarIcon: ({color}) => <HistorySvg
        fill={color} width={iconSize} height={iconSize} />}} /> 

      <Screen name='profile' component={Profile} options={{tabBarIcon: ({color}) => <ProfileSvg
        fill={color} width={iconSize} height={iconSize} />}} /> 

      <Screen name='exercise' component={Exercise} 
      options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none'} }} />
    </Navigator>
  )
}