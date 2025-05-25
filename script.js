const search = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const searchItem = document.getElementById("search-item");
let jobList = [];
const branding = document.getElementById("branding");
const middleContainer = document.getElementById("middle-container");
const bottomContainer = document.getElementById("bottom-container");
const displayResult = document.getElementById("display-result");
const noJobFound = document.getElementById("no-job-found");
const jobTemplate = document.getElementById("job-template");

fetch("jobs.json")
  .then((res) => res.json())
  .then((data) => {
    jobList = data;
  })
  .catch((err) => {
    console.error(err);
  });

// Search autocomplete
search.addEventListener("input", () => {
  const searchVal = search.value.toLowerCase();
  searchItem.innerHTML = "";

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

      li.addEventListener("click", () => {
        search.value = job.title;
        searchItem.style.display = "none";
      });
    }
    existingTitle.add(job.title);
  });
});

// display job results
searchButton.addEventListener("click", () => {
  const searchInput = search.value.toLowerCase();
  branding.style.display = "none";
  middleContainer.style.display = "none";
  bottomContainer.style.display = "none";

  if (searchInput == "") {
    noJobFound.innerHTML = "no jobs found";
    return;
  }
  noJobFound.style.display = "none";

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
    displayResult.appendChild(clone);
  });
});
