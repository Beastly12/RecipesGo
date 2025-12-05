import React from 'react';
import CustomInput from './CustomInput';

describe('<CustomInput />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<CustomInput />);
  });
});
