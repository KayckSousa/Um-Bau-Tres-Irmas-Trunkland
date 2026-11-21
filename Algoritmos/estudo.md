# Estudo detalhado do projeto

Este documento descreve os arquivos principais do projeto, explicando o HTML, CSS e JavaScript relevantes, além de observações sobre mudanças feitas (integração do style.css em css/estilo.css, arquivos arquivados, e atualização do package.json).

Índice
- Visão geral da estrutura
- HTML principais (index.html, cadastro.html, login.html, dashboard.html)
- CSS (css/estilo.css) — organização e principais blocos
- JavaScript (assets/js/main.js, js/sessao.js, js/alerta.js)
- Backend (app.js, routes, controllers, models) — resumo do fluxo
- Alterações realizadas e localização de arquivos arquivados

1) Visão geral da estrutura
- index.html — página pública principal (landing)
- cadastro.html — página de cadastro
- login.html — página de login
- dashboard/ — páginas do painel (dashboard.html, cards, mural, edicao-aviso)
- css/estilo.css — arquivo CSS unificado (contém o CSS original e o conteúdo de style.css integrado)
- assets/js/main.js — scripts front-end para navegação e validação
- js/sessao.js — gerenciamento simples de sessão (sessionStorage)
- js/alerta.js — lógica de alerta (consome API de medidas)
- app.js, routes/, controllers/, models/ — servidor Express + rotas e acesso ao banco
- archive/ — contém cópias dos arquivos originais movidos para segurança

2) HTML principais

- index.html
  - Estrutura: header (classe cabecalho), sections (banner, historia, personagens, trunkland) e footer.
  - Link do CSS: agora referencia "css/estilo.css". Se abrir o arquivo localmente no navegador, o caminho está correto para o CSS em css/estilo.css no diretório raiz.
  - Imagens: usam caminhos absolutos no repositório local; para produção, prefira caminhos relativos (ex.: imagens/logo.png).

- cadastro.html
  - Formulário de cadastro com id="formCadastro". O script assets/js/main.js adiciona validação simples (campos required e comparação de senhas).
  - Botões e inputs estilizados por classes do CSS unificado.

- login.html
  - Formulário de login. Eventuais mensagens aparecem em #div_msg_login e o carregamento usa elementos controlados por js/sessao.js.

- dashboard.html e páginas em dashboard/
  - Páginas do painel que dependem de sessionStorage.AQUARIOS e usam js/alerta.js e js/sessao.js.
  - Dependem de fetch para rotas como /medidas/tempo-real/:id para atualização em tempo real.

3) CSS (css/estilo.css)

O arquivo css/estilo.css agora contém:
- O CSS que já existia em css/estilo.css (import de fontes, variáveis, layout do site moderno).
- A integração do arquivo root style.css (muito conteúdo com classes como .cabecalho, .banner, .personagens, .pagina-cadastro-trunkland, etc.).
- A integração do exemplo DOCUMENTOS_DE_APOIO/exemplo_de_quiz/style.css (variáveis de cor utilitárias).

Organização do CSS unificado:
- Topo: import de fontes e variáveis (:root) para o estilo principal.
- Blocos por seção: header, banner, social, footer, login, formulário, simulador, alertas, responsividade.
- Conteúdo integrado do style.css original foi colocado ao final do arquivo com comentários indicando a origem.

Observações práticas sobre conflitos:
- Havendo seletores duplicados (por exemplo .banner, .botao, body) o último bloco definido no arquivo vence. Isso significa que o comportamento final será o do último bloco carregado. Se notar diferenças visuais indesejadas, abra css/estilo.css e ajuste a ordem ou refatore os seletores para nomes mais específicos (ex.: .home-banner vs .dashboard-banner).

4) JavaScript — explicações por arquivo

- assets/js/main.js
  - Auto-executável que adiciona duas responsabilidades principais:
    1) setActiveNav(): percorre links de nav e adiciona a classe 'ativo' ao link que corresponde ao arquivo/href atual (com suporte a hashes). Serve para destacar o item de menu ativo.
    2) attachFormValidation(): para forms com data-validate="simple" faz verificação de required e, se existir form id='formCadastro', valida a igualdade das senhas (ipt_senha e ipt_senha2). Quando inválido, previne o submit e mostra mensagens próximas aos campos.
  - Pontos de atenção: a validação é minimal; para segurança/produção valide também no servidor (app.js/controllers).

