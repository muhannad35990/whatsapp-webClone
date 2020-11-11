import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyBGbt0K_TPv2MfREMx4k8qXXtV6O2zSzoM",
    authDomain: "whatsappweb-clone-6b5b8.firebaseapp.com",
    databaseURL: "https://whatsappweb-clone-6b5b8.firebaseio.com",
    projectId: "whatsappweb-clone-6b5b8",
    storageBucket: "whatsappweb-clone-6b5b8.appspot.com",
    messagingSenderId: "1091470515263",
    appId: "1:1091470515263:web:e3aebfbccc6afa63302c8a"
  };

  const firebaseApp=firebase.initializeApp(firebaseConfig)
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  const provider=new firebase.auth.GoogleAuthProvider();


export {auth,provider}
export default db;