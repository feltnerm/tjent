const path = require('path')
const fs = require('fs')
const recast = require('recast')
const changeCase = require('change-case')
const mustache = require('mustache')
mustache.escape = (value) => value

const resolvePath = (filePath) => path.resolve(__dirname, filePath)
const TEMPLATES = {
  'class': resolvePath('./lib/templates/class.spec.template.js'),
  'function': resolvePath('./lib/templates/function.spec.template.js'),
  'react-component': resolvePath('./lib/templates/react-component.spec.template.jsx'),
  'react-pure-component': resolvePath('./lib/templates/react-pure-component.spec.template.jsx')

}

const TEMPLATE_RULES = {
  // is_class?
  true: {
    // isJsx?
    true: TEMPLATES['react-component'],
    false: TEMPLATES['class']
  },
  false: {
    // isJsx?
    true: TEMPLATES['react-pure-component'],
    false: TEMPLATES['function']
  }
}

const renderTemplate = (templatePath, { componentName, componentImportPath }) => {
  return readFile(templatePath).then((templateString) => {
    return mustache.render(templateString, {
      componentNameUpper: changeCase.pascalCase(componentName),
      componentNameLower: changeCase.camel(componentName),
      componentName,
      componentImportPath
    })
  })
}

/**
 * true iff `import React from 'react'` is in the file
 **/
const isJsx = (astBody) => {
  return astBody
    .filter(({type}) => type === 'ImportDeclaration')
    .filter((importStatement) => {
      return importStatement.specifiers.filter(({ type, local }) => {
        return type === 'ImportDefaultSpecifier' && local.type === 'Identifier' && local.name === 'React'
      }).length > 0
    }).length > 0
}

const parseAst = (ast) => {
  const body = ast.program.body

  // todo: handle named exports
  const exportDefault = body.filter((token) => token.type === 'ExportDefaultDeclaration')[0]
  const declarationType = exportDefault.declaration.type

  let isClass = declarationType === 'ClassDeclaration'
  const isIdentifier = declarationType === 'Identifier'
  const isAssignment = declarationType === 'AssignmentExpression'

  let componentName
  if (isIdentifier || isAssignment) {
    const componentNode = body.filter((token) => {
      return (token.type === 'ClassDeclaration' &&
              token.id &&
              token.id.type === 'Identifier' &&
              token.id.name === exportDefault.declaration.name) ||
        (isAssignment && token.declaration.left) ||
        (token.type === 'VariableDeclaration' &&
         token.declarations.length > 0 &&
         token.declarations[0].id.name === exportDefault.declaration.name)
    })[0]

    if (componentNode.type === 'ClassDeclaration') {
      componentName = componentNode.id.name
      isClass = true
    } else if (componentNode.type === 'VariableDeclaration') {
      componentName = componentNode.declarations[0].id.name
    } else if (isAssignment) {
      componentName = componentNode.declaration.left.name
    } else {
      componentName = exportDefault.declaration.name
    }
  } else if (isClass) {
    componentName = exportDefault.declaration.id.name
  }

  return {
    componentName,
    template: TEMPLATE_RULES[isClass][isJsx(body)]
  }
}

const createParser = () => {
  // const parser = require('acorn-jsx')
  const parser = require('babylon')
  const parserOptions = {
    sourceType: 'module',
    plugins: [
      'jsx',
      'classConstructorCall',
      'objectRestSpread',
      'classProperties'
    ]
  }
  return {
    parse: (code) => {
      return parser.parse(code, parserOptions)
    }
  }
}
const parseInput = (input) => {
  const recastOptions = {
    parser: createParser()
  }
  return recast.parse(input, recastOptions)
}

const readFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

module.exports = (options) => {
  const filePath = path.resolve(options.path)
  return readFile(filePath)
    .then(parseInput)
    .then(parseAst)
    .then((astData) => {
      const { template } = astData
      // attempt to infer component name via filename
      if (!astData.componentName) {
        let componentName = path.basename(filePath).split('.')[0]
        if (componentName.indexOf('index') !== -1) {
          componentName = path.basename(path.dirname(filePath))
        }
        astData.componentName = componentName
      }
      astData.componentImportPath = options.path
      return renderTemplate(template, astData)
    })
}
