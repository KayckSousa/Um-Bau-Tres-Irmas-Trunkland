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
      if (active) a.classList.add('ativo'); else a.classList.remove('ativo');
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
            } else if (msgBox) msgBox.textContent = '';
          }
        }

        if (!valid) e.preventDefault();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    attachFormValidation();
  });

})();
