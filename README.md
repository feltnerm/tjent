# tjent
Minimize time writing Javascript test boilerplate.

Features:
- [x] Generate Jasmine test boilerplate
  - [x] Class export w/ identifier
  - [x] Class export
  - [x] Function export w/ identifier 
  - [x] Named function export
  - [x] Function export
  - [x] React/JSX component export w/ identifier
  - [x] Named React/JSX component export w/ identifier
  - [x] React/JSX component export
  - [x] React/JSX pure component export w/ identifier
  - [x] Named React/JSX pure component export
  - [x] React/JSX pure component export
- [ ] Generate other test frameworks (tape)
  
# install

`$ npm install -g tjent`

# usage

## cli

```
$ tjent tests/fixtures/class-export-identifier.js
import Klass from tests/fixtures/class-export-identifier.js

describe('Klass', () => {
  it('does stuff', () => {
    const klass = new Klass()
    expect(klass).toBeTruthy()
    expect('Test to have been written').toEqual(true)
  })
})
```

## api

```
const path = 'path/to/file'
tjent({
  path
}).then((output) => {
  log(`### start - ${fixtureType} ########################################`)
  log(output)
  t.ok(fixture, `Successfully parsed ${fixtureType} @ ${fixture}`)
  log(`### end - ${fixtureType} ########################################`)
  log('')
}).catch((err) => {
  console.error(err)
  t.fail('', '', err)
  process.exit(1)
})
```
