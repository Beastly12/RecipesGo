import React from 'react';
import RecipeFeed from './RecipesFeed';

describe('<RecipeFeed />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RecipeFeed />);
  });
});
