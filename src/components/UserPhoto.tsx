import { ComponentProps } from 'react'

import { Image } from '@gluestack-ui/themed'


type Props = ComponentProps<typeof Image>

export function UserPhoto({...rest}: Props) {
  return (
    <Image {...rest} 
      rounded='$full' 
      borderWidth='$2' 
      borderColor='$gray400' 
      backgroundColor='$gray500' 
    />
  )
}