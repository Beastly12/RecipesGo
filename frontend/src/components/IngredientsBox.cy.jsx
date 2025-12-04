import React from 'react'
import IngredientsBox from './IngredientsBox'

describe('<IngredientsBox />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<IngredientsBox />)
  })
})