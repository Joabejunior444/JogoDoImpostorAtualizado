# Impostor — Encontre o Espião

Jogo em português para jogar com amigos em um único dispositivo. Descubra quem é o impostor sem revelar a palavra secreta.

## Executar localmente

1. Abra a pasta do projeto no VS Code.
2. Use a extensão **Live Server** e escolha **Open with Live Server** no arquivo `index.html`.
3. Abra o endereço informado pela extensão no navegador.

Use um servidor local: os arquivos JSX são carregados pelo Babel e podem ser bloqueados ao abrir o HTML diretamente com `file://`.

É necessário acesso à internet para carregar React, ReactDOM, Babel, Tailwind, fontes, ícones e recursos de áudio e imagem. Não há etapa de instalação ou compilação.

## Organização

```text
index.html                     Entrada do site e carregamento dos arquivos
favicon.svg                    Ícone da aba
assets/
  css/
    styles.css                 Estilos personalizados
  js/
    tailwind-config.js         Cores, fontes e animações do Tailwind
    data.js                    Categorias, palavras e endereços dos recursos
    components.jsx             Componentes e modais compartilhados
    app.jsx                    Navegação, sorteios e estado da partida
    screens/
      home.jsx                 Tela inicial
      loading.jsx              Carregamento
      setup.jsx                Jogadores e configurações
      card-reveal.jsx          Revelação individual da palavra ou papel
      turn-order.jsx           Ordem dos turnos e contagem de 5 segundos
      game-timer.jsx           Partida e temporizador
      result.jsx               Resultado
```

O jogo mantém uma única página HTML. Cada tela fica em um arquivo separado e a navegação é controlada pelo React. Os scripts compartilham o mesmo escopo; preserve a ordem de carregamento no `index.html`.

## Personalizar

- Edite `assets/css/styles.css` e `assets/js/tailwind-config.js` para alterar a aparência.
- Edite `assets/js/data.js` para alterar categorias e palavras.
- Edite os arquivos em `assets/js/screens/` para mudar cada tela.
- Edite `assets/js/app.jsx` para alterar as regras e os sorteios.

## Enviar ao GitHub

Envie `index.html`, `favicon.svg`, a pasta `assets` completa, este README e o `.gitignore`. Preserve os nomes e a estrutura das pastas.

O projeto é estático e pode ser hospedado no GitHub Pages usando a raiz do repositório como origem. Os caminhos relativos também permitem publicá-lo dentro de um repositório de projeto.

## Validação

As simulações anteriores verificaram o sorteio de impostores e o controle de repetição de palavras. A bateria completa da interface no navegador ainda não foi concluída. Após alterações, confira o fluxo de configuração, revelação das cartas, início da partida, resultado e nova rodada no navegador.
