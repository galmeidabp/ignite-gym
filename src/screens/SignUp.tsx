import { useNavigation } from '@react-navigation/native';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';

import { Center, Heading, Image, ScrollView, VStack, Text } from '@gluestack-ui/themed';

import BackgroundImg from '@assets/background.png';
import Logo from '@assets/logo.svg';

import { Input } from '@components/Input';
import { Button } from '@components/Button';


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

export function SignUp({name, email, password, password_confirm}: FormDataProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  function handleSignUp({name, email, password, password_confirm}: FormDataProps) {
    console.log({name, email, password, password_confirm})
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

              <Button title='Criar e acessar' onPress={handleSubmit(handleSignUp)} />
            </Center>

              <Button title='Voltar para o login' variant='outline' mt='$12' onPress={handleGoBack} />

        </VStack>
      </VStack>
    </ScrollView>
  )
}