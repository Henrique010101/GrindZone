const todosProdutos = document.getElementById('produtos');
const loading = document.getElementById('loading');
let todosOsProdutos = [];
let produtosFiltrados = [];
let produtosCarregados = false;

async function carregarProdutos() {
    loading.style.display = 'flex';
    try {
        const response = await fetch(`https://grind-zone-api.vercel.app/api/products`);
        if (!response.ok) throw new Error('Erro na requisição');
        todosOsProdutos = await response.json();
        produtosFiltrados = [...todosOsProdutos];
        renderizarProdutos();
        produtosCarregados = true;
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        loading.textContent = 'Não foi possível carregar os produtos. Recarregue a página.';
    }
}

function filtrarProdutos() {
    if (!produtosCarregados) {
        console.warn('Produtos ainda não carregados, aguarde.');
        return;
    }

    const categoriaFiltro = document.getElementById('category').value;
    const menorPrecoChecked = document.getElementById('menorPreco').checked;
    const maiorPrecoChecked = document.getElementById('maiorPreco').checked;
    const promocaoChecked = document.getElementById('promocao').checked;

    produtosFiltrados = todosOsProdutos.filter(produto => {

        const dentroDaCategoria = categoriaFiltro === '' || produto.category.trim() === categoriaFiltro;
        const temPromocao = promocaoChecked ? produto.promocao > 0 : true;

        return dentroDaCategoria && temPromocao;
    });

    if (menorPrecoChecked) {
        produtosFiltrados.sort((a, b) => a.price - b.price);
    } else if (maiorPrecoChecked) {
        produtosFiltrados.sort((a, b) => b.price - a.price);
    }

    renderizarProdutos();
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

function inicializarFiltros() {
    const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');
    aplicarFiltrosBtn.addEventListener('click', filtrarProdutos);

    const urlParams = new URLSearchParams(window.location.search);
    const categoriaSelecionada = urlParams.get('categoria');

    if (categoriaSelecionada) {
        const dropdown = document.getElementById('category');
        dropdown.value = categoriaSelecionada;

        aplicarFiltrosQuandoPronto();
    }
}

function aplicarFiltrosQuandoPronto() {
    const aplicarFiltrosBtn = document.getElementById('aplicarFiltros');

    if (produtosCarregados) {
        aplicarFiltrosBtn.click();
    } else {
        const interval = setInterval(() => {
            if (produtosCarregados) {
                clearInterval(interval);
                aplicarFiltrosBtn.click();
            }
        }, 100);
    }
}

function renderizarProduto(produto) {
    const modalId = `modal-${produto._id}`;
    const valorTotal = produto.price * (1 - produto.promocao / 100);
    const precoOriginal = produto.price.toFixed(2).replace('.', ',');
    const precoPromocional = valorTotal.toFixed(2).replace('.', ',');

    return `
        <div class="card-todos-produtos btn text-start p-0">
            <div class="card p-0 align-items-center h-100 d-flex flex-column">
                <img class="card-img-produtos" data-bs-toggle="modal" data-bs-target="#${modalId}" alt="${produto.name}" src="https://grind-zone-api.vercel.app/${produto.img}">
                <div class="card-body card-header ps-2 pt-2 px-1 w-100 d-flex flex-column">
                    <h5 class="fs-6 titulo-produto text-center fw-bold">${produto.name}</h5>
                    <ul class="ul-produtos">
                        <li class="mt-1">${produto.description.replace(/,/g, '<br>')}</li>
                    </ul>
                    <div class="mt-auto d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="preco-parcelado text-black-50">10x de ${(valorTotal / 10).toFixed(2).replace('.', ',').slice(0, 4)}</span>
                            <span class="preco-total">
                                <br>
                                ${produto.promocao > 0 ? `<strong class="preco-promo fw-light text-decoration-line-through text-black-50">R$ ${precoOriginal}</strong><br>` : ''}
                                <strong>R$</strong> ${precoPromocional}
                            </span>
                        </div>
                        <button type="button" class="btn btn-roxo btn-custom add-to-cart" data-produto-id="${produto._id}">+ <i class="bi bi-cart2"></i></button>
                    </div>
                </div>
            </div>
            ${renderizarModal(produto, modalId, valorTotal, precoOriginal, precoPromocional)}
        </div>
    `;
}

function renderizarModal(produto, modalId, valorTotal, precoOriginal, precoPromocional) {
    return `
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
                                ${renderizarImagens(produto.img, produto.name)}
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
                            <span class="preco-promo">10x de ${(valorTotal / 10).toFixed(2).replace('.', ',').slice(0, 4)}</span>
                            <span>
                                <br>
                                ${produto.promocao > 0 ? `<strong class="text-decoration-line-through text-black-50">R$ ${precoOriginal}</strong><br>` : ''}
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
}

function renderizarImagens(img, produtoNome) {
    return `
        <div class="carousel-item active">
            <img src="https://grind-zone-api.vercel.app/${img}" class="d-block w-75 mx-auto" alt="${produtoNome} - Imagem 1">
        </div>
        <div class="carousel-item">
            <img src="https://grind-zone-api.vercel.app/${img}" class="d-block w-75 mx-auto" alt="${produtoNome} - Imagem 2">
        </div>
        <div class="carousel-item">
            <img src="https://grind-zone-api.vercel.app/${img}" class="d-block w-75 mx-auto" alt="${produtoNome} - Imagem 3">
        </div>
    `;
}

function renderizarProdutos() {
    try {
        const html = produtosFiltrados.map(renderizarProduto).join('');
        todosProdutos.innerHTML = html;
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    carregarProdutos();
    configurarFiltros();
    inicializarFiltros();
});
