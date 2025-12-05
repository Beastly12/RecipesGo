import React from 'react';
import DashBoardCard from './DashBoardCard';

describe('<DashBoardCard />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<DashBoardCard />);
  });
});
