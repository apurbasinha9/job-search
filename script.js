import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

const search = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const searchItem = document.getElementById("search-item");
const searchedJobs = document.getElementById("searched-jobs");
const searchContainer = document.getElementById("search-container");
const displayResult = document.getElementById("display-result");
const noJobFound = document.getElementById("no-job-found");
const jobTemplate = document.getElementById("job-template");
const jobModal = document.getElementById("myModal");
const mainBar = document.getElementById("main-content");
const displayAllJobs = document.getElementById("display-all-jobs");
const displaySomeJobs = document.getElementById("display-few-jobs");
const signin = document.getElementById("signin");
const signup = document.getElementById("register");
const profileName = document.getElementById("profile");
const signout = document.getElementById("signout");
const footerWrapper = document.getElementById("footer-wrapper");
let currentUser = null;
let jobList = [];

const firebaseConfig = {
  apiKey: "AIzaSyBxLejAKJSguUma0j4ObGjNCCcTVpo0rls",
  authDomain: "job-search-db-32e0b.firebaseapp.com",
  projectId: "job-search-db-32e0b",
  storageBucket: "job-search-db-32e0b.appspot.com",
  messagingSenderId: "388897369769",
  appId: "1:388897369769:web:10d323df5a300f047ac3b8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//remove signin and signup after authentication
function hideAuthenticationLinks(docData) {
  signin.style.display = "none";
  signup.style.display = "none";
  signout.style.display = "block";
  profileName.style.display = "block";
  profileName.innerText = docData.data().fullName;
}

// ✅ Detect signed-in user on homepage
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     currentUser = user;

//     const db = getFirestore();
//     const docRef = doc(db, "users", user.uid);
//     const docData = await getDoc(docRef);

//     hideAuthenticationLinks(docData);

//     if (docData.exists()) {
//       console.log("successfull!");
//     } else {
//       console.log("no data");
//     }

//     if (jobList.length > 0) {
//       displayJobs(jobList, currentUser);
//     }
//   } else {
//     console.log("not current user");
//   }
// });

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  const db = getFirestore();

  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docData = await getDoc(docRef);
    hideAuthenticationLinks(docData);
  }

  // Now fetch jobs AFTER determining the user state
  fetch("jobs.json")
    .then((res) => res.json())
    .then((data) => {
      jobList = data;

      if (currentUser) {
        displayJobs(jobList, currentUser);
      } else {
        displayFewJobs(jobList);
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

//signout user
signout.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.log(error);
    });
});

// fetch("jobs.json")
//   .then((res) => res.json())
//   .then((data) => {
//     jobList = data;
//     if (currentUser) {
//       displayJobs(jobList, currentUser);
//     } else {
//       displayFewJobs(jobList);
//     }
//   })
//   .catch((err) => {
//     console.error(err);
//   });

//display all jobs
function displayJobs(jobs, currentUser) {
  jobs.forEach((job) => {
    const clone = jobTemplate.content.cloneNode(true);

    clone.querySelector(".job-title").textContent = job.title;
    clone.querySelector(".job-company").textContent = job.company;
    clone.querySelector(".job-location").textContent = job.location;
    clone.querySelector(".job-salary").textContent = job.salary;
    clone.querySelector(".job-type").textContent = job.type;
    clone.querySelector(".job-description").textContent = job.description;
    clone.querySelector(".job-apply").addEventListener("click", () => {
      if (currentUser) {
        jobModal.style.display = "block";
      }
    });
    document.getElementById("display-all-jobs").appendChild(clone);
  });
}

//display few jobs
function displayFewJobs(jobs) {
  console.log(currentUser);

  const fewJobs = jobs.slice(0, 9);
  console.log(fewJobs);

  fewJobs.forEach((job) => {
    const clone = jobTemplate.content.cloneNode(true);

    clone.querySelector(".job-title").textContent = job.title;
    clone.querySelector(".job-company").textContent = job.company;
    clone.querySelector(".job-location").textContent = job.location;
    clone.querySelector(".job-salary").textContent = job.salary;
    clone.querySelector(".job-type").textContent = job.type;
    clone.querySelector(".job-description").textContent = job.description;
    clone.querySelector(".job-apply").addEventListener("click", () => {
      document.getElementById("job-application").style.display = "none";
      if (currentUser == null) {
        alert("please sign in to apply and track your progress!");
      }
    });
    displaySomeJobs.appendChild(clone);
  });
}

// Search autocomplete
search.addEventListener("input", () => {
  const searchVal = search.value.toLowerCase();
  searchItem.innerHTML = "";

  const searchBarWidth = searchContainer.offsetWidth - searchButton.offsetWidth;

  const filteredJob = jobList.filter((job) =>
    job.title.toLowerCase().includes(searchVal)
  );

  let existingTitle = new Set();
  filteredJob.forEach((job) => {
    if (!existingTitle.has(job.title)) {
      const li = document.createElement("li");
      li.classList.add("search-list");
      li.innerHTML = job.title;
      searchItem.appendChild(li);
      searchItem.style.display = "block";
      searchItem.style.width = `${searchBarWidth}px`;

      li.addEventListener("click", () => {
        search.value = job.title;
        searchItem.style.display = "none";
      });
    }
    existingTitle.add(job.title);
  });

  if (searchVal == "") {
    searchItem.innerHTML = "";
  }
});

// display job jobs
searchButton.addEventListener("click", () => {
  displayAllJobs.style.display = "none";
  displaySomeJobs.style.display = "none";
  searchItem.style.display = "none";
  displayResult.innerHTML = "";

  const searchInput = search.value.toLowerCase();

  if (searchInput == "") {
    noJobFound.innerHTML = "no jobs found";
    noJobFound.style.color = "#bdbdbd";
    return;
  } else {
    noJobFound.style.display = "none";

    searchedJobs.innerHTML = "";
    searchedJobs.style.width = `${displayResult.offsetWidth}px`;
    const p = document.createElement("p");
    p.innerText = "Job searched: " + searchInput;
    p.style.color = "#bdbdbd";
    searchedJobs.appendChild(p);
    searchedJobs.style.display = "block";
    displayResult.style.marginTop = 0;

    const results = jobList.filter((job) => {
      return job.title.toLowerCase().includes(searchInput.toLowerCase());
    });

    results.forEach((job) => {
      const clone = jobTemplate.content.cloneNode(true);
      clone.querySelector(".job-title").textContent = job.title;
      clone.querySelector(".job-company").textContent = job.company;
      clone.querySelector(".job-location").textContent = job.location;
      clone.querySelector(".job-salary").textContent = job.salary;
      clone.querySelector(".job-type").textContent = job.type;
      clone.querySelector(".job-description").textContent = job.description;
      clone.querySelector(".job-apply").addEventListener("click", () => {
        jobModal.style.display = "block";
      });
      displayResult.style.display = "block";
      displayResult.appendChild(clone);
    });
    search.value = "";
  }
});

//modal
const modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", () => {
  jobModal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");

  const navWidth = displayAllJobs.offsetWidth;
  nav.style.width = `${navWidth}px`;

  if (window.innerWidth >= 768) {
    footerWrapper.style.width = `${navWidth}px`;
  }
});
