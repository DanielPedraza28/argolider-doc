import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAsRIdJkhtd-ROrVSdGxNpnirvVa8OFtA0",
  authDomain: "argoliderdoc.firebaseapp.com",
  projectId: "argoliderdoc",
  storageBucket: "argoliderdoc.firebasestorage.app",
  messagingSenderId: "859556289480",
  appId: "1:859556289480:web:d80345b9ca7c730fe9befd"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app, "gs://argoliderdoc.firebasestorage.app") // ← importante

export { app, db, storage }
