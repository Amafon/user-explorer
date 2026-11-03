const userForm = document.getElementById("user-form");
const userIdInput = document.getElementById("user-id");
const userResults = document.getElementById("user-results");
const postsResults = document.getElementById("posts-results");
const loadAllBtn = document.getElementById("load-all-btn");
const testErrorBtn = document.getElementById("test-error-btn");
const statusEl = document.getElementById("status");
const searchBtn = document.getElementById("search-btn");
const commentsResults = document.getElementById("comments-results");

// Fonction pour simuler une erreur
async function simulateError(url, id) {
  try {
    testErrorBtn.textContent = "Chargement en cours...";

    testErrorBtn.disabled = true;

    statusEl.textContent = "";

    const response = await fetch(`${url}${id}`);

    if (response.status === 404) {
      throw new Error(`L'utilisateur ${id} n'existe pas.`);
    }

    if (!response.ok) {
      throw new Error(
        `Erreur serveur ou d'accès. Response Status: ${response.status}`,
      );
    }

    const user = await response.json();

    return user;
  } catch (error) {
    if (error.message.includes("fetch") || error.name === "TypeError") {
      statusEl.textContent = `Impossible de joindre le serveur. Message d'erreur: ${error.message}`;
    } else {
      statusEl.textContent = error.message;
    }

    return null;
  } finally {
    testErrorBtn.textContent = "Tester une erreur";

    testErrorBtn.disabled = false;
  }
}

// Fonction pour charger cinq (05) utilisateurs
async function fetchUsers(arr) {
  // S'assurer que le tableau retourné n'est pas vide
  if (arr.length === 0) return;

  // Récupérer les données des cinq (05) utilisateurs
  const responses = (
    await Promise.allSettled(
      arr.map((id) =>
        fetch(`https://jsonplaceholder.typicode.com/users/${id}`),
      ),
    )
  ).filter((res) => res.status === "fulfilled" && res.value.status === 200);

  const users = (
    await Promise.allSettled(responses.map((res) => res.value.json()))
  )
    .filter((res) => res.status === "fulfilled")
    .map((res) => res.value);

  return users;
}

async function fetchUser(endpoint, id) {
  try {
    // Afficher "Chargement en cours" dans le texte du bouton
    searchBtn.textContent = "Chargement en cours";

    // Désactiver le bouton
    searchBtn.disabled = true;

    // Retirer les anciens messages d'erreur
    statusEl.textContent = "";

    // Réinitialiser le contenu des utilisateurs
    userResults.innerHTML = "<p>Aucun utilisateur chargé.</p>";

    // Réinitialiser le contenu des publications
    postsResults.innerHTML = "<p>Aucune publication.</p>";

    // Réinitialiser le contenu des commentaires
    commentsResults.innerHTML = "<p>Aucun commentaire</p>";

    const response = await fetch(endpoint + id);
    // console.log(response);
    if (response.status === 404) {
      throw new Error(
        `Le numéro d'utilisateur ${id} est inexistant dans la base`,
      );
    }

    if (!response.ok) {
      throw new Error(`Erreur serveur ou d'accès (Statut: ${response.status})`);
    }

    const user = await response.json();
    //
    return user;
  } catch (error) {
    // Vérifier s'il s'agit d'une erreur de connexion au serveur
    if (error.message.includes("fetch") || error.name === "TypeError") {
      statusEl.textContent =
        "Impossible de contacter le serveur. Vérifiez votre connexion internet ou l'adresse du lien.";
    } else {
      statusEl.textContent = error.message;
    }

    // Retourner null
    return null;
  } finally {
    // // Afficher "Rechercher" dans le texte du bouton
    // searchBtn.textContent = "Rechercher";
    // // Désactiver le bouton
    // searchBtn.disabled = false;
  }
}

async function fetchUserPosts(user) {
  try {
    // Nettoyer le contenu des posts
    postsResults.innerHTML = "<p>Aucune publication.</p>";

    // Si l'utilisateur n'existe pas, arrêter la fonction
    if (!user) return;

    //
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${user.id}/posts`,
    );

    if (response.status === 404) {
      throw new Error(`Aucuns posts pour l'utilisateur ${user.id}`);
    }

    if (!response.ok) {
      throw new Error(`Erreur serveur ou d'accès (Statut: ${response.status})`);
    }

    const posts = await response.json();

    return posts;
  } catch (error) {
    if (error.message.includes("fetch") || error.name === "TypeError") {
      statusEl.textContent =
        "Impossible de contacter le serveur. Vérifiez votre connexion internet ou l'adresse du lien.";
    } else {
      statusEl.textContent = error.message;
    }

    return null;
  }
}

