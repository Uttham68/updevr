/**
 * Firebase Firestore Cloud Configuration - updevr
 */

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCQL9sCN4VsRRPpjz9wemBdvrHfloVpm9M",
  authDomain: "updevr-8b351.firebaseapp.com",
  projectId: "updevr-8b351",
  storageBucket: "updevr-8b351.firebasestorage.app",
  messagingSenderId: "599958649713",
  appId: "1:599958649713:web:6938fa19fc8507b57914d0",
  measurementId: "G-9G357GRTYF"
};

// Check if valid Firebase configuration is present
window.isFirebaseConfigured = function() {
  return window.FIREBASE_CONFIG && 
         window.FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY" && 
         window.FIREBASE_CONFIG.projectId !== "YOUR_PROJECT_ID";
};
