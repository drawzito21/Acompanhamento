import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// 🛠️ Substitua com as credenciais do seu projeto Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

