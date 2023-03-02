const fspromise = require('fs/promises');
    path = require('path'),
    { exec } = require('child_process'),
    process = require("process"),
    plato = require('plato'),
    currentPath = path.dirname(__filename);

const complex = ({ source, name, options = {} }) => {
    const controller = new AbortController(),
        { signal } = controller,
        data = source,
        filePath = `${currentPath}/tmp/${name}.js`;
    return fspromise.writeFile(filePath, data, { signal }).then(() => 
        new Promise(resolve => 
            plato.inspect(
                filePath,
                filePath.replace(`${name}.js`, ''),
                options,
                report => resolve(report[0]))
        )
    ).finally(() => {
        fspromise.unlink(filePath)
    });
};

module.exports = complex