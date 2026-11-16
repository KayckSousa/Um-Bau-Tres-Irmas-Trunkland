document.getElementById("formLogin").addEventListener("submit", function(event) {

    event.preventDefault();

    let nome = document.getElementById("ipt_nome").value;
    let email = document.getElementById("ipt_email").value;
    let senha = document.getElementById("ipt_senha").value;

    let mensagem = document.getElementById("div_msg_login");

    if (nome.trim() === "" || email.trim() === "" || senha.trim() === "") {

        mensagem.style.color = "red";
        mensagem.innerHTML = "Preencha todos os campos!";

        return;
    }

    mensagem.style.color = "#936a2e";

    mensagem.innerHTML =
        "Dados preenchidos! A autenticação ainda precisa ser conectada ao sistema de cadastro.";

});