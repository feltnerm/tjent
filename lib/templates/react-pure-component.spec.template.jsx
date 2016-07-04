import React from 'react'
import ReactDOM from 'react-dom'
import TestUtils from 'react-addons-test-utils'
import utils from 'tests/utils'

import {{componentNameUpper}} from '{{componentImportPath}}'

const renderComponent = (props = {}) => {
  const Wrapped{{componentNameUpper}} = utils.wrapStatelessComponent({{componentNameUpper}})
  return TestUtils.renderIntoDocument(
    <Wrapped{{componentNameUpper}} {...props} />
  )
}

describe('<{{componentNameUpper}} />', () => {
  it('renders', () => {
    const props = {}
    const {{componentNameLower}} = renderComponent(props)
    const {{componentNameLower}}El = ReactDOM.findDOMNode({{componentNameLower}})

    expect({{componentNameLower}}El).toBeTruthy()
    expect('Test to have been written').toEqual(true)
  })
})