async function fetchPost(postId) {
  try {
    // Si le post id n'existe pas, arrêter
    if (!postId) return;

    //
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
    );

    if (response.status === 404) {
      throw new Error(`Le numéro de poste ${postId} n'existe pas `);
    }

    if (!response.ok) {
      throw new Error(`Erreur serveur ou d'accès (Statut: ${response.status})`);
    }

    const post = await response.json();

    return post;
  } catch (error) {
    if (error.message.includes("fetch") || error.name === "TypeError") {
      statusEl.textContent =
        "Impossible de contacter le serveur. Vérifiez votre connexion internet ou l'adresse du lien.";
    } else {
      statusEl.textContent = error.message;
    }

    return null;
  }
}

async function fetchPostComments(post) {
  try {
    // Si le post id n'existe pas, arrêter
    if (!post) return;

    // Afficher "Chargement en cours" dans le texte du bouton
    document.querySelector(`button[data-post-id='${post.id}']`).textContent =
      "Chargement en cours";

    // Désactiver le bouton
    document.querySelector(`button[data-post-id='${post.id}']`).disabled = true;

    // Réinitialiser le contenu des commentaires
    commentsResults.innerHTML = "";

    //
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${post.id}/comments`,
    );

    if (response.status === 404) {
      throw new Error(`Le numéro de poste ${post.id} n'existe pas `);
    }

    if (!response.ok) {
      throw new Error(`Erreur serveur ou d'accès (Statut: ${response.status})`);
    }

    const comments = await response.json();

    return comments;
  } catch (error) {
    if (error.message.includes("fetch") || error.name === "TypeError") {
      statusEl.textContent =
        "Impossible de contacter le serveur. Vérifiez votre connexion internet ou l'adresse du lien.";
    } else {
      statusEl.textContent = error.message;
    }

    return null;
  } finally {
    // Afficher "Voir les commentaires" dans le texte du bouton
    document.querySelector(`button[data-post-id='${post.id}']`).textContent =
      "Voir les commentaires";

    // Désactiver le bouton
    document.querySelector(`button[data-post-id='${post.id}']`).disabled =
      false;
  }
}

// Fonction pour générer le HTML de l'utilisateur
function createUser(user) {
  // Si aucun utilisateur n'a été récupéré, arrêter la fonction
  if (!user) return;

  return `
    <p class="user-name">
      <i class="fa-solid fa-circle-user"></i><span>${user.name}</span>
    </p>
    <p class="user-email">
      <i class="fa-solid fa-envelope"></i><span>${user.email}</span>
    </p>
    <p class="user-phone">
      <i class="fa-solid fa-phone"></i><span>${user.phone}</span>
    </p>
  `;
}

// Fonction pour générer mettre à jour le DOM
function renderUser(user) {
  // Si aucun utilisateur n'a été récupéré, arrêter la fonction
  if (!user) return;

  userResults.innerHTML = createUser(user);
}

// Fonction pour générer le HTML des utilisateurs
function createUsers(users) {
  // Si aucun utilisateur n'a été récupéré, arrêter la fonction
  if (!users) return;

  return users
    .map((user) => {
      return `
        <div class="results-container">
          <p class="user-name">
            <i class="fa-solid fa-circle-user"></i><span>${user.name}</span>
          </p>
          <p class="user-email">
            <i class="fa-solid fa-envelope"></i><span>${user.email}</span>
          </p>
          <p class="user-phone">
            <i class="fa-solid fa-phone"></i><span>${user.phone}</span>
          </p>
        </div>
        `;
    })
    .join("");
}

// Fonction pour générer mettre à jour le DOM
function renderUsers(users) {
  // Si aucun utilisateur n'a été récupéré, arrêter la fonction
  if (!users) return;

  userResults.innerHTML = createUsers(users);
}

function createPosts(posts) {
  // Si aucun posts n'a été récupéré, arrêter la fonction
  if (!posts) return;

  return posts
    .slice(0, 3)
    .map((post) => {
      return `
                <div class="results-container">
                    <h3 class="post-title">Title: ${post.title}</h3>
                    <p class="post-title">Body: ${post.body}</p>
                    <button data-post-id="${post.id}">Voir les commentaires</button>
                </div>
              `;
    })
    .join("");
}

