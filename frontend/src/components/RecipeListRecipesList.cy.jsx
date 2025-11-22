import React from 'react'
import RecipesList from './RecipeList'

describe('<RecipesList />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<RecipesList />)
  })
})