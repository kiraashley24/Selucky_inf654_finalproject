import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  onSnapshot, 
  addDoc,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,
 } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
 import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

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
const db = getFirestore(app);

async function getReviews(db) {
  const reviewsCol = collection(db, "reviews");
  const reviewSnapshot = await getDocs(reviewsCol);
  const reviewList = reviewSnapshot.docs.map((doc) => doc);
  return reviewList;
}

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      console.log('Persistence failed');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.log('Persistence is not valid');
    }
  });



const unsub = onSnapshot(collection(db, "reviews"), (doc) => {
  //   console.log(doc.docChanges());
  doc.docChanges().forEach((change) => {
    // console.log(change, change.doc.data(), change.doc.id);
    if (change.type === "added") {
      //Call render function in UI
      renderReview(change.doc.data(), change.doc.id);
    }
    if (change.type === "removed") {
      //do something
      removeReview(change.doc.id);
    }
  });
});

//add new review
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
    event.preventDefault();

    addDoc(collection(db, "reviews"), {
        title: form.title.value,
        description: form.description.value,
    }).catch((error) => console.log(error));

    //close form
    const sideFormInstance = M.Sidenav.getInstance(document.getElementById("side-form"));
    sideFormInstance.close();

    form.title.value = "";
    form.description.value = "";
});

//delete review
const reviewsContainer = document.querySelector("#reviews-container");
reviewsContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "I") {
    const id = event.target.getAttribute("data-id");
    deleteDoc(doc(db, "reviews", id));
  }
});