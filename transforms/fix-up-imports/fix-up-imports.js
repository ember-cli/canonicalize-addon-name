module.exports = function transformer(file, api, options) {
  const j = api.jscodeshift;
  const { oldName, newName } = options;
  let parsed = j(file.source)

  parsed.find(j.ImportDeclaration).forEach(rewriteSource);
  parsed.find(j.ExportNamedDeclaration).forEach(rewriteSource);

  function rewriteSource(path) {
    let source = path.node.source.value;
    if (source.indexOf(oldName) === 0) {
      let newSource = source.replace(oldName, newName);
      path.get('source').replace(j.stringLiteral(newSource));
    }
  }

  return parsed.toSource({ quote: 'single' });
}