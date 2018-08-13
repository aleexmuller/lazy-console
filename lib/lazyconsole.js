const fileSystem = require('fs');
const { execSync } = require('child_process');

const FILE_NOT_FOUND = 'ENOENT';
const EMPTY_FILE = 'EMPTY_FILE';
const ALIAS_NOT_FOUND = 'ALIAS_NOT_FOUND';

const fileConfig = { name: 'lazy.json', encode: 'utf8' };

/*
 * Valida o conteúdo do arquivo de configuração
 */
const _validateFileContent = (fileContent, alias) => {
  if (!fileContent[alias]) {
    const error = new Error(`a cadeia de comandos '${alias}' não foi encontrada`);
    error.type = ALIAS_NOT_FOUND;
    throw error;
  } else if (!Array.isArray(fileContent[alias])) {
    const error = new Error(`o conteúdo da cadeia de comandos '${alias}' deve ser um array`);
    error.type = ALIAS_NOT_FOUND;
    throw error;
  } else {
    return fileContent[alias];
  }
}

/*
 * Injeta os argumentos no linha de comando
 */
const _injectArgsOnCommand = (commandLine, args) => {
  if (commandLine && args) {
    args.forEach((arg, index) => {
      const regx = new RegExp(`\\[${index + 1}\\]`, 'g');
      commandLine = commandLine.replace(regx, arg);
    });
  }
  return commandLine;
}

/*
 * Recupera o conteúdo do arquivo de configuração parseado em json
 */
const _getFileContent = () => {
  return new Promise((resolve, reject) => {
    fileSystem.readFile(fileConfig.name, fileConfig.encode, (err, data) => {
      if (err) {
        if (err.code === FILE_NOT_FOUND) {
          const error = new Error(`'${fileConfig.name}' não foi encontrado no diretório corrente`);
          error.type = FILE_NOT_FOUND;
          return reject(error);
        }
        return reject(err);
      } else if (!data) {
        const error = new Error(`${fileConfig.name} não possui nenhum conteúdo`);
        error.type = EMPTY_FILE;
        return reject(error);
      } else {
        return resolve(JSON.parse(data));
      }
    });
  });
}

/*
 * Cria um processo para uma linha de comando setando opções para a saída continua dos resultados no terminal
 */
const _createProcess = (commandLine) => {
  return new Promise(async (resolve, reject) => {
    const options = {
      stdio: [
        process.stdin,
        process.stdout,
        process.stderr
      ]
    };

    resolve(await execSync(commandLine, options, (error) => {
      if (error) reject(error);
    }));
  });
}

/*
 * Executa a cadeia de comandos baseado no alias específicado setando os argumentos passados no terminal 
 */
const _execute = async (alias, args) => {
  try {
    const fileContent = await _getFileContent();
    const fileContentValidated = _validateFileContent(fileContent, alias);

    fileContentValidated.forEach(async (commandLine) => {
      await _createProcess(_injectArgsOnCommand(commandLine, args));
    });
  } catch (error) {
    if (error.type === FILE_NOT_FOUND
      || error.type === EMPTY_FILE
      || error.type === ALIAS_NOT_FOUND) {
      console.error(error.message);
    } else {
      throw error;
    }
  }
}

/*
 * Exporta os métodos privados
 */
module.exports = ({ execute: _execute });