function renderPosts(posts) {
  if (!posts) return;
  postsResults.innerHTML = createPosts(posts);
}

function createComments(comments) {
  // Si aucun post n'a été récupéré, arrêter la fonction
  if (!comments) return;

  return comments
    .map((comment) => {
      return `
                <div class="results-container">
                    <h3 class="comment-name">Name: ${comment.name}</h3>
                    <p class="comment-email">Email: ${comment.email}</p>
                    <p class="comment-body">Comment: ${comment.body}</p>
                </div>
              `;
    })
    .join("");
}

function renderComments(comments) {
  if (!comments) return;

  commentsResults.innerHTML = createComments(comments);
}

postsResults.addEventListener("click", async function (e) {
  if (e.target.closest("button[data-post-id]")) {
    const btn = e.target.closest("button[data-post-id]");
    if (!btn) return;
    const postId = btn.dataset.postId;
    const post = await fetchPost(postId);
    const comments = await fetchPostComments(post);
    renderComments(comments);
  }
});

userForm.addEventListener("submit", async function (e) {
  // Prévenir le rechargement automatique de la page
  e.preventDefault();

  //Récupérer l'id renseigné par l'utilisateur
  const id = userIdInput.value.trim();

  try {
    // Récupérer les données de l'utilisateur
    const user = await fetchUser(
      `https://jsonplaceholder.typicode.com/users/`,
      id,
    );

    // Générer le HTML de l'utilisateur et mettre à jour le DOM
    // createUser(user);
    renderUser(user);

    const posts = await fetchUserPosts(user);

    // Générer le HTML des posts et mettre à jour le DOM
    renderPosts(posts);
  } catch (error) {
  } finally {
    searchBtn.disabled = false;
    searchBtn.textContent = "Rechercher";
  }
});

loadAllBtn.addEventListener("click", async function (e) {
  e.preventDefault();

  // Récupérer les utilisateurs
  const users = await fetchUsers([1, 2, 3, 4, 5, 80, 15]);

  // Charger les utilisateurs dans le conteneur
  renderUsers(users);
});

testErrorBtn.addEventListener("click", async function (e) {
  const user = simulateError(
    "https://jsonplaceholder.typicode.com/users/",
    999999,
  );
});

// userForm.addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const userId = userIdInput.value.trim();

//   userResults.innerHTML = `<p class="empty">Aucun utilisateur chargé.</p>`;

//   postsResults.innerHTML = `<p class="empty">Aucune publication.</p>`;

//   statusEl.textContent = "";

//   try {
//     //
//     searchBtn.disabled = true;

//     searchBtn.textContent = "Chargement en cours...";

//     const response = await fetch(
//       `https://jsonplaceholder.typicode.com/users/${userId}`,
//     );

//     if (response.status === 404) {
//       //
//       throw new Error(`L'utilisateur avec l'ID ${userId} n'existe pas.`);
//     }

//     if (!response.ok) {
//       //
//       throw new Error(`Erreur serveur ou d'accès (Statut: ${response.status})`);
//     }

//     const user = await response.json();

//     const userResultsHTML = `
//               <p class="user-name">
//                 <i class="fa-solid fa-circle-user"></i><span>${user.name}</span>
//               </p>
//               <p class="user-email">
//                 <i class="fa-solid fa-envelope"></i><span>${user.email}</span>
//               </p>
//               <p class="user-phone">
//                 <i class="fa-solid fa-phone"></i><span>${user.phone}</span>
//               </p>
//           `;

//     userResults.innerHTML = userResultsHTML;
//   } catch (error) {
//     //
//     if (error.message.includes("fetch") || error.name === "TypeError") {
//       // Cas où internet est coupé ou que le nom de domaine de l'URL est totalement faux
//       statusEl.textContent =
//         "Impossible de contacter le serveur. Vérifiez votre connexion internet ou l'adresse du lien.";
//     } else {
//       // Cas de vos erreurs personnalisées lancées manuellement dans le try (404 ou !response.ok)
//       statusEl.textContent = error.message;
//     }
//   } finally {
//     //
//     searchBtn.textContent = "Rechercher";

//     searchBtn.disabled = false;
//   }
// });

// loadAllBtn.addEventListener("click", async function (e) {
//   const urls = [
//     "https://jsonplaceholder.typicode.com/users/1",
//     "https://jsonplaceholder.typicode.com/users/2",
//     "https://jsonplaceholder.typicode.com/users/9999",
//     "https://domaine-inexistant.invalid/users/3",
//     "https://jsonplaceholder.typicode.com/users/4",
//     "https://jsonplaceholder.typicode.com/users/5",
//   ];

