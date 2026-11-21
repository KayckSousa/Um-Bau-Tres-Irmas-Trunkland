# RESUMO DO PROJETO

Este resumo documenta o repositório, os arquivos e funções mais importantes, as alterações que realizamos e instruções rápidas para usar o projeto.

1) Visão geral
- Nome do projeto: Um Baú, Três Irmãs & Trunkland
- Tipo: site estático com backend em Node/Express (API + páginas estáticas). Contém páginas públicas (landing, cadastro, login) e páginas de dashboard.

2) Estrutura principal de arquivos
- index.html — landing page (header, banner, história, personagens, trunkland, footer).
- cadastro.html — página de cadastro (formulário com validação mínima no front-end).
- login.html — página de login.
- dashboard.html e pasta dashboard/ — páginas do painel (cards, mural, edição de aviso) que interagem com a API.
- css/estilo.css — arquivo CSS unificado (integração dos estilos originais e do style.css). Ponto único de estilos para todo o site.
- assets/js/main.js — scripts front-end: navegação ativa e validação simples de formulários.
- js/sessao.js — funções de sessão (validarSessao, limparSessao, aguardar, finalizarAguardar).
- js/alerta.js — lógica de alertas/medidas (obter dados via fetch, determinar níveis de alerta, renderizar cards de alerta).
- app.js — entrypoint do servidor Express (configuração e montagem de rotas).
- routes/*.js — definição de rotas (usuarios, empresas, medidas, avisos, aquarios, index).
- controllers/*.js — lógica de negócios que responde às rotas usando models (avisoController, empresaController, aquarioController, usuarioController, medidaController).
- models/*.js — funções que fazem consultas SQL (usuarioModel, empresaModel, aquarioModel, avisoModel, medidaModel).
- database/config.js — configuração de conexão com o banco de dados.
- database/script-tabelas.sql — script para criação de tabelas.
- package.json — configurações de scripts e dependências (start/test, engines.node >=16). nodemon em devDependencies.
- estudo.md — documentação detalhada que criamos explicando o HTML, CSS e JS do projeto.
- archive/ — cópias arquivadas dos estilos originais (style.root.css, exemplo_de_quiz.style.css) para segurança.

3) Funções e trechos de código importantes
- assets/js/main.js
  - setActiveNav(): marca o link de navegação ativo com a classe 'ativo' (suporta hashes e arquivos).
  - attachFormValidation(): valida forms com data-validate="simple" e valida senhas no form de cadastro.

- js/sessao.js
  - validarSessao(): verifica sessionStorage para permitir acesso ao dashboard; redireciona para login se não autenticado.
  - limparSessao(): limpa sessionStorage e redireciona para login.
  - aguardar() / finalizarAguardar(): controlam elementos de loading e mensagens.

- js/alerta.js
  - obterdados(idAquario): fetch /medidas/tempo-real/:idAquario e chama alertar().
  - alertar(): interpreta temperatura e decide nível de alerta (perigo/alerta/ideal) e atualiza a lista de alertas.
  - exibirCards(), transformarEmDiv(): atualizam o DOM com cards de alerta usando dados em sessionStorage.AQUARIOS.

- Backend (resumo)
  - routes/*.js registram endpoints que delegam para controllers.
  - controllers/*.js executam lógica e usam os models para acessar o banco (respostas em JSON).
  - models/*.js constroem queries SQL (use database/script-tabelas.sql para referência de estrutura).

4) Alterações realizadas (o que já fizemos)
- Integração de estilos: o conteúdo do style.css original foi incorporado ao final de css/estilo.css.
- Integração de styles de exemplo: conteúdo de DOCUMENTOS_DE_APOIO/exemplo_de_quiz/style.css também integrado ao css/estilo.css.
- Atualização de referências: index.html, login.html, cadastro.html e dashboard.html agora carregam css/estilo.css; o exemplo EXEMPLO_QUIZZ.html foi ajustado.
- Arquivamento: arquivos de estilo originais foram movidos/copied para archive/ para segurança (archive/style.root.css, archive/exemplo_de_quiz.style.css).
- package.json: simplificado para scripts básicos (start, test), adicionado engines.node ">=16.0.0" e nodemon movido para devDependencies.
- Criado estudo.md com explicação detalhada de cada parte do projeto.
- Branch criada: reorganize-css-archive — todas as mudanças foram commitadas nessa branch.

5) Como executar localmente
1. Instalar dependências: npm install
2. Configurar variáveis de ambiente / arquivo .env conforme app.js e database/config.js (credenciais do MySQL etc.).
3. Executar: npm start (inicia node app.js). Para modo de desenvolvimento com reinício automático, use npx nodemon app.js (nodemon está em devDependencies).
4. Acesse as páginas estáticas diretamente (ex.: abrir index.html) ou via servidor (http://localhost:PORT) dependendo da configuração do app.js.

6) Observações e recomendações
- Caminhos de imagens: muitos arquivos usam caminhos absolutos locais — para deploy recomenda-se usar caminhos relativos (ex.: imagens/logo.png) e servir a pasta de imagens via servidor estático.
- Conflitos de CSS: a integração juntou estilos com seletores duplicados. Onde houver conflito, o último bloco prevalece. Se notar diferenças visuais, sugiro refatorar CSS por página/área (ex.: prefixar com .home-, .dashboard-).
- Segurança: o front-end apenas faz validação mínima. Valide sempre no servidor (controllers/models) antes de operar no banco.
- Testes: não há testes automatizados configurados; o package.json tem um script test placeholder.

7) Próximos passos sugeridos
- Refatorar CSS em módulos e remover duplicações.
- Tornar paths de imagens relativos e padronizar assets.
- Adicionar scripts de build/lint se desejar manter consistência de código.
- Atualizar README.md com instruções de deploy e variáveis de ambiente.

Se quiser, aplico alguma das sugestões acima agora (refatoração CSS, ajustar imagens, atualizar README ou abrir PR remoto).
