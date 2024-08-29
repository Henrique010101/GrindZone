const API_URL = 'http://localhost:3000/api'

window.onload = function () {

    const todosProdutosPromocao = document.getElementById("produtos-promocao");

    async function renderizarProdutosNaPromocao() {
        try {
            const response = await fetch(`${API_URL}/products/promocao`)
            if (!response.ok) throw new Error('Erro na requisição');
            const produtos = await response.json();
            
            let HTML = '';

            produtos.forEach(produto => {
                const modalId = `modal-promocao-${produto._id}`;
                const valorTotal = produto.price * (1 - produto.promocao / 100);
                HTML += `
                <div class="col-12 col-md-6 col-xxl-4">
                    <div class="card h-100 p-0 align-items-center">
                        <img class="card-img-promo btn" data-bs-toggle="modal" data-bs-target="#${modalId}"
                            alt="Moletom da Santa cruz preto" src="http://localhost:3000/${produto.img}">
                            <div class="card-body card-header w-100 pt-3">
                            <h5 class="text-center card-text fw-bold">${produto.name}</h5>
                            <p class="pt-2">${produto.description.replace(/,/g, '<br>')}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center w-100">
                        <div>
                            <span class="text-decoration-line-through text-black-50"><strong>
                                R$</strong>
                            ${produto.price.toFixed(2)}</span>
                            <br />
                            <span class="fs-5"><strong>
                                R$</strong>
                            ${valorTotal.toFixed(2)}</span>
                        </div>
                        <a href="#" type="button" class="btn btn-roxo btn-lg">+ <i class="bi bi-cart2"></i></a>
                        </div>
                    </div>
                    </div>
                </div>
                
                <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <div id="carousel-${modalId}" class="carousel slide carousel-dark" data-bs-ride="carousel">
                           <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="http://localhost:3000/${produto.img}" class="d-block w-75 mx-auto"
                                alt="${produto.name} - Imagem 1">
                            </div>
                            <div class="carousel-item">
                                <img src="http://localhost:3000/${produto.img}" class="d-block w-75 mx-auto"
                                alt="${produto.name} - Imagem 2">
                            </div>
                            <div class="carousel-item">
                                <img src="http://localhost:3000/${produto.img}" class="d-block w-75 mx-auto"
                                alt="${produto.name} - Imagem 3">
                            </div>
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
                            <h5 class="modal-title my-2 fs-4 fw-bold text-center" id="${modalId}Labe16">${produto.name}</h5>

                            <ul>
                                <div>${produto.description.replace(/,/g, '<br>')}</div>
                            </ul>
                        </div>
                        </div>
                        <div class="modal-footer">
                        <div class="me-auto">
                            <span class="preco-promo ">
                                10x de ${(valorTotal / 10).toFixed(2).slice(0, 4)}
                            </span>
                            <span class="">
                                        <br>
                                        ${produto.promocao > 0 ?
                        `<strong class="text-decoration-line-through text-black-50">
                                            R$ ${produto.price.toFixed(2)}
                                        </strong>
                                        <br>` :
                        ''}
                                        <strong>R$</strong> ${valorTotal.toFixed(2)}
                                    </span>
                            <span>
                            <br>
                            </span>
                        </div>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-roxo">Adicionar ao carrinho <i class="bi bi-cart2"></i></button>
                        </div>
                    </div>
                    </div>
                </div>
                `;
            });

            todosProdutosPromocao.innerHTML = HTML;
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            todosProdutosPromocao.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
        }
    }
    renderizarProdutosNaPromocao();
}

