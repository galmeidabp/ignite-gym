import { Heading, HStack, Text, VStack } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { FlatList } from 'react-native';

import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';


export function Home() {
  const [ exercise, setExercise ] = useState(['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra'])
  const [ groups, setGroups ] = useState<string[]>(['Costas', 'Biceps', 'Triceps', 'Ombro'])
  const [ groupSelected, setGroupSelected ] = useState('Costas')

  const navigation = useNavigation()
  function handleOpenExerciseDetails<AppNavigatorRouterProps>() {
    navigation.navigate('exercise')
  }

  return (
    <VStack flex={1}>
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({item}) => (
          <Group 
            name={item}
            isActive={groupSelected.toLowerCase() === item.toLowerCase()}
            onPress={() => setGroupSelected(item)} />
        )} horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={{paddingHorizontal: 32}}
        style={{ marginVertical: 40, maxHeight: 44, minHeight: 44 }} />

        <VStack px='$8' flex={1} >
          <HStack justifyContent='space-between' mb='$5' alignItems='center' >
            <Heading color='$gray200' fontSize='$md' fontFamily='#heading'>
              Exercícios
            </Heading>

            <Text color='$gray200' fontSize='$sm'>{exercise.length}</Text>
          </HStack>

          <FlatList data={exercise} keyExtractor={item => item} renderItem={(() => <ExerciseCard onPress={handleOpenExerciseDetails} />)} 
          showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}} />
        </VStack>
    </VStack>
  )
}