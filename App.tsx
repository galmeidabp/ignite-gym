import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { Routes } from '@routes/index';
import { StatusBar } from 'expo-status-bar';

import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';

import { Loading } from '@components/Loading';


export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <GluestackUIProvider config={config}>
      <StatusBar style='light' backgroundColor='transparent' translucent />

      {fontsLoaded ? (
        <Routes />
        ) : <Loading />}
        
      </GluestackUIProvider>
  );
}