//   const responses = (
//     await Promise.allSettled(urls.map((url) => fetch(url)))
//   ).filter((res) => res.status === "fulfilled" && res.value.ok === true);

//   const users = await Promise.all(responses.map((user) => user.value.json()));

//   const usersResultsHTML = users
//     .map((user) => {
//       return `
//             <div class="users-container">
//               <p class="user-name">
//                   <i class="fa-solid fa-circle-user"></i><span>${user.name}</span>
//               </p>
//               <p class="user-email">
//                   <i class="fa-solid fa-envelope"></i><span>${user.email}</span>
//               </p>
//               <p class="user-phone">
//                   <i class="fa-solid fa-phone"></i><span>${user.phone}</span>
//               </p>
//             </div>
//         `;
//     })
//     .join("");
//   userResults.innerHTML = usersResultsHTML;
// });

// testErrorBtn.addEventListener("click", async function (e) {
//   try {
//     // const response = await fetch(
//     //   `https://jsonplaceholder.typicode.com/users/999999`,
//     // );

//     const response = await fetch(`https://domaine-inexistant.invalid/users/1`);
//     if (!response.ok && response.status === 404) {
//       throw new Error("Erreur Réseau: Utilisateur Introuvable");
//     }
//   } catch (error) {
//     statusEl.textContent = error.message;
//   }
// });

// async function experience() {
//   const promise1 = Promise.resolve("Utilisateur 1");
//   const promise2 = Promise.reject(new Error("Erreur utilisateur 2"));
//   const promise3 = Promise.resolve("Utilisateur 3");

//   const results = await Promise.allSettled([promise1, promise2, promise3]);

//   console.log(results);

//   const validResults = results
//     .filter((res) => res.status === "fulfilled")
//     .map((res) => res.value);

//   console.log(validResults);
// }

// experience();

// userForm.addEventListener("submit", async function (e) {
//   e.preventDefault();

//   const userId = userIdInput.value.trim();

//   const response1 = await fetch(
//     `https://jsonplaceholder.typicode.com/users/${userId}`,
//   );

//   const user = await response1.json();

//   const userResultsHTML = `
//           <p class="user-name">
//             <i class="fa-solid fa-circle-user"></i><span>${user.name}</span>
//           </p>
//           <p class="user-email">
//             <i class="fa-solid fa-envelope"></i><span>${user.email}</span>
//           </p>
//           <p class="user-phone">
//             <i class="fa-solid fa-phone"></i><span>${user.phone}</span>
//           </p>
//       `;

//   userResults.innerHTML = userResultsHTML;

//   const response2 = await fetch(
//     `https://jsonplaceholder.typicode.com/posts?userId=${user.id}`,
//   );

//   const posts = await response2.json();

//   const postsHTML = posts
//     .slice(0, 3)
//     .map((post) => {
//       return `
//                       <div class="results-container">
//                           <h3 class="post-title">Title: ${post.title}</h3>
//                           <p class="post-title">Body: ${post.body}</p>
//                           <button data-post="${post.id}">Voir les commentaires</button>
//                       </div>
//                   `;
//     })
//     .join("");

//   postsResults.innerHTML = postsHTML;
// });

// const urls = [
//   "https://jsonplaceholder.typicode.com/users/1",
//   "https://jsonplaceholder.typicode.com/users/2",
//   "https://jsonplaceholder.typicode.com/users/9999",
//   "https://domaine-inexistant.invalid/users/3",
//   "https://jsonplaceholder.typicode.com/users/4",
//   "https://jsonplaceholder.typicode.com/users/5",
// ];

// async function fetchValidData(arr) {
//   const tempResponse = await Promise.allSettled(arr.map((url) => fetch(url)));
//   //
//   const fulfilledResponses = tempResponse.filter(
//     (res) => res.status === "fulfilled",
//   );
//   //
//   const responses = fulfilledResponses.filter((res) => res.value.ok);

//   const data = (
//     await Promise.allSettled(responses.map((res) => res.value.json()))
//   )
//     .filter((res) => res.status === "fulfilled")
//     .map((res) => res.value);
//   //
//   return data;
// }

// (async () => {
//   const users = await fetchValidData(urls);
//   console.log(users);
// })();
