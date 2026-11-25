
/* ======================================================
   DASHBOARD TRUNKLAND
   Busca as estatísticas do banco e monta os gráficos.
====================================================== */

// Guarda os gráficos criados para evitar duplicações.
var graficoReinos = null;
var graficoTerritorios = null;
var graficoClas = null;


// ======================================================
// 1. VERIFICAR O USUÁRIO CONECTADO
// ======================================================

function carregarPerfil() {

    // Recupera os dados salvos durante o login.
    var usuarioLogado = sessionStorage.getItem("usuarioLogado");

    // Se não existir sessão, retorna para o login.
    if (!usuarioLogado) {
        window.location.href = "login.html";
        return false;
    }

    try {
        usuarioLogado = JSON.parse(usuarioLogado);
    } catch (erro) {
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "login.html";
        return false;
    }

    // Preenche a saudação.
    document.getElementById("b_usuario").textContent =
        usuarioLogado.nome;

    // Preenche as informações do perfil.
    document.getElementById("perfilNome").textContent =
        usuarioLogado.nome || "-";

    document.getElementById("perfilEmail").textContent =
        usuarioLogado.email || "-";

    document.getElementById("perfilReino").textContent =
        usuarioLogado.id_reino || "-";

    document.getElementById("perfilTerritorio").textContent =
        usuarioLogado.id_territorio || "-";

    document.getElementById("perfilCla").textContent =
        usuarioLogado.id_cla || "-";

    return true;
}


// ======================================================
// 2. ENCERRAR A SESSÃO
// ======================================================

function configurarBotaoSair() {

    document.getElementById("btnSair").addEventListener("click", function () {

        // Remove os dados do usuário do navegador.
        sessionStorage.removeItem("usuarioLogado");

        // Volta para a página de login.
        window.location.href = "login.html";

    });

}


// ======================================================
// 3. BUSCAR AS ESTATÍSTICAS NA API
// ======================================================

function carregarEstatisticas() {

    fetch("/usuarios/estatisticas")

        .then(function (resposta) {

            // Verifica se a requisição foi bem-sucedida.
            if (!resposta.ok) {
                throw new Error("Não foi possível buscar as estatísticas.");
            }

            // Converte a resposta para objeto JavaScript.
            return resposta.json();

        })

        .then(function (dados) {

            console.log("Estatísticas recebidas:", dados);

            // Atualiza os cards.
            atualizarCards(dados);

            // Cria os gráficos.
            criarGraficos(dados);

        })

        .catch(function (erro) {

            console.error("Erro ao carregar dashboard:", erro);

            document.getElementById("totalUsuarios").textContent =
                "Erro ao carregar";

        });

}


// ======================================================
// 4. ATUALIZAR OS CARDS DE RESUMO
// ======================================================

function atualizarCards(dados) {

    document.getElementById("totalUsuarios").textContent =
        dados.totalUsuarios;

    document.getElementById("totalReinos").textContent =
        dados.porReino.length;

    document.getElementById("totalTerritorios").textContent =
        dados.porTerritorio.length;

    document.getElementById("totalClas").textContent =
        dados.porCla.length;

}


// ======================================================
// 5. CRIAR OS GRÁFICOS
// ======================================================

function criarGraficos(dados) {

    // Verifica se a biblioteca Chart.js foi carregada.
    if (typeof Chart === "undefined") {
        console.error("A biblioteca Chart.js não foi carregada.");
        return;
    }

    // Configuração geral da fonte.
    Chart.defaults.font.family = "Barlow";

    // --------------------------------------------------
    // GRÁFICO DE REINOS
    // --------------------------------------------------

    var nomesReinos = dados.porReino.map(function (reino) {
        return reino.nome;
    });

    var quantidadesReinos = dados.porReino.map(function (reino) {
        return reino.quantidade;
    });

    // Destrói o gráfico anterior, caso exista.
    if (graficoReinos) {
        graficoReinos.destroy();
    }

    graficoReinos = new Chart(
        document.getElementById("graficoReinos"),
        {
            type: "doughnut",

            data: {
                labels: nomesReinos,

                datasets: [{
                    label: "Membros",
                    data: quantidadesReinos,

                    backgroundColor: [
                        "#b58b52",
                        "#8a603b",
                        "#d6b98c",
                        "#a34d3c",
                        "#6d8b74",
                        "#c49a6c"
                    ],

                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {

                                var total = context.dataset.data.reduce(
                                    function (soma, valor) {
                                        return soma + valor;
                                    },
                                    0
                                );

                                var quantidade = context.raw;

                                var porcentagem = total > 0
                                    ? (quantidade / total * 100).toFixed(1)
                                    : 0;

                                return context.label + ": " +
                                    quantidade + " membros (" +
                                    porcentagem + "%)";
                            }
                        }
                    }
                }
            }
        }
    );


    // --------------------------------------------------
    // GRÁFICO DE TERRITÓRIOS
    // --------------------------------------------------

    var nomesTerritorios = dados.porTerritorio.map(function (territorio) {
        return territorio.nome;
    });

    var quantidadesTerritorios = dados.porTerritorio.map(function (territorio) {
        return territorio.quantidade;
    });

    if (graficoTerritorios) {
        graficoTerritorios.destroy();
    }

    // Aumenta a altura da área para acomodar os 35 territórios.
    document.querySelector(
        "#graficoTerritorios"
    ).parentElement.style.height =
        Math.max(320, nomesTerritorios.length * 28) + "px";

    graficoTerritorios = new Chart(
        document.getElementById("graficoTerritorios"),
        {
            type: "bar",

            data: {
                labels: nomesTerritorios,

                datasets: [{
                    label: "Membros",
                    data: quantidadesTerritorios,
                    backgroundColor: "#8a603b",
                    borderRadius: 5
                }]
            },

            options: {
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,

                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },

                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        }
    );


    // --------------------------------------------------
    // GRÁFICO DE CLÃS
    // --------------------------------------------------

    var nomesClas = dados.porCla.map(function (cla) {
        return cla.nome;
    });

    var quantidadesClas = dados.porCla.map(function (cla) {
        return cla.quantidade;
    });

    if (graficoClas) {
        graficoClas.destroy();
    }

    graficoClas = new Chart(
        document.getElementById("graficoClas"),
        {
            type: "doughnut",

            data: {
                labels: nomesClas,

                datasets: [{
                    label: "Membros",
                    data: quantidadesClas,

                    backgroundColor: [
                        "#8a603b",
                        "#b58b52",
                        "#d6b98c",
                        "#a34d3c",
                        "#6d8b74",
                        "#c49a6c",
                        "#98765a",
                        "#d8bd91",
                        "#7d6047",
                        "#b77b61",
                        "#a7a078",
                        "#806b91"
                    ],

                    borderWidth: 2,
                    borderColor: "#ffffff"
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    },

                    tooltip: {
                        callbacks: {
                            label: function (context) {

                                var total = context.dataset.data.reduce(
                                    function (soma, valor) {
                                        return soma + valor;
                                    },
                                    0
                                );

                                var quantidade = context.raw;

                                var porcentagem = total > 0
                                    ? (quantidade / total * 100).toFixed(1)
                                    : 0;

                                return context.label + ": " +
                                    quantidade + " membros (" +
                                    porcentagem + "%)";
                            }
                        }
                    }
                }
            }
        }
    );

}


// ======================================================
// 6. INICIALIZAR A DASHBOARD
// ======================================================

if (carregarPerfil()) {

    configurarBotaoSair();

    carregarEstatisticas();

}
