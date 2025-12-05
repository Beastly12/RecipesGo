import React from 'react';
import Profile from './ProfilePage';

describe('<Profile />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<Profile />);
  });
});
