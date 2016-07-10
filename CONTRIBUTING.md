# Contribuindo com o tabelião

:+1::tada::+1::tada::+1::tada::+1::tada::+1::tada::+1::tada::+1::tada:

# Iniciando o projeto

## Instalando o node

_TODO_

## Iniciando

```bash
git clone git@bitbucket.org:stonepayments/tabeliao-node.git
cd tabeliao-node
npm install
```

## Rodando testes

```bash
npm test
```

# Styleguides

## Mensagens de commit

- Mensagens em português
- Escreva no presente e no modo imperativo ('Adiciona estrela que pisca')
- Limite a primeira linha com 72 caracteres
- Referencie issues ou pull requests
- Adicione `[skip ci]` na mensagem de commit se for um commit de documentação
- Considere usar os emojis:
  * :art: `:art:` quando melhorar a estrutura/formato do código
  * :racehorse: `:racehorse:` quando melhorar a performance
  * :non-potable_water: `:non-potable_water:` memory leaks
  * :memo: `:memo:` quando escrever alguma documentação
  * :bug: `:bug:` quando corrigir um bug
  * :fire: `:fire:` quando remover códigos ou arquivos
  * :green_heart: `:green_heart:` quando corrigir uma build no CI
  * :white_check_mark: `:white_check_mark:` quando adicionar testes
  * :lock: `:lock:` quando melhorar a segurança
  * :arrow_up: `:arrow_up:` quando der upgrade em dependências
  * :arrow_down: `:arrow_down:` quando der downgrade em dependências
  * :shirt: `:shirt:` quando remover problemas com linter
  * :poop: `:poop:` merda forte!
  * :construction: `:construction:` um commit de algo inacabado
  * :rocket: `:rocket:` commit que lança uma feature


## Pull requests

- Use as mensagens como a de commit
- Tente explicar o máximo o possível e de maneira elegante (lembre-se que todos podem ler)
- Considere que a pessoa que for ler o PR não faz a mínima ideia do que se trata
- Inclua GIFs, imagens ou seja lá o que for que possa ajudar

## Testes

Como usamos o mocha, crie um `describe` para cada função para escrever os testes de unidade.
