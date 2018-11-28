const DEV = process.env.EMBER_ENV === 'development';

exports.createDeprecatedAliases = function createDeprecatedAliases({ oldName, newName }) {
  function DeprecatedAliases({ types: t }) {
    let newModuleName;
    return {
      name: 'create-deprecated-aliases',
      visitor: {
        Program: {
          enter(path) {
            path.node.body.forEach(statement => {
              if (t.isCallExpression(statement.expression) && isDefine(statement.expression.callee)) {
                let id = statement.expression.arguments[0];
                if (t.isStringLiteral(id)) {
                  newModuleName = id.value;
                }
              }
            });
          },
          exit(path) {
            let oldModuleName = newModuleName.replace(newName, oldName);
            let arg = path.scope.generateUidIdentifier(newModuleName);
            let fnBody = [t.returnStatement(arg)];

            if (DEV) {
              fnBody.unshift(
                t.expressionStatement(
                  t.callExpression(
                    t.memberExpression(t.identifier('console'), t.identifier('warn')),
                    [t.stringLiteral(`Importing from "${oldModuleName}" is deprecated. Please update the import to "${newModuleName}".`)]
                  )
                )
              );
            }

            let callExpression = t.expressionStatement(
              t.callExpression(
                t.identifier('define'),
                [
                  t.stringLiteral(oldModuleName),
                  t.arrayExpression([t.stringLiteral(newModuleName)]),
                  t.functionExpression(null, [arg], t.blockStatement(fnBody))
                ]
              )
            );
            path.pushContainer('body', callExpression);
          }
        }
      }
    };
  }

  DeprecatedAliases.baseDir = () => __dirname;
  return DeprecatedAliases;
}

function isDefine(callee) {
  return callee.name === 'define' || callee.name === 'enifed';
}
