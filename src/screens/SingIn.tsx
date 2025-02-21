import { useNavigation } from '@react-navigation/native'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { Controller, useForm } from 'react-hook-form'

import { Center, Heading, Image, ScrollView, VStack, Text, useToast, Toast, ToastTitle } from '@gluestack-ui/themed'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { useAuth } from '@hooks/useAuth'
import { AppError } from '@utils/AppError'
import { useState } from 'react'

type FormDataProps = {
  email: string
  password: string
}

export function SignIn() {
  const { signIn } = useAuth()
  const [ isLoading, setIsLoading ] = useState(false)

  const toast = useToast()
  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({})

  function handleNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({email, password}: FormDataProps) {
    try{
      setIsLoading(true)
      await signIn(email, password)
    } catch (error) {
      const isAppError = error instanceof AppError

      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais'
      setIsLoading(false)

      toast.show({
        placement: "top",
        render: () => (
          <Toast action='error' variant='outline'>
            <ToastTitle
              style={{marginTop: 10, backgroundColor: 'red'}}
            >{title}</ToastTitle>
          </Toast>
        ),
      });
    }
  }

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1}>
        <Image w='$full' h={624}
          source={BackgroundImg} 
          position='absolute'
          alt='Pessoas trinando'
          defaultSource={BackgroundImg} />

        <VStack flex={1} px='$10' pb='$16'>
            <Center my='$24'>
              <Logo />
              <Text color='$gray100' fontSize='$sm'>
                Treine sua mente e o seu corpo.
              </Text>
            </Center>

            <Center gap='$2'>
              <Heading color='$gray100'>Acesse a conta</Heading>

              <Controller 
                control={control}
                name="email"
                rules={{ required: 'Informe o e-mail' }}
                render={({ field: { onChange } }) => (
                  <Input 
                    placeholder="E-mail" 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onChangeText={onChange}
                    errorMessage={errors.email?.message}
                  />
                )}
              />

              <Controller 
                control={control}
                name="password"
                rules={{ required: 'Informe a senha' }}
                render={({ field: { onChange } }) => (
                  <Input 
                    placeholder="Senha" 
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              

              <Button title='Acessar' onPress={handleSubmit(handleSignIn)} isLoading={isLoading}/>
            </Center>

            <Center flex={1} justifyContent='flex-end' mt='$4'>
              <Text color='$gray100' fontSize='$sm' mb='$3' fontFamily='$body' >
                Ainda não tem acesso?
              </Text>

              <Button title='Criar Conta' variant='outline' onPress={handleNewAccount} />
            </Center>

        </VStack>
      </VStack>
    </ScrollView>
  )
}