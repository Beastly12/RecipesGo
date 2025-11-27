describe('Recipe Management Flow', () => {
  let jwtToken;

  beforeEach(() => {
    cy.wait(1000);
    if (jwtToken) {
      window.localStorage.setItem('jwtToken', jwtToken);
    }
  });

  afterEach(() => {
    // Save JWT token after each test
    jwtToken = window.localStorage.getItem('jwtToken');
  });

  const publicRecipe = {
    name: 'Cypress Test Recipe 1',
    imageUrl: 'test.jpg',
    description: 'Test description',
    category: 'Dinner',
    ingredients: ['Salt'],
    instructions: ['Mix'],
    preparationTime: 5,
    isPublic: true,
    difficulty: 'Easy',
  };

  const privateRecipe = {
    name: 'Cypress Private Recipe',
    imageUrl: 'test.jpg',
    description: 'Private',
    category: 'Breakfast',
    ingredients: ['Egg'],
    instructions: ['Crack'],
    preparationTime: 3,
    isPublic: false,
    difficulty: 'Easy',
  };

  before(() => {
    // Create user once for all tests
    cy.signupAndLogin().then((result) => {
      jwtToken = result.token;
    });
  });

  after(() => {
    // Cleanup after all tests
    cy.cleanupAll();
    cy.deleteUserAuto();
  });

  it('creates a public recipe and adds it to favorites', () => {
    cy.createRecipeAuto(publicRecipe);
    cy.addFavoriteAuto();
  });

  it('rates the first recipe with 2 stars', () => {
    cy.rateRecipeAuto(2);

    cy.then(() => {
      const firstRecipeId = Cypress.env('testStore').recipeIds[0];
      cy.getRatings(firstRecipeId).then((res) => {
        expect(res.body.message).to.have.length(1);
      });
    });
  });

  it('creates a private recipe and adds it to favorites', () => {
    cy.createRecipeAuto(privateRecipe);
    cy.addFavoriteAuto();
  });

  it('rates the second recipe with 5 stars', () => {
    cy.rateRecipeAuto(5);

    cy.then(() => {
      const secondRecipeId = Cypress.env('testStore').recipeIds[1];
      cy.getRatings(secondRecipeId).then((res) => {
        expect(res.body.message).to.have.length(1);
      });
    });
  });

  it('verifies user has 2 recipes total', () => {
    cy.getMyRecipes().then((res) => {
      expect(res.body.message).to.have.length(2);
    });
  });

  it('verifies user has 1 public recipe', () => {
    cy.then(() => {
      const userId = Cypress.env('testStore').userId;
      cy.request({
        method: 'GET',
        url: `${Cypress.env('api')}/recipes?by=${userId}`,
      }).then((res) => {
        expect(res.body.message).to.have.length(1);
      });
    });
  });

  it('verifies user has 2 favorites', () => {
    cy.getFavorites().then((res) => {
      expect(res.body.message).to.have.length(2);
    });
  });

  it('verifies user overall rating is 3.5', () => {
    cy.getCurrentUser().then((res) => {
      expect(res.body.message.overallRating).to.equal(3.5);
    });
  });

  it('removes the last favorite', () => {
    cy.removeFavoriteAuto();
    cy.getFavorites().then((res) => {
      expect(res.body.message).to.have.length(1);
    });
  });

  it('removes the last rating', () => {
    cy.removeRatingAuto();

    cy.then(() => {
      const secondRecipeId = Cypress.env('testStore').recipeIds[1];
      cy.getRatings(secondRecipeId).then((res) => {
        expect(res.body.message).to.have.length(0);
      });
    });
  });

  it('updates the second recipe name and makes it public', () => {
    cy.editRecipeAuto({
      name: 'Updated Recipe Name',
      isPublic: true,
    });
  });

  it('searches for the updated recipe', () => {
    cy.searchRecipes('Updated re').then((res) => {
      expect(res.body.message).to.have.length.greaterThan(0);
    });
  });

  it('gets recipe details for the updated recipe', () => {
    cy.then(() => {
      const secondRecipeId = Cypress.env('testStore').recipeIds[1];
      cy.request({
        method: 'GET',
        url: `${Cypress.env('api')}/recipes/${secondRecipeId}`,
      }).then((res) => {
        expect(res.body.message.name).to.equal('Updated Recipe Name');
      });
    });
  });

  it('updates user location', () => {
    cy.updateUser({ location: 'Southampton, UK' });

    cy.getCurrentUser().then((res) => {
      expect(res.body.message.location).to.equal('Southampton, UK');
    });
  });

  it('gets all public recipes', () => {
    cy.getPublicRecipes().then((res) => {
      expect(res.status).to.equal(200);
    });
  });

  it('gets all recipes in Dinner category', () => {
    cy.getPublicRecipes('Dinner').then((res) => {
      expect(res.status).to.equal(200);
    });
  });

  it('gets upload URL for jpg file', () => {
    cy.getUploadUrl('.jpg').then((res) => {
      expect(res.status).to.equal(200);
    });
  });
});
