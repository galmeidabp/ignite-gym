import { Heading, HStack, Text, Toast, ToastTitle, useToast, VStack } from '@gluestack-ui/themed';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { AppNavigatorRoutesProps } from '@routes/app.routes';
import { AppError } from '@utils/AppError';
import { api } from '@services/api';
import { ExerciseDTO } from '@dtos/ExerciseDTO';
import { Loading } from '@components/Loading';

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [ exercise, setExercise ] = useState<ExerciseDTO[]>([])
  const [ groups, setGroups ] = useState<string[]>([])
  const [ groupSelected, setGroupSelected ] = useState('antebraço')

  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(exerciseId: string) {
    navigation.navigate('exercise', {exerciseId})
  }

  async function fetchGroups() {
    try {
      const response = await api.get('/groups')
      setGroups(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.'
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle style={{marginTop: 10, backgroundColor: 'red'}}>{title}</ToastTitle>
          </Toast>
        ),
      });
    }
  }

  async function fetchExerciseByGroup() {
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercise(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.'
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle style={{marginTop: 10, backgroundColor: 'red'}}>{title}</ToastTitle>
          </Toast>
        ),
      });
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  useFocusEffect(useCallback(() => {
    fetchExerciseByGroup()
  }, [groupSelected]))

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

      {
        isLoading ? <Loading /> : 
        <VStack px='$8' flex={1} >
          <HStack justifyContent='space-between' mb='$5' alignItems='center' >
            <Heading color='$gray200' fontSize='$md' fontFamily='#heading'>
              Exercícios
            </Heading>

            <Text color='$gray200' fontSize='$sm'>{exercise.length}</Text>
          </HStack>

          <FlatList data={exercise} keyExtractor={item => item.id} renderItem={(({item}) => <ExerciseCard data={item} onPress={() => handleOpenExerciseDetails(item.id)} />)} 
          showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom: 20}} />
        </VStack>
      }
    </VStack>
  )
}