- js/sessao.js
  - validarSessao(): verifica sessionStorage.EMAIL_USUARIO e NOME_USUARIO. Se presentes atualiza o botão/elemento b_usuario com o nome; caso contrário redireciona para login.html.
  - limparSessao(): limpa sessionStorage e redireciona para login.
  - aguardar() / finalizarAguardar(texto): controlam uma div de loading e mensagens de erro em login.
  - Uso: chamadas diretas nas páginas do dashboard e áreas que dependem de sessão.

- js/alerta.js
  - Função obterdados(idAquario): faz fetch para /medidas/tempo-real/:idAquario e passa o resultado para alertar().
  - alertar(resposta,idAquario): analisa temperatura (resposta[0].temperatura) e decide o grau de aviso (perigo-quente, alerta-quente, ideal, alerta-frio, perigo-frio) comparando com limites.
  - exibirAlerta / removerAlerta / exibirCards / transformarEmDiv: constroem e atualizam o DOM com cards de alerta para cada aquário em alerta. Usa sessionStorage.AQUARIOS para obter descrição do aquário.
  - atualizacaoPeriodica(): chama obterdados para cada aquário em sessionStorage.AQUARIOS a cada 5s.

5) Backend (resumo rápido)

- app.js: arquivo principal do servidor Express (entrypoint). Contém import das rotas, configuração do ambiente e escuta do servidor.
- routes/*.js: definem endpoints (ex.: /usuarios, /empresas, /medidas). São usados pelos controllers.
- controllers/*.js: lógica que executa queries via models (ex.: usuarioController chama usuarioModel). Retornam JSON ao front.
- models/*.js: contém funções que constroem queries SQL (arquivo .sql de criação de tabelas está em database/).

6) Alterações realizadas

- CSS unificado: o conteúdo de /style.css e DOCUMENTOS_DE_APOIO/exemplo_de_quiz/style.css foi integrado ao final de css/estilo.css.
- Atualização de referências: index.html, login.html, cadastro.html, dashboard.html passaram a referenciar css/estilo.css; o exemplo EXEMPLO_QUIZZ.html (em DOCUMENTOS_DE_APOIO/exemplo_de_quiz) foi atualizado para usar o CSS central com o caminho relativo "../../css/estilo.css".
- Arquivamento: os arquivos originais removidos foram copiados para archive/
  - archive/style.root.css (cópia do style.css original)
  - archive/exemplo_de_quiz.style.css (cópia do arquivo do exemplo)
- package.json: simplificado para scripts básicos (start, test), adicionado campo engines.node: ">=16.0.0". nodemon foi movido para devDependencies.

7) Como proceder após as mudanças

- Teste local: rode npm install (isso instalará dependências) e em seguida npm start para subir o servidor (se for o objetivo). Se precisar do modo dev com restart automático, instale nodemon globalmente ou rode npx nodemon (foi colocado em devDependencies).
- Ver visual: abra index.html no navegador (ou acesse o servidor se usar app.js) e verifique se layout e páginas carregam como esperado. Se algum estilo estiver diferente, abra css/estilo.css e ajuste a ordem ou nomes de seletor para evitar conflitos.

8) Notas finais e recomendações

- Refatoração de CSS: por manter compatibilidade, alguns estilos duplicados foram concatenados. A longo prazo recomendo:
  - Renomear estilos por área (ex.: .home-..., .cadastro-...) para evitar conflitos.
  - Organizar CSS em partes (base, components, pages, utilities) e usar uma ferramenta de build (PostCSS/Sass) se o projeto crescer.

- Segurança: valide dados no servidor (controllers/models) — o front-end faz apenas validação mínima.

Se quiser, faço:
- separar e refatorar os blocos CSS duplicados com nomes específicos;
- mover nodemon para devDependencies no package-lock e gerar commit de lock atualizado;
- criar uma branch limpa com as mudanças (já criei os commits e a branch conforme pedido).

Fim do estudo.
