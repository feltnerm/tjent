const test = require('tape')

const tjent = require('../index')

const FIXTURES = {
  'class-export-identifier': './tests/fixtures/class-export-identifier.js',
  'class-export': './tests/fixtures/class-export.js',
  'function-export-identifier': './tests/fixtures/function-export-identifier.js',
  'function-export-named': './tests/fixtures/function-export-named.js',
  'function-export': './tests/fixtures/function-export.js',
  'react-component-export-identifier': './tests/fixtures/react-component-export-identifier.jsx',
  'react-component-export': './tests/fixtures/react-component-export.jsx',
  'react-pure-component-export-idenfifier': './tests/fixtures/react-pure-component-export-identifier.jsx',
  'react-pure-component-export-named': './tests/fixtures/react-pure-component-export-named.jsx',
  'react-pure-component-export': './tests/fixtures/react-pure-component-export.jsx'
}

const VERBOSE = process.argv.length > 3 && process.argv[3].indexOf('--verbose') !== -1
const log = function () {
  if (VERBOSE) {
    console.log.apply(this, Array.prototype.slice.call(arguments))
  }
}

test('tjent', (t) => {
  t.plan(Object.keys(FIXTURES).length)
  Object.keys(FIXTURES).forEach((fixtureType) => {
    const fixture = FIXTURES[fixtureType]
    tjent({
      path: fixture
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
  })
})
