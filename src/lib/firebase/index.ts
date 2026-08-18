import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, setReactNativeAsyncStorage } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';
import { getFirestore } from '@react-native-firebase/firestore';
import { getStorage } from '@react-native-firebase/storage';

setReactNativeAsyncStorage(AsyncStorage);

export const firebaseApp = getApp();
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp, 'default');
export const storage = getStorage(firebaseApp);
