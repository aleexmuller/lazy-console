/*
 * Recupera o conteúdo do arquivo de configuração parseado em json
 */
const _getFileContents = (dep) => {
  return new Promise((resolve, reject) => {
    dep.fileSystem.readFile('lazy.json', 'utf8', (error, data) => {
      if (error) {
        if (error.code === 'ENOENT') {
          reject(new Error('O arquivo de configuração (lazy.json) não foi encontrado!'));
        }
        reject(error);
      }
      resolve(JSON.parse(data));
    });
  });
}

/*
 * Cria um processo para uma linha de comando setando opções para a saída continua dos resultados no terminal
 */
const _createProcess = (commandLine, dep) => {
  return new Promise(async (resolve, reject) => {
    const options = {
      stdio: [
        process.stdin,
        process.stdout,
        process.stderr
      ]
    };

    const output = await dep.process.execSync(commandLine, options, (error) => {
      if (error) reject(error);
    });

    resolve(output);
  });
}

/*
 * Executa a cadeia de comandos baseado no alias específicado setando os argumentos passados no terminal 
 */
const _execute = async (alias, args, dep) => {
  const fileContents = await _getFileContents(dep);

  fileContents[alias].forEach(async (commandLine) => {
    if (commandLine && args) {
      args.forEach((arg, index) => {
        const regx = new RegExp(`\\[${index + 1}\\]`, 'g');
        commandLine = commandLine.replace(regx, arg);
      });
    }

    await _createProcess(commandLine, dep);
  });
}

/*
 * Retorna os métodos privados
 */
module.exports.getController = (dep) => ({
  execute: (alias, args) => _execute(alias, args, dep)
});
