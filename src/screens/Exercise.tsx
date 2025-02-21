import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react-native'
import { TouchableOpacity } from 'react-native'

import { useNavigation, useRoute } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { api } from '@services/api'

import { ExerciseDTO } from '@dtos/ExerciseDTO'

import { Box, Heading, HStack, Icon, Image, ScrollView, Text, Toast, useToast, VStack, ToastTitle } from '@gluestack-ui/themed'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionSvg from '@assets/repetitions.svg'

import { Loading } from '@components/Loading'
import { Button } from '@components/Button'

import { AppError } from '@utils/AppError'

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [isLoading, setIsLoading] = useState(true)
  const [sendingRegister, setSendingRegister] = useState(false)
  const toast = useToast()
  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)

  const route = useRoute()
  const { exerciseId } = route.params as RouteParamsProps

  function handleGoBack() {
    navigation.goBack()
  }

  async function fetchExerciseDetails() {
    try {
      setIsLoading(true)
      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercícios.'
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle style={{marginTop: 10, backgroundColor: 'red'}}>{title}</ToastTitle>
          </Toast>
        ) 
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister() {
    try {
      setSendingRegister(true)
      await api.post('/history', {exercise_id: exerciseId})

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle 
              style={{marginTop: 10, backgroundColor: 'green'}}
            >
              'Parabéns! Exercício registrado com sucesso.'
            </ToastTitle>
          </Toast>
        ) 
      })

      navigation.navigate('history')
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle style={{marginTop: 10, backgroundColor: 'red'}}>{title}</ToastTitle>
          </Toast>
        ) 
      })
    } finally {
      setSendingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])

  return (
    <VStack flex={1}>
      <VStack px='$8' bg='$gray600' pt='$12' >

        <TouchableOpacity onPress={handleGoBack }>
          <Icon as={ArrowLeft} color='$green500' size='xl' />
        </TouchableOpacity>

        <HStack 
          justifyContent='space-between' 
          alignItems='center' mt='$4' mb='$8'>
          <Heading 
            color='$gray100' 
            fontFamily='$heading' 
            fontSize='$lg' 
            flexShrink={1} 
          >
            {exercise.name}
          </Heading>

          <HStack alignItems='center' >
            <BodySvg />
            <Text color='$gray200' ml='$1' textTransform='capitalize'>
              {exercise.group}
            </Text>
          </HStack>
        </HStack>

      </VStack>
      {
      isLoading ? <Loading /> : 
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{paddingBottom: 62}}>

          <VStack p='$8'>
            <Box rounded='lg' mb={3} overflow='hidden'>
              <Image 
                source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}} 
                alt='Imagem do exercício' 
                mb='$3' 
                resizeMode='cover' 
                rounded='$lg' 
                w='$full' h='$80' 
              />
            </Box>

            <Box bg='$gray600' rounded='$md' pb='$4' px='$4'>
              <HStack 
                alignItems='center' 
                justifyContent='space-around' 
                mb='$6' mt='$5'>

                <HStack>
                  <SeriesSvg />
                  <Text color='$gray200' ml='$2' >{exercise.series} séries</Text>
                </HStack>

                <HStack>
                  <RepetitionSvg />
                  <Text color='$gray200' ml='$2' >{exercise.repetitions} repetições</Text>
                </HStack>

              </HStack>

              <Button 
                title='Marcar como realizado' 
                isLoading={sendingRegister} 
                onPress={handleExerciseHistoryRegister} 
              />
            </Box>
          </VStack>

        </ScrollView>
      }

    </VStack>
  )
}