// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsRIdJkhtd-ROrVSdGxNpnirvVa8OFtA0",
  authDomain: "argoliderdoc.firebaseapp.com",
  projectId: "argoliderdoc",
  storageBucket: "argoliderdoc.firebasestorage.app",
  messagingSenderId: "859556289480",
  appId: "1:859556289480:web:d80345b9ca7c730fe9befd"
};

// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
// Inicializar Firestore
const db = getFirestore(app);
const storage = getStorage(app)

export { db, storage};