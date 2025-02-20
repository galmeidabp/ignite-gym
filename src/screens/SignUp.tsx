import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import { Center, Heading, Image, ScrollView, VStack, Text, useToast, Toast, ToastTitle } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import { useAuth } from '@hooks/useAuth';
import { useState } from 'react';


type FormDataProps = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome'),
  email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
  password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
  password_confirm: yup.string().required('Confirme a senha').oneOf([yup.ref('password'), ''], 'A confirmação da senha não confere')
})

export function SignUp() {
  const [ isLoading, setIsLoading ] = useState(false)

  const toast = useToast()
  const {signIn} = useAuth()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSignUp({name, email, password}: FormDataProps) {
    try {
      setIsLoading(true)

      await api.post('/users', { name, email, password})
      await signIn(email, password)

    } catch (error) {
      setIsLoading(false)

      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente novamente mais tarde.'

      toast.show({
       placement: "top",
       render: () => (
         <Toast action="error" variant="outline">
           <ToastTitle style={{marginTop: 10, backgroundColor: 'red'}}>{title}</ToastTitle>
         </Toast>
       ),
     });
    }

    /*
    fetch('http://192.168.1.207:3333/users', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password})
    }).then(response => response.json())
    .then(data => console.log(data))
    */
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

            <Center gap='$2' flex={1}>
              <Heading color='$gray100'>Crie sua conta</Heading>

              <Controller control={control} name='name' render={({field: {onChange, value}}) => (
                <Input placeholder='Nome' errorMessage={errors.name?.message}
                onChangeText={onChange} value={value} />
              )} />

              <Controller control={control} name='email' render={({field: {onChange, value}}) => (
                <Input placeholder='E-mail' errorMessage={errors.email?.message}
                keyboardType='email-address' autoCapitalize='none' onChangeText={onChange} value={value} />
              )} />

              <Controller control={control} name='password' render={({field: {onChange, value}}) => (
                <Input placeholder='Senha' errorMessage={errors.password?.message}
                secureTextEntry onChangeText={onChange} value={value} />
              )} />

              <Controller control={control} name='password_confirm' render={({field: {onChange, value}}) => (
                <Input placeholder='Confirme a senha' errorMessage={errors.password_confirm?.message} 
                secureTextEntry onChangeText={onChange} 
                value={value} onSubmitEditing={handleSubmit(handleSignUp)} 
                returnKeyType='send' />
              )} />

              <Button title='Criar e acessar' onPress={handleSubmit(handleSignUp)} isLoading={isLoading} />
            </Center>

              <Button title='Voltar para o login' variant='outline' mt='$12' onPress={handleGoBack} />

        </VStack>
      </VStack>
    </ScrollView>
  )
}