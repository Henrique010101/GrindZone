const loading = document.getElementById('loading');
const todosProdutosPromocao = document.getElementById("produtos-promocao");

async function fetchProdutosPromocao() {
    const response = await fetch(`https://grind-zone-api.vercel.app/api/products/promocao`);
    if (!response.ok) throw new Error('Erro na requisição');
    return await response.json();
}

function renderizarProduto(produto) {
    const modalId = `modal-promocao-${produto._id}`;
    const valorTotal = produto.price * (1 - produto.promocao / 100);
    const precoOriginal = produto.price.toFixed(2).replace('.', ',');
    const precoPromocional = valorTotal.toFixed(2).replace('.', ',');

    return `
        <div class="col-12 col-md-6 col-xxl-4">
            <div class="card h-100 p-0 align-items-center">
                <img class="card-img-promo btn" data-bs-toggle="modal" data-bs-target="#${modalId}" alt="${produto.name}" src="https://grind-zone-api.vercel.app/${produto.img}">
                <div class="card-body card-header w-100 pt-3">
                    <h5 class="text-center card-text fw-bold">${produto.name}</h5>
                    <p class="pt-2">${produto.description.replace(/,/g, '<br>')}</p>
                    <div id="pai-btn-cart" class="mt-auto d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="text-decoration-line-through text-black-50">
                                <strong>R$</strong>${precoOriginal}
                            </span>
                            <br />
                            <span class="fs-5"><strong>R$</strong>${precoPromocional}</span>
                        </div>
                        <button type="button" class="btn btn-roxo btn-lg add-to-cart" data-produto-id="${produto._id}">
                            + <i class="bi bi-cart2"></i>
                        </button>
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
                        <h5 class="modal-title" id="${modalId}Label">${produto.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="carousel-${modalId}" class="carousel slide carousel-dark" data-bs-ride="carousel">
                            <div class="carousel-inner">
                                ${renderizarImagens(produto.img, produto.name)}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carousel-${modalId}" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carousel-${modalId}" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                        <div class="mt-3 d-flex flex-column">
                            <h5 class="modal-title my-2 fs-4 fw-bold text-center" id="${modalId}Label">${produto.name}</h5>
                            <ul>
                                <div>${produto.description.replace(/,/g, '<br>')}</div>
                            </ul>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="me-auto">
                            <span class="preco-promo ">
                                10x de ${(valorTotal / 10).toFixed(2).replace('.', ',').slice(0, 4)}
                            </span>
                            <span>
                                <br />
                                ${produto.promocao > 0 ?
                                    `<strong class="text-decoration-line-through text-black-50">R$ ${precoOriginal}</strong><br>` : ''}
                                <strong>R$</strong> ${precoPromocional}
                            </span>
                        </div>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-roxo add-to-cart" data-produto-id="${produto._id}">Adicionar ao carrinho <i class="bi bi-cart2"></i></button>
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

async function renderizarProdutosNaPromocao() {
    loading.style.display = 'flex';

    try {
        const produtos = await fetchProdutosPromocao();
        const html = produtos.map(renderizarProduto).join('');
        todosProdutosPromocao.innerHTML = html;
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        loading.textContent = 'Não foi possível carregar os produtos. Recarregue a página.';
    }
}

document.addEventListener('DOMContentLoaded', renderizarProdutosNaPromocao);
