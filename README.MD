Lazy Console
=====================

Lazy Console ajuda você a executar uma `cadeia de comandos` de terminal de forma automática, para quando você está trabalhando em projetos que necessitam executar repetidamente uma série de comandos no console, de forma sequencial e em períodos curtos de tempo. Por exemplo, se você estiver trabalhando em um projeto rodando dentro de um container `docker` no seu ambiente de desenvolvimento, onde é necessário re-construir a imagem com o comando `docker image build -t nome-da-imagem .` e depois rodar o container com `docker container run --rm nome-da-imagem` a cada modificação, você pode usar este pacote para executar esses comandos do `docker` com apenas um simples comando no terminal.

Iniciando
------------

Para usar o `Lazy Console` você precisa instalá-lo globalmente utilizando o comando `npm install -g lazy-console` no seu terminal. Depois é necessário criar um arquivo com a extensão `.json` no qual as `cadeias de comando` serão especificadas. Este arquivo deve ter o nome `lazy` e tem que ser colocado na raiz do projeto onde você deseja executar os comandos. 

O conteúdo deste arquivo deve ser um objeto onde a chave de cada item representa o alias de uma `cadeia de comandos`, que será usado como referência para executar cada cadeia. Já o valor de cada item deve ser um `array` no qual deve conter a lista de comandos a serem executados sequêncialmente. 

#### Exemplo: ####

Configuração do arquivo `lazy.json`

```javascript
{
   "alias-da-cadeia": [
      "primeiro comando da cadeia que será executado", 
      "segundo comando da cadeia que será executado",
      "terceiro comando da cadeia que será executado",
   ],
   "alias-de-outra-cadeia": [
      "primeiro comando da cadeia que será executado", 
      "segundo comando da cadeia que será executado",
      ...
   ],
   ...
}
``` 

Utilizando
------------

Para executar uma `cadeia de comandos` abra o terminal e siga para o caminho do projeto onde você criou o arquivo de configuração e então digite o comando `lazzy run` junto com o nome do alias da cadeia especificada no arquivo `lazy.json`. Por exemplo, se você epecificou que o alias da `cadeia de comandos` é `docker` você deve utilizar o comando `lazy run docker` para executar a série de comandos do item `docker`.

#### Exemplo: ####

Configuração do arquivo `lazy.json`

```javascript
{
   "docker": ...
}
``` 

Comando que deve ser executado no terminal

> lazy run `docker`

Argumentos
------------

Eventualmente você pode querer passar argumentos no comando `lazy run` e recuperá-los no arquivo de configuração para usar dentro da `cadeia de comandos`. Para isso você deve colocar os argumentos separados por espaço logo após o comando `Lazy` e no arquivo de configuração colocar entre `colchetes` o número da ordem do argumento exatamente no lugar em que deseja que ele seja usado. 

#### Exemplo: ####

Configuração do arquivo `lazy.json`

```javascript
{
   "alias-da-cadeia": [
      "primeiro comando com argumento [1] [2] [3]", 
      "segundo comando com argumento [3]",
      "segundo comando com argumento [1]",
   ]
}
``` 

Comando que deve ser executado no terminal

> lazy run alias-da-cadeia `primeiro-argumento` `segundo-argumento` `terceiro-argumento`




