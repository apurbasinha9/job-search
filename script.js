const search = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const searchItem = document.getElementById("search-item");
const searchContainer = document.getElementById("search-container");
let jobList = [];
const branding = document.getElementById("branding");
const middleContainer = document.getElementById("middle-container");
const bottomContainer = document.getElementById("bottom-container");
const displayResult = document.getElementById("display-result");
const noJobFound = document.getElementById("no-job-found");
const jobTemplate = document.getElementById("job-template");
const jobModal = document.getElementById("myModal");
const mainBar = document.getElementById("main-content");
const displayAllJobs = document.getElementById("display-all-jobs");

fetch("jobs.json")
  .then((res) => res.json())
  .then((data) => {
    jobList = data;
    displayJobs(jobList);
  })
  .catch((err) => {
    console.error(err);
  });

//display all jobs
function displayJobs(jobs) {
  jobs.forEach((job) => {
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
    document.getElementById("display-all-jobs").appendChild(clone);
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
  searchItem.style.display = "none";
  const searchInput = search.value.toLowerCase();

  if (searchInput == "") {
    noJobFound.innerHTML = "no jobs found";
    return;
  }
  noJobFound.style.display = "none";

  const results = jobList.filter((job) => {
    return job.title.toLowerCase().includes(searchInput.toLowerCase());
  });
  console.log(searchInput);

  const searchedJobs = document.getElementById("searched-jobs");
  searchedJobs.innerHTML = "";
  const p = document.createElement("p");
  p.innerText = "Job searched: " + searchInput;
  searchedJobs.appendChild(p);
  searchedJobs.style.display = "block";

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
    displayResult.appendChild(clone);
  });
});

const modalClose = document.getElementById("modal-close");
modalClose.addEventListener("click", () => {
  jobModal.style.display = "none";
});

document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("nav");

  const navWidth = displayAllJobs.offsetWidth;
  nav.style.width = `${navWidth}px`;
});
