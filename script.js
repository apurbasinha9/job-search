import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

import {
  getFirestore,
  getDocs,
  getDoc,
  doc,
  addDoc,
  collection,
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
const jobApplicationForm = document.getElementById("job-application-form");
let currentUser = null;
let selectedJobId = null;
let jobTitle = "";
let currentPage = 1;
let totalPages = 1;
const itemsPerPage = 12;
const nextButton = document.getElementById("nextButton");
const prevButton = document.getElementById("prevButton");
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

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  const db = getFirestore();

  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docData = await getDoc(docRef);
    hideAuthenticationLinks(docData);
  }

  const querySnapshot = await getDocs(collection(db, "jobs"));
  querySnapshot.forEach((doc) => {
    jobList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    totalPages = Math.ceil(jobList.length / itemsPerPage);
    displayJobs(jobList, currentUser, currentPage);
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

//display all jobs
function displayJobs(jobs, currentUser, page) {
  displayAllJobs.innerHTML = "";

  disablePrevAndNextButton(page);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  paginatedJobs.forEach((job) => {
    const clone = jobTemplate.content.cloneNode(true);

    clone.querySelector(".job-title").textContent = job.title;
    clone.querySelector(".job-company").textContent = job.company;
    clone.querySelector(".job-location").textContent = job.location;
    clone.querySelector(".job-salary").textContent = job.salary;
    clone.querySelector(".job-type").textContent = job.type;
    clone.querySelector(".job-description").textContent = job.description;
    clone.querySelector(".job-apply").addEventListener("click", () => {
      if (currentUser == null) {
        alert("please sign in to apply for jobs!");
      } else {
        selectedJobId = job.id;
        jobTitle = job.title;
        jobModal.style.display = "block";
      }
    });
    displayAllJobs.appendChild(clone);
  });
}

jobApplicationForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const db = getFirestore();
  const formData = new FormData(jobApplicationForm);

  const application = {
    jobID: selectedJobId,
    userID: currentUser.uid,
    candidateName: formData.get("name"),
    candidateEmail: formData.get("email"),
    candidateExperience: formData.get("experience"),
    candidateMessage: formData.get("message"),
    jobTitle: jobTitle,
  };

  try {
    await addDoc(collection(db, "job-applications"), application);
    jobModal.style.display = "none";
    selectedJobId = null;
  } catch (error) {
    console.log(error);
  }
});

function disablePrevAndNextButton(page) {
  if (page <= 1) {
    prevButton.disabled = true;
    prevButton.classList.add("disabledPrevButton");
  } else {
    prevButton.disabled = false;
    prevButton.classList.remove("disabledPrevButton");
  }

  if (page >= totalPages) {
    nextButton.classList.add("disabledNextButton");
  } else {
    nextButton.classList.remove("disabledNextButton");
  }
}

prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayJobs(jobList, currentUser, currentPage);
  }
});

nextButton.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    displayJobs(jobList, currentUser, currentPage);
  }
});

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

function jsWidthChanges() {
  const nav = document.getElementById("nav");
  const navWidth = displayAllJobs.offsetWidth;
  nav.style.width = `${navWidth}px`;
  document.getElementById("pagination-container").style.width = `${navWidth}px`;

  if (window.innerWidth >= 768) {
    footerWrapper.style.width = `${navWidth}px`;
  }
}

document.addEventListener("DOMContentLoaded", jsWidthChanges);
window.addEventListener("resize", jsWidthChanges);
