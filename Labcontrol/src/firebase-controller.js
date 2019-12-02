import firebase from 'firebase'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBd9Arry85cB55-LnKr5zXYCUq1HBr9sUc',
  authDomain: 'campusq-7bfe2.firebaseapp.com',
  databaseURL: 'https://campusq-7bfe2.firebaseio.com',
  projectId: 'campusq-7bfe2',
  storageBucket: 'campusq-7bfe2.appspot.com',
  messagingSenderId: '623389425539',
  appId: '1:623389425539:web:be2d90e15ef92c719700b6',
  measurementId: 'G-X8WFL2LQG8'
}

const firebaseApp = firebase.initializeApp(config)

export default firebaseApp
