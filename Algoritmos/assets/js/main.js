
// main.js — lógica mínima para nav ativa e validação simples de formulários

(function () {

    // API_BASE: se a página for aberta via file:// (abrindo o HTML diretamente),
    // aponta para o servidor local padrão (porta 3000). Quando a página for
    // servida por HTTP/HTTPS, mantém caminhos relativos (mesma origem).
    // fallback para quando abrir os arquivos via file:// — porta padrão do projeto em desenvolvimento
    const API_BASE = (location.protocol === 'file:') ? 'http://localhost:3333' : '';

    // =====================================================
    // FUNÇÃO ORIGINAL: IDENTIFICAR A PÁGINA ATIVA NO MENU
    // =====================================================

    function setActiveNav() {

        const links = document.querySelectorAll('nav a, .nav-link');
        const currentPath = location.pathname.split('/').pop() || 'index.html';
        const currentHash = location.hash || '';

        links.forEach(a => {

            const href = a.getAttribute('href');

            if (!href) return;

            let active = false;

            if (href.startsWith('#')) {

                active = href === currentHash;

            } else {

                const [hrefPath, hrefHash] = href.split('#');
                const hrefFile = hrefPath.split('/').pop() || 'index.html';

                // comparar arquivos (ex: cadastro.html) ou index.html com hashes
                if (hrefFile === currentPath || (hrefFile === 'index.html' && (currentPath === '' || currentPath === 'index.html'))) {

                    if (!hrefHash) active = !currentHash || currentHash === '';
                    else active = ('#' + hrefHash) === currentHash;

                }

            }

            if (active) a.classList.add('ativo');
            else a.classList.remove('ativo');

        });

    }


    // =====================================================
    // FUNÇÃO ORIGINAL: MOSTRAR ERRO NO CAMPO
    // =====================================================

    function showFieldError(el, msg) {

        el.classList.add('invalid');

        let hint = el.nextElementSibling;

        if (!hint || !hint.classList.contains('field-error')) {

            hint = document.createElement('span');
            hint.className = 'field-error';
            hint.style.color = 'var(--error-color, #c00)';
            el.insertAdjacentElement('afterend', hint);

        }

        hint.textContent = msg;

    }


    // =====================================================
    // FUNÇÃO ORIGINAL: LIMPAR ERRO DO CAMPO
    // =====================================================

    function clearFieldError(el) {

        el.classList.remove('invalid');

        const hint = el.nextElementSibling;

        if (hint && hint.classList.contains('field-error')) hint.remove();

    }


    // =====================================================
    // NOVA FUNÇÃO: FILTRAR TERRITÓRIOS PELO REINO
    // =====================================================

    function filtrarTerritorios() {

        const reino = document.getElementById('ipt_reino');
        const territorio = document.getElementById('ipt_federado');

        // Se a página não possuir esses campos, não executa
        if (!reino || !territorio) return;

        const idReinoSelecionado = reino.value;

        // Percorre as opções de território
        Array.from(territorio.options).forEach(function (opcao, indice) {

            // Mantém a primeira opção como instrução
            if (indice === 0) {

                opcao.hidden = false;
                opcao.disabled = false;
                return;

            }

            // Verifica se o território pertence ao reino selecionado
            const pertenceAoReino =
                opcao.dataset.reino === idReinoSelecionado;

            opcao.hidden = !pertenceAoReino;
            opcao.disabled = !pertenceAoReino;

        });

        // Limpa o território selecionado anteriormente
        territorio.value = '';

    }


    // =====================================================
    // NOVA FUNÇÃO: ENVIAR OS DADOS DO CADASTRO AO SERVIDOR
    // =====================================================

    function enviarCadastro() {

        const nome = document.getElementById('ipt_nome').value;
        const nacionalidade = document.getElementById('ipt_nacao').value;
        const email = document.getElementById('ipt_email').value;
        const senha = document.getElementById('ipt_senha').value;

        const idReino = document.getElementById('ipt_reino').value;
        const idTerritorio = document.getElementById('ipt_federado').value;
        const idCla = document.getElementById('ipt_cla').value;

        const msgBox = document.getElementById('div_msg');

        // Evita mensagens antigas durante uma nova tentativa
        msgBox.textContent = 'Enviando cadastro...';
        msgBox.style.color = 'inherit';

        fetch(API_BASE + '/usuarios/cadastrar', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                nomeServer: nome,
                nacionalidadeServer: nacionalidade,
                emailServer: email,
                senhaServer: senha,

                idReinoServer: idReino,
                idTerritorioServer: idTerritorio,
                idClaServer: idCla

            })

        })

        .then(function (resposta) {

            return resposta.json().then(function (dados) {

                return {
                    ok: resposta.ok,
                    dados: dados
                };

            });

        })

        .then(function (resultado) {

            if (resultado.ok) {

                msgBox.textContent = resultado.dados.mensagem;
                msgBox.style.color = 'green';

                document.getElementById('formCadastro').reset();

                // Atualiza a lista de territórios após limpar o formulário
                filtrarTerritorios();

            } else {

                msgBox.textContent =
                    resultado.dados.mensagem ||
                    'Não foi possível realizar o cadastro.';

                msgBox.style.color = 'red';

            }

        })

        .catch(function (erro) {

            console.log('Erro ao realizar cadastro:', erro);

            msgBox.textContent = 'Erro ao conectar com o servidor.';
            msgBox.style.color = 'red';

        });

    }


    // =====================================================
    // NOVA FUNÇÃO: ENVIAR OS DADOS DE LOGIN AO SERVIDOR
    // =====================================================

    function enviarLogin() {

        const email = document.getElementById('ipt_email').value;
        const senha = document.getElementById('ipt_senha').value;
        const msgBox = document.getElementById('div_msg_login');

        msgBox.textContent = 'Verificando seus dados...';
        msgBox.style.color = 'inherit';

        fetch(API_BASE + '/usuarios/autenticar', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                emailServer: email,
                senhaServer: senha
            })

        })

        .then(function (resposta) {

            return resposta.json().then(function (dados) {

                return {
                    ok: resposta.ok,
                    dados: dados
                };

            });

        })

        .then(function (resultado) {

            if (resultado.ok) {

                msgBox.textContent =
                    'Bem-vindo(a), ' + resultado.dados.nome +
                    '! Login realizado com sucesso.';

                msgBox.style.color = 'green';

                // Limpa somente a senha após autenticação bem-sucedida
                document.getElementById('ipt_senha').value = '';

                // Guarda os dados básicos da sessão no navegador.
                // Não armazena a senha nem o hash.
                sessionStorage.setItem('usuarioLogado', JSON.stringify({

                    id_usuario: resultado.dados.id_usuario,
                    nome: resultado.dados.nome,
                    email: resultado.dados.email,
                    id_reino: resultado.dados.id_reino,
                    id_territorio: resultado.dados.id_territorio,
                    id_cla: resultado.dados.id_cla

                }));

            } else {

                msgBox.textContent =
                    resultado.dados.mensagem ||
                    'E-mail ou senha inválidos.';

                msgBox.style.color = 'red';

            }

        })

        .catch(function (erro) {

            console.log('Erro ao realizar login:', erro);

            msgBox.textContent = 'Não foi possível comunicar com o servidor.';
            msgBox.style.color = 'red';

        });

    }


    // =====================================================
    // FUNÇÃO ORIGINAL: VALIDAÇÃO DOS FORMULÁRIOS
    // =====================================================

    function attachFormValidation() {

        document.querySelectorAll('form[data-validate="simple"]').forEach(form => {

            form.addEventListener('submit', function (e) {

                let valid = true;

                form.querySelectorAll('[required]').forEach(inp => {

                    if (!inp.value || !String(inp.value).trim()) {

                        valid = false;
                        showFieldError(inp, 'Preencha este campo');

                    } else {

                        clearFieldError(inp);

                    }

                });


                // VERIFICAÇÃO ORIGINAL: CONFIRMAÇÃO DAS SENHAS

                if (form.id === 'formCadastro') {

                    const s1 = document.getElementById('ipt_senha');
                    const s2 = document.getElementById('ipt_senha2');
                    const msgBox = document.getElementById('div_msg');

                    if (s1 && s2) {

                        if (s1.value !== s2.value) {

                            valid = false;

                            if (msgBox) {
                                msgBox.textContent = 'As senhas não coincidem.';
                                msgBox.style.color = 'red';
                            }

                        } else if (msgBox) {

                            msgBox.textContent = '';

                        }

                    }

                }


                // NOVA PARTE: ENVIO DO CADASTRO AO BACKEND

                if (!valid) {

                    // Impede o envio se houver campos inválidos
                    e.preventDefault();

                } else if (form.id === 'formCadastro') {

                    // Impede o envio tradicional do formulário
                    e.preventDefault();

                    // Envia os dados para a rota /usuarios/cadastrar
                    enviarCadastro();

                }


                /*
                CÓDIGO ORIGINAL PRESERVADO:

                if (!valid) e.preventDefault();

                Essa era a lógica anterior de validação.

                Foi substituída pela condição acima para permitir
                que o cadastro válido seja enviado ao servidor.
                */

            });

        });

    }


    // =====================================================
    // INICIALIZAÇÃO DAS FUNÇÕES
    // =====================================================

    document.addEventListener('DOMContentLoaded', function () {

        setActiveNav();

        attachFormValidation();

        // NOVO: prepara a lista de territórios
        filtrarTerritorios();

        // NOVO: filtra novamente quando o reino for alterado
        const reino = document.getElementById('ipt_reino');

        if (reino) {

            reino.addEventListener('change', filtrarTerritorios);

        }


        // =====================================================
        // NOVO: PREPARA O FORMULÁRIO DE LOGIN
        // =====================================================

        const formLogin = document.getElementById('formLogin');

        if (formLogin) {

            formLogin.addEventListener('submit', function (e) {

                // Impede o envio tradicional do formulário
                e.preventDefault();

                const email = document.getElementById('ipt_email');
                const senha = document.getElementById('ipt_senha');
                const msgBox = document.getElementById('div_msg_login');

                // Verifica se os campos foram preenchidos
                if (!email.value.trim() || !senha.value) {

                    msgBox.textContent = 'Informe seu e-mail e sua senha.';
                    msgBox.style.color = 'red';

                    return;

                }

                // Envia os dados para a rota /usuarios/autenticar
                enviarLogin();

            });

        }

    });


})();
