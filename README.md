# tabelião node

[![Build Status][ci-image]][ci-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Dependencies][dependencies-image]][dependencies-url]
[![Dev dependencies][dependencies-dev-image]][dependencies-dev-url]

Biblioteca do [tabelião][tabeliao] para nodejs.

# Pré-requisitos

É necessário ter um `package.json` válido e com as chaves `name` e `version`.
Sua aplicação não pode ter uma rota `/healthcheck`. Ela é criada automaticamente pelo tabelião.

# Funcionamento

No bootstrap da aplicação o tabelião procurará o `package.json` mais próximo da pasta em que o processo está rodando para utilizar as informações para o SD no endereço default do Consul.

O tabelião criará uma rota `/healthcheck` e irá fazer um `GET` nela uma vez por minuto para verificar se o serviço está disponível.

NOTA: a rota só será criada se a `app` do express for passada no `options`.

# Uso

## tabeliao.register(options, callback(err))

Essa função serve para registrar um serivço no Service Discovery.

### Parâmetros

#### options.ssl (_Boolean_ default `false`)

Se o seu serviço roda em `https`, deve ser `true`.

#### options.host (_String_ default `localhost`)

Host que sua aplicação roda.

#### options.port (_String_ default `3000`)

Porta que sua aplicação roda.

#### options.app (_Object_ default `null`)

Aplicação Express da sua aplicação.

## Por que passar minha aplicação do Express?

Automaticamente uma rota `/healthcheck` será criada para monitorar.

### Exemplo

```javascript
var app = require('express')();
// ....
var tabeliao = require('tabeliao-node');

var options = {
  ssl: true,
  host: 'localhost',
  port: '3000',
  app: app
};

tabeliao.register(options, function(err) {
  if (err) {
    throw err;
  }
});
```

Esse exemplo criará a rota `/healthcheck` e mandará três informações para o SD:

- **id**: campo `name` concatenado com `-` e `hostname` da máquina
- **name**: campo `name` no `package.json`
- **tags**: array contendo `nodejs` e o campo `version` do `package.json`

## tabeliao.getDependencies(keys, callback(err, result))

Pega informações no serviço de configuração centralizada.

### Parâmetros

#### keys (_Array de strings_)

Você passa todas as chaves das quais você precisa dos valores no servidor de configurações.

### Uso

```javascript
tabeliao.getDependencies(['address/google', 'address/stackoverflow'], function (err, result) {
  console.log(result);
});
```

E o result será:

```json
{
  "address/google": "https://google.com",
  "address/stackoverflow": "http://stackoverflow.com/"
}
```

[tabeliao]: https://bitbucket.org/stonepayments/tabeliao/
[ci-url]: https://travis-ci.org/mguilarducci/tabeliao-node
[ci-image]: https://travis-ci.org/mguilarducci/tabeliao-node.svg?branch=master
[coverage-url]: https://coveralls.io/github/mguilarducci/tabeliao-node?branch=master
[coverage-image]: https://coveralls.io/repos/mguilarducci/tabeliao-node/badge.svg?branch=master&service=github
[dependencies-url]: https://david-dm.org/mguilarducci/tabeliao-node
[dependencies-image]: https://david-dm.org/mguilarducci/tabeliao-node.svg
[dependencies-dev-url]: https://david-dm.org/mguilarducci/tabeliao-node#info=devDependencies&view=table
[dependencies-dev-image]: https://david-dm.org/mguilarducci/tabeliao-node/dev-status.svg
