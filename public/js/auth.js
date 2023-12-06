import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signOut, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDr7WuXjei_cH93d4G3uHCcvAaCMgi2aXQ",
    authDomain: "homegrownrecipes-c0097.firebaseapp.com",
    projectId: "homegrownrecipes-c0097",
    storageBucket: "homegrownrecipes-c0097.appspot.com",
    messagingSenderId: "448917629254",
    appId: "1:448917629254:web:2b9237bc20ada549841d47"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


//listen for auth status changes
onAuthStateChanged(auth, (user) => {
// Check for user status
// console.log(user);
    const reviewsContainer = document.getElementById("reviews-container");
  
    if (user) {
        // User is logged in
        console.log("User logged in: ", user.email);

        // Show the reviews container
        reviewsContainer.style.display = "block";
        getReviews(db).then((snapshot) => {
            setupReviews(snapshot);
        });
        setupUI(user);
        const form = document.querySelector("form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
    
            addDoc(collection(db, "reviews"), {
            title: form.title.value,
            description: form.description.value,
            }).catch((error) => console.log(error));
    
            form.title.value = "";
            form.description.value = "";
        });
    } else {
        // User is logged out
        console.log("User Logged out");
  
        // Hide the reviews container
        reviewsContainer.style.display = "none";
    
        setupUI();
        setupReviews([]);
    }
});

//signup
const signupForm = document.querySelector("#signup-form");
// const auth = getAuth(app);
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
});

//Logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
    e.preventDefault();
    signOut(auth).then(() => {
        console.log("User has signed out");
    }).catch((error) => {
        //error happened
    });
});

//Login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = loginForm["login-email"].value;
    const password = loginForm["login-password"].value;
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
        //signed in
        const user = userCredential.user;
        console.log(user);
        const modal = document.querySelector("#modal-signup");
        M.Modal.getInstance(modal).close();
        loginForm.reset();
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
});