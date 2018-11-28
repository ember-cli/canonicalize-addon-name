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
            let callExpression = t.expressionStatement(
              t.callExpression(
                t.memberExpression(t.identifier('define'), t.identifier('alias')),
                [t.stringLiteral(oldModuleName), t.stringLiteral(newModuleName)]
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
