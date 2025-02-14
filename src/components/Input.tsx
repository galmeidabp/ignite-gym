import { FormControl, FormControlError, FormControlErrorText, Input as GluestackInput, InputField } from "@gluestack-ui/themed"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof InputField> & {
  isReadOnly?: boolean
  errorMessage?: string | null
  isInvalid?: boolean
}

  export function Input({isReadOnly = false, errorMessage = null, isInvalid = false, ...rest}: Props) {
    const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} w='$full' mb='$4'>
      <GluestackInput 
        isInvalid={isInvalid}
        h='$14'  
        borderWidth='$0' 
        borderRadius='$md' 
        $invalid={{ borderWidth: 1, borderColor: '$red500'  }}
        $focus={{ borderWidth: 1, borderColor: invalid ? '$red500' : '$green500' }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1} >

        <InputField
          color='$white' px='$4' bg='$gray700'  fontFamily='$body' placeholderTextColor='$gray300'
          {...rest} />
          
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color='$red500'>{errorMessage}</FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}