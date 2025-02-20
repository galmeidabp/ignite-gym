import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken";
import { storageUserGet, storageUserRemove, storageUserSave } from "@storage/storageUser";
import { createContext, ReactNode, useEffect, useState } from "react";

export type AuthContextDataProps = {
  user: UserDTO
  updateUserProfile: (userUpdated: UserDTO) => void
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoadingUserStorageData: boolean
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string) {
    try {
      setIsLoadingUserStorageData(true)
      await storageUserSave(userData);
      await storageAuthTokenSave(token);
      
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', {email, password})

    if(data.user && data.token) {
      await storageUserAndTokenSave(data.user, data.token)
      await userAndTokenUpdate(data.user, data.token) //coloquei um await aq -gpt
      setUser(data.user) //garantir q o estado do user seja atualizado -gpt
    } 
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true)
      setUser({} as UserDTO)
      await storageUserRemove()
      await storageAuthTokenRemove()
      
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO) {
    try {
      setUser(userUpdated)
      await storageUserSave(userUpdated)
    } catch (error) {
      throw error
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const token = await storageAuthTokenGet()

      if(token && userLogged) {
        userAndTokenUpdate(userLogged, token)
        setUser(userLogged) //att o estado do user dps de carregar dados -gpt
    }
      
    } catch (error) {
      throw error
    } finally {
      setIsLoadingUserStorageData(false) //att o estado de carregamento 
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  return( 
    <AuthContext.Provider value={{ user, updateUserProfile, signIn, isLoadingUserStorageData, signOut }}>
      { children }
    </AuthContext.Provider>
  )
  
}
