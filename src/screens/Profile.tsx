import { ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import { Center, Heading, Text, ToastTitle, useToast, VStack } from '@gluestack-ui/themed';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'; 
import * as yup from 'yup'

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

import { Button } from '@components/Button';
import { Input } from '@components/Input';
import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { ToastMessage } from '@components/ToastMessage';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '@hooks/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '@services/api';
import { Toast } from '@gluestack-ui/themed';
import { AppError } from '@utils/AppError';

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().optional(),
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
  old_password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
  confirm_password: yup.string().nullable().transform((value) => !!value ? value : null).oneOf([yup.ref('password'), null], 'As senhas devem ser iguais.'),
});

// Em vez de forçar a tipagem, deixa que.o próprio yup crie a tipagem
type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const toast = useToast()
  const [ isUpdating, setIsUpdating ] = useState(false)

  const { user, updateUserProfile } = useAuth()

  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
  })

  async function handleUserPhotoSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      })

      if (photoSelected.canceled) {
        return
      }

      const photoURI = photoSelected.assets[0].uri
      
      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number
        }
        if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5 ) { 
          return toast.show({
            placement: 'top',
            render: ({id}) => (
              <ToastMessage id='1' action='error' 
              title='Essa imagem é muito grande. Escolha uma de até 5MB' 
              onClose={() => toast.close(id)}  />
            )
          })
        }

        const fileExtension = photoURI.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        const userUpdated = user
        userUpdated.avatar = avatarUpdatedResponse.data.avatar
        updateUserProfile(userUpdated)

        toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle style={{marginTop: 10, backgroundColor: 'green'}}>'Foto atualizada!'</ToastTitle>
          </Toast>
        ) 
      })

      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setIsUpdating(true)

      const userUpdated = user
      userUpdated.name = data.name

      await api.put('/users', data)

      await updateUserProfile(userUpdated)

      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle style={{marginTop: 10, backgroundColor: 'green'}}>'Perfil atualizado com sucesso!'</ToastTitle>
          </Toast>
        ) 
      })
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível atualizar os dados. Tente novamente mais tarde.'
      toast.show({
        placement: "top",
        render: () => (
          <Toast action="error" variant="outline">
            <ToastTitle style={{marginTop: 10, backgroundColor: 'red'}}>{title}</ToastTitle>
          </Toast>
        ) 
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />
      
      <ScrollView contentContainerStyle={{paddingBottom: 36}}>
        <Center mt='$6' px='$10'>
          <UserPhoto size='xl' 
            source={user.avatar ? 
            {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} 
            : defaultUserPhotoImg}  alt='Foto do usuário' />

          <TouchableOpacity onPress={handleUserPhotoSelect} >
            <Text color='$green500' fontFamily='$heading' fontSize='$md' mt='$2' mb='$8'>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w='$full' gap='$4' >

            <Controller
              control={control}
              name='name'
              render={({ field: { value, onChange } }) => (
              <Input placeholder='Nome' bg='$gray600' onChangeText={onChange} value={value} errorMessage={errors.name?.message} /> 
            )}
            />

            <Controller
              control={control}
              name='email'
              render={({ field: { value, onChange } }) => (
              <Input placeholder='Email' bg='$gray600' isReadOnly onChangeText={onChange} value={value}  />
            )}
            />

            

          </Center>

          <Heading alignSelf='flex-start' fontFamily='$heading' color='$gray200' mt='$12' mb='$2'>
            Alterar senha
          </Heading>

          <Center w='$full' gap='$4' >

            <Controller
              control={control}
              name='old_password'
              render={({ field: { onChange } }) => (
              <Input  placeholder='Senha antiga' bg='$gray600' secureTextEntry onChangeText={onChange} />
            )}
            />

            <Controller
              control={control}
              name='password'
              render={({ field: { onChange } }) => (
              <Input  placeholder='Nova senha' bg='$gray600' secureTextEntry onChangeText={onChange} errorMessage={errors.password?.message} />
            )}
            />

            <Controller
              control={control}
              name='confirm_password'
              render={({ field: { onChange } }) => (
              <Input  placeholder='Confirme a nova senha' bg='$gray600' secureTextEntry onChangeText={onChange} errorMessage={errors.confirm_password?.message} />
            )}
            />
          
            <Button title='Atualizar' onPress={handleSubmit(handleProfileUpdate)} isLoading={isUpdating} />
          </Center>
        </Center>

        
        
      </ScrollView>
    </VStack>
  )
}