const todosProdutos = document.getElementById('produtos');
let todosOsProdutos = []; // Armazenar todos os produtos
let produtosFiltrados = [];

async function carregarProdutos() {
    try {
        const response = await fetch(`https://grindzone-of.netlify.app/api/products`);
        if (!response.ok) throw new Error('Erro na requisição');
        todosOsProdutos = await response.json();
        produtosFiltrados = [...todosOsProdutos];
        renderizarProdutos(); // Renderiza produtos iniciais
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        todosProdutos.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
    }
}

function filtrarProdutos() {
    const categoriaFiltro = document.getElementById('category').value;
    const menorPrecoChecked = document.getElementById('menorPreco').checked;
    const maiorPrecoChecked = document.getElementById('maiorPreco').checked;
    const promocaoChecked = document.getElementById('promocao').checked;

    produtosFiltrados = todosOsProdutos.filter(produto => {
        // Filtra por categoria
        const dentroDaCategoria = categoriaFiltro === '' || produto.category.trim() === categoriaFiltro;
        // Filtra por promoção
        const temPromocao = promocaoChecked ? produto.promocao > 0 : true;

        return dentroDaCategoria && temPromocao;
    });

    if (menorPrecoChecked) {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (maiorPrecoChecked) {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }

    renderizarProdutos(); // Renderiza produtos filtrados
}

function configurarFiltros() {
    const menorPrecoCheckbox = document.getElementById('menorPreco');
    const maiorPrecoCheckbox = document.getElementById('maiorPreco');

    menorPrecoCheckbox.addEventListener('change', () => {
        if (menorPrecoCheckbox.checked) {
            maiorPrecoCheckbox.checked = false;
        }
    });

    maiorPrecoCheckbox.addEventListener('change', () => {
        if (maiorPrecoCheckbox.checked) {
            menorPrecoCheckbox.checked = false;
        }
    });
}

async function renderizarProdutos() {
    try {
        let html = '';

        produtosFiltrados.forEach(produto => {
            const modalId = `modal-${produto._id}`;
            const valorTotal = produto.price * (1 - produto.promocao / 100);
            const precoOriginal = produto.price.toFixed(2).replace('.', ',');
            const precoPromocional = valorTotal.toFixed(2).replace('.', ',');

            html += `
                <div class="card-todos-produtos  btn text-start p-0">
                    <div class="card p-0 align-items-center h-100 d-flex flex-column">
                    <img class="card-img-produtos" data-bs-toggle="modal" data-bs-target="#${modalId}" alt="${produto.name}" src="https://grindzone-of.netlify.app/${produto.img}">
                    <div class="card-body card-header ps-2 pt-2 px-1 w-100 d-flex flex-column">
                        <h5 class="fs-6 titulo-produto text-center fw-bold">${produto.name}</h5>
                        <ul class="ul-produtos">
                        <li class="mt-1">${produto.description.replace(/,/g, '<br>')}</li>
                        </ul>
                        <div class="mt-auto d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="preco-parcelado text-black-50">
                            10x de ${(valorTotal / 10).toFixed(2).replace('.', ',').slice(0, 4)}
                            </span>
                            <span class="preco-total">
                            <br>
                            ${produto.promocao > 0 ? `
                                <strong class="preco-promo fw-light text-decoration-line-through text-black-50">
                                R$ ${precoOriginal}
                                </strong>
                                <br>` : ''
                                }
                            <strong>R$</strong> ${precoPromocional}
                            </span>
                        </div>
                        <a href="#" class="btn btn-roxo btn-custom add-to-cart" data-produto-id="${produto._id}" aria-label="Adicionar ${produto.name} ao carrinho">+ <i class="bi bi-cart2"></i></a>
                        </div>
                    </div>
                    </div>
                </div>

                <!-- Modal -->
                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                        </div>
                        <div class="modal-body">
                        <div id="carousel-${modalId}" class="carousel slide carousel-dark" data-bs-ride="carousel">
                            <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="https://grindzone-of.netlify.app/${produto.img}" class="d-block w-75 mx-auto" alt="${produto.name} - Imagem 1">
                            </div>
                            <div class="carousel-item">
                                <img src="https://grindzone-of.netlify.app/${produto.img}" class="d-block w-75 mx-auto" alt="${produto.name} - Imagem 2">
                            </div>
                            <div class="carousel-item">
                                <img src="https://grindzone-of.netlify.app/${produto.img}" class="d-block w-75 mx-auto" alt="${produto.name} - Imagem 3">
                            </div>
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${modalId}" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Anterior</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${modalId}" data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Próximo</span>
                            </button>
                        </div>
                        <div class="mt-3 d-flex flex-column">
                            <h5 class="modal-title my-2 fs-4 fw-bold text-center" id="${modalId}Label">${produto.name}</h5>
                            <div>${produto.description.replace(/,/g, '<br>')}</div>
                        </div>
                        </div>
                        <div class="modal-footer">
                        <div class="me-auto">
                            <span class="preco-promo">
                            10x de ${(valorTotal / 10).toFixed(2).replace('.', ',').slice(0, 4)}
                            </span>
                            <span>
                            <br>
                            ${produto.promocao > 0 ? `
                                <strong class="text-decoration-line-through text-black-50">
                                R$ ${precoOriginal}
                                </strong>
                                <br>` : ''
                                }
                            <strong>R$</strong> ${precoPromocional}
                            </span>
                        </div>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-roxo add-to-cart" data-produto-id="${produto._id}" aria-label="Adicionar ${produto.name} ao carrinho">Adicionar ao carrinho <i class="bi bi-cart2"></i></button>
                        </div>
                    </div>
                    </div>
                </div>
                `;
        });

        todosProdutos.innerHTML = html;
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        todosProdutos.innerHTML = '<p class="text-center fs-5">Não foi possível carregar os produtos.</p>';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    carregarProdutos(); // Carrega produtos na inicialização
    configurarFiltros();

    // Adiciona eventos para os filtros
    const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');
    aplicarFiltrosBtn.addEventListener('click', filtrarProdutos);
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSelecionada = urlParams.get('categoria');

    if (categoriaSelecionada) {
        const dropdown = document.getElementById('category');
        dropdown.value = categoriaSelecionada;

        // Aguarde um pouco para garantir que o botão está pronto
        setTimeout(() => {
            if (aplicarFiltrosBtn) {
                aplicarFiltrosBtn.click();
            } else {
                console.error('Botão "Aplicar Filtros" não encontrado.');
            }
        }, 50); // Ajuste o tempo se necessário
    }
})
