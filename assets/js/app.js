const cl = console.log;

let BASE_URL = "https://api.github.com/users";

const userForm = document.getElementById('userForm');
const userNameControl = document.getElementById('userName');
const profileContainer = document.getElementById('profileContainer');

const makeApiCall = async (method_name, api_url, body = null) => {
  let res = await fetch(api_url, { method: method_name });
  return await res.json();
};

const onUserSearch = async (eve) => {
  eve.preventDefault();

  let username = userNameControl.value.trim();
  if (!username) return;

  let USERNAME_URL = `${BASE_URL}/${username}`;
  let USER_REPOS_URL = `${USERNAME_URL}/repos?sort=created&per_page=5`;

  try {
    let [userDetails, userRepos] = await Promise.all([
      makeApiCall("GET", USERNAME_URL),
      makeApiCall("GET", USER_REPOS_URL),
    ]);

    if (userDetails.message === "Not Found") {
      profileContainer.innerHTML = `<p style="color:red;">User not found</p>`;
      return;
    }

    renderProfile(userDetails, userRepos);
  } catch (err) {
    profileContainer.innerHTML = `<p style="color:red;">Error loading profile</p>`;
  }
};

const renderProfile = (user, repos) => {
  profileContainer.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" alt="${user.login}">
      <h2>${user.name || user.login}</h2>
      <div class="stats">
        <span>${user.followers} Followers</span>
        <span>${user.following} Following</span>
        <span>${user.public_repos} Repos</span>
      </div>
      <div class="repos">
        ${repos.map(repo => `<a class="repo" href="${repo.html_url}" target="_blank">${repo.name}</a>`).join('')}
      </div>
    </div>
  `;
};

userForm.addEventListener('submit', onUserSearch);
