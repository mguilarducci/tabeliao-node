# tabelião node

[![Codeship Build][ci-url-badge-master]][ci-url]
[![Coverage Status][coverage-url-badge-master]][coverage-url]

Biblioteca do [tabelião][tabeliao] para nodejs.

# Pré-requisitos

É necessário ter um `package.json` válido e com as chaves `name` e `version`.
Sua aplicação não pode ter uma rota `/healthcheck`. Ela é criada automaticamente pelo tabelião.

# Funcionamento

No bootstrap da aplicação o tabelião procurará o `package.json` mais próximo da pasta em que o processo está rodando para utilizar as informações para o SD no endereço default do Consul.

O tabelião criará uma rota `/healthcheck` e irá fazer um `GET` nela uma vez por minuto para verificar se o serviço está disponível.

NOTA: a rota só será criada se a `app` do express for passada no `options`.

# Uso

Coloque o código a seguir no arquivo de bootstrap da sua aplicação:

```javascript
var app = require('express')();
// ....
var tabeliao = require('tabeliao');

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

NOTA: setar as variáveis no express é opcional.
Os valores default são:

- **host**: localhost
- **port**: 3000
- **ssl**: false

Isso mandará três informações para o SD:

- **id**: campo `name` concatenado com `-` e `hostname` da máquina
- **name**: campo `name` no `package.json`
- **tags**: array contendo `nodejs` e o campo `version` do `package.json`

[tabeliao]: https://bitbucket.org/stonepayments/tabeliao/
[ci-url]: https://codeship.com/projects/161445
[ci-url-badge-master]: https://codeship.com/projects/641f9b50-245d-0134-f619-3a36b972b11f/status?branch=master
[coverage-url]: https://coveralls.io/bitbucket/stonepayments/tabeliao-node
[coverage-url-badge-master]: https://coveralls.io/repos/bitbucket/stonepayments/tabeliao-node/badge.svg?branch=master&t=zxE2x8
