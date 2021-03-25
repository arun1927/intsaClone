import firebase from "firebase";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBQUWhujF2H5LQpLIMJC7A7QlpxAE_fcPQ",
  authDomain: "bestie-ab444.firebaseapp.com",
  databaseURL: "https://bestie-ab444.firebaseio.com",
  projectId: "bestie-ab444",
  storageBucket: "bestie-ab444.appspot.com",
  messagingSenderId: "961535465597",
  appId: "1:961535465597:web:5552447f978414efbdb914",
  measurementId: "G-31Y7MNFMDP"
});

const db=firebaseApp.firestore();
const auth=firebase.auth();
const storage=firebase.storage();

export {db, auth, storage}; 