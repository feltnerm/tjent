import {{componentNameUpper}} from {{componentImportPath}}

describe('{{componentNameUpper}}', () => {
  it('does stuff', () => {
    const {{componentNameLower}} = new {{componentNameUpper}}()
    expect({{componentNameLower}}).toBeTruthy()
    expect('Test to have been written').toEqual(true)
  })
})
