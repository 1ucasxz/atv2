// URL da nossa API Backend
const API_URL = 'http://localhost:3000/itens';

// Formatação para evitar vazios na tela
function formatarCampo(valor) {
    return valor ? valor : '<span style="color: #999; font-style: italic;">N/A</span>';
}

// --------------------------------------------------------- //
// LÓGICA DO GET - index.html
// --------------------------------------------------------- //
async function carregarItens() {
    try {
        // Faz a requisição na rota GET /itens
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Erro de rede HTTP: ${response.status}`);
        }

        const itens = await response.json();
        const tbody = document.getElementById('lista-itens');
        const mensagemVazio = document.getElementById('mensagem-vazio');
        const tabelaProdutos = document.getElementById('tabela-produtos');

        tbody.innerHTML = ''; // Limpa antes de renderizar

        if (itens.length === 0) {
            tabelaProdutos.style.display = 'none';
            mensagemVazio.style.display = 'block';
            return;
        }

        tabelaProdutos.style.display = 'table';
        mensagemVazio.style.display = 'none';

        // Loop no retorno do banco para criar as linhas <tr>
        itens.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.id}</td>
                <td><strong>${item.nome}</strong></td>
                <td>${formatarCampo(item.categoria)}</td>
                <td>${formatarCampo(item.descricao)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        alert('Erro de conexão! O backend Node.js está rodando na porta 3000?');
    }
}

// --------------------------------------------------------- //
// LÓGICA DO POST - cadastro.html
// --------------------------------------------------------- //
function configurarFormulario() {
    const form = document.getElementById('form-cadastro');

    form.addEventListener('submit', async (e) => {
        // Previne que a página dê reload no submit padrão do HTML
        e.preventDefault();

        const nome = document.getElementById('nome').value;
        const categoria = document.getElementById('categoria').value;
        const descricao = document.getElementById('descricao').value;
        const btnSubmit = document.querySelector('.btn-submit');
        const mensagemEl = document.getElementById('mensagem');

        // Bloqueia botão durante a requisição
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Aguarde...';

        // Criação do JSON que vai para o backend
        const novoItem = {
            nome: nome,
            categoria: categoria,
            descricao: descricao
        };

        try {
            // Requisição na rota POST /itens
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Indica que o body é JSON
                },
                body: JSON.stringify(novoItem)
            });

            if (!response.ok) {
                throw new Error('Falha vinda do backend ao salvar o item');
            }

            // Exibir mensagem de sucesso UI
            mensagemEl.textContent = '✅ Produto cadastrado com sucesso!';
            mensagemEl.className = 'mensagem sucesso';

            // Limpa campos do HTML
            form.reset();
            document.getElementById('nome').focus();

        } catch (error) {
            console.error('Erro:', error);
            mensagemEl.textContent = '❌ Erro ao cadastrar. O Backend está rodando?';
            mensagemEl.className = 'mensagem erro';
        } finally {
            // Libera o botão
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Salvar Produto';

            // Apaga as mensagens de erro/sucesso após 4 segundos
            setTimeout(() => {
                mensagemEl.style.display = 'none';
                mensagemEl.className = 'mensagem';
            }, 4000);
        }
    });
}
