import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { resolvedFirebaseConfig } from './appConfig'

const firebaseConfig = resolvedFirebaseConfig

export const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean)
const firebaseApp = hasFirebaseConfig ? initializeApp(firebaseConfig) : null

export const auth = firebaseApp ? getAuth(firebaseApp) : null
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })
