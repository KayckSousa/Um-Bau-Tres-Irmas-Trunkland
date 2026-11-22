
// main.js — lógica mínima para nav ativa e validação simples de formulários

(function () {

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

    function clearFieldError(el) {
        el.classList.remove('invalid');

        const hint = el.nextElementSibling;

        if (hint && hint.classList.contains('field-error')) hint.remove();
    }

    // =====================================================
    // NOVA FUNÇÃO: ENVIO DOS DADOS DO CADASTRO AO SERVIDOR
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

        fetch('/usuarios/cadastrar', {
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

            } else {

                msgBox.textContent = resultado.dados.mensagem || 'Não foi possível realizar o cadastro.';
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
    // VALIDAÇÃO DOS FORMULÁRIOS
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

                // verificação específica para cadastro de senhas
                if (form.id === 'formCadastro') {

                    const s1 = document.getElementById('ipt_senha');
                    const s2 = document.getElementById('ipt_senha2');
                    const msgBox = document.getElementById('div_msg');

                    if (s1 && s2) {

                        if (s1.value !== s2.value) {

                            valid = false;

                            if (msgBox) msgBox.textContent = 'As senhas não coincidem.';

                        } else if (msgBox) {

                            msgBox.textContent = '';

                        }

                    }
                }

                // NOVA PARTE:
                // Impede o envio padrão e envia os dados ao servidor.
                if (!valid) {

                    e.preventDefault();

                } else if (form.id === 'formCadastro') {

                    e.preventDefault();
                    enviarCadastro();

                }

                /*
                CÓDIGO ORIGINAL:
                if (!valid) e.preventDefault();

                Mantido como comentário para preservar
                a lógica anterior do formulário.
                */

            });

        });

    }

    document.addEventListener('DOMContentLoaded', function () {

        setActiveNav();
        attachFormValidation();

    });

})();
