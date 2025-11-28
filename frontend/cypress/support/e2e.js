import { Auth, Amplify } from "aws-amplify";
import { signIn, signUp, fetchAuthSession } from "aws-amplify/auth"


const testId = "eu-west-2_DdxTYM9AJ"
const testClientId = "7k6so1r7f6s77ku7kvuk8prvjc"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: testId,
      userPoolClientId: testClientId,
      loginWith: {
        username: true,
        email: true,
      },
    }
  }
})

const authHeaders = () => ({
  Authorization: `Bearer ${window.localStorage.getItem("jwtToken")}`
});
/* eslint-disable no-undef */

// Stores IDs for the current test session
Cypress.env('testStore', {
  recipeIds: [],
  ratingIds: [],
  favoriteIds: [],
  userId: null
});

// auth
Cypress.Commands.add("signup", (email, password, name = "Cypress User") => {
  return signUp({
    username: email,
    password: password,
    options: {
      userAttributes: {
        name: name
      }
    }
  })
});

Cypress.Commands.add("login", (email, password) => {
  return signIn({
    username: email,
    password: password,
  }).then(() => {
    return fetchAuthSession().then((session) => {
      const token = session.tokens?.accessToken?.toString();
      window.localStorage.setItem("jwtToken", token);
      return token;
    });
  });
});

Cypress.Commands.add("signupAndLogin", () => {
  const email = `test_user_${Date.now()}@example.com`;
  const password = "TestPassword123!";

  return cy.signup(email, password).then(() => {
    return cy.login(email, password).then((token) => {
      return {
        token,
        email,
        password
      };
    });
  });
});

// recipes
Cypress.Commands.add("searchRecipes", (text) => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}/search?recipe=${text}`
  });
});

Cypress.Commands.add("getRecipeAuto", () => {
  const recipeId = Cypress.env('testStore').recipeIds.slice(-1)[0];

  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}/recipes/${recipeId}`,
    headers: authHeaders(),
  });
});

Cypress.Commands.add("getPublicRecipes", (category = "") => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}/recipes?category=${category ? category : ""}`
  });
});

Cypress.Commands.add("getMyRecipes", () => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}/recipes/me`,
    headers: authHeaders()
  });
});

Cypress.Commands.add("createRecipeAuto", (recipe) => {
  return cy.request({
    method: "POST",
    url: `${Cypress.env("api")}/recipes`,
    headers: authHeaders(),
    body: recipe
  }).then(res => {
    Cypress.env('testStore').recipeIds.push(res.body.message.id);
    return res;
  });
});

Cypress.Commands.add("editRecipeAuto", (updates) => {
  const recipeId = Cypress.env('testStore').recipeIds.slice(-1)[0];

  return cy.request({
    method: "PUT",
    url: `${Cypress.env("api")}/recipes/${recipeId}`,
    headers: authHeaders(),
    body: updates
  });
});

Cypress.Commands.add("deleteRecipeAuto", () => {
  const recipeId = Cypress.env('testStore').recipeIds.pop();

  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("api")}/recipes/${recipeId}`,
    headers: authHeaders(),
  });
});

// favorites
Cypress.Commands.add("addFavoriteAuto", () => {
  const recipeId = Cypress.env('testStore').recipeIds.slice(-1)[0];
  
  return cy.request({
    method: "POST",
    url: `${Cypress.env("api")}/favorites`,
    headers: authHeaders(),
    body: { recipeId }
  }).then(res => {
    Cypress.env('testStore').favoriteIds.push(recipeId);
    return res;
  });
});

Cypress.Commands.add("removeFavoriteAuto", () => {
  const recipeId = Cypress.env('testStore').favoriteIds.pop();

  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("api")}/favorites/${recipeId}`,
    headers: authHeaders(),
  });
});

Cypress.Commands.add("getFavorites", () => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}/favorites`,
    headers: authHeaders()
  });
});


// ratings
Cypress.Commands.add("rateRecipeAuto", (stars, comment = "") => {
  const recipeId = Cypress.env('testStore').recipeIds.slice(-1)[0];

  return cy.request({
    method: "POST",
    url: `${Cypress.env("api")}/ratings`,
    headers: authHeaders(),
    body: { recipeId, stars, comment }
  }).then(res => {
    Cypress.env('testStore').ratingIds.push(recipeId);
    return res;
  });
});

Cypress.Commands.add("removeRatingAuto", () => {
  const recipeId = Cypress.env('testStore').ratingIds.pop();

  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("api")}/ratings/${recipeId}`,
    headers: authHeaders(),
  });
});

Cypress.Commands.add("getRatings", (recipeId) => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}/ratings/${recipeId}`
  });
});


// user
Cypress.Commands.add("getCurrentUser", () => {
  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}/users`,
    headers: authHeaders()
  });
});

Cypress.Commands.add("updateUser", (updates) => {
  return cy.request({
    method: "PUT",
    url: `${Cypress.env("api")}/users`,
    headers: authHeaders(),
    body: updates
  });
});

Cypress.Commands.overwrite("login", (originalFn, email, password) => {
  // Use cy.wrap to convert your original Promise-based login into a Cypress chain
  return cy.wrap(
    originalFn(email, password)
  ).then((token) => {
    const jwt = window.localStorage.getItem("jwtToken");

    // Now safely run cy.request() inside the Cypress chain
    return cy
      .request({
        method: "GET",
        url: `${Cypress.env("api")}/users`,
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        Cypress.env('testStore').userId = res.body.message.userid;
        return token; // keep original behavior
      });
  });
});

Cypress.Commands.add("deleteUserAuto", () => {
  return cy.request({
    method: "DELETE",
    url: `${Cypress.env("api")}/users`,
    headers: authHeaders()
  });
});

// media
Cypress.Commands.add("getUploadUrl", (ext, id = "") => {
  const query = id
    ? `/upload-url?id=${id}&ext=${ext}`
    : `/upload-url?ext=${ext}`;

  return cy.request({
    method: "GET",
    url: `${Cypress.env("api")}${query}`,
    headers: authHeaders()
  });
});

// cleanup
Cypress.Commands.add("cleanupAll", () => {
  const { recipeIds, ratingIds, favoriteIds } = Cypress.env('testStore');

  // remove ratings
  ratingIds.forEach(id => {
    cy.wait(1000);
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("api")}/ratings/${id}`,
      headers: authHeaders()
    });
  });

  // remove favorites
  favoriteIds.forEach(id => {
    cy.wait(1000);
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("api")}/favorites/${id}`,
      headers: authHeaders()
    });
  });

  // remove recipes
  recipeIds.forEach(id => {
    cy.wait(1000);
    cy.request({
      method: "DELETE",
      url: `${Cypress.env("api")}/recipes/${id}`,
      headers: authHeaders()
    });
  });
});

