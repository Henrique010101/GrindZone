let addToCartButtons = document.querySelectorAll('.add-to-cart');
console.log(addToCartButtons)

setTimeout(function() {
    addToCartButtons = document.querySelectorAll('.add-to-cart')
    console.log(addToCartButtons)

    // Adiciona o listener de clique a cada botão
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(a => {
            a.addEventListener('click', function (event) {
                event.preventDefault(); // Evita o comportamento padrão do <a>

                // Extrai o ID do produto do atributo data-produto-id
                const productId = this.getAttribute('data-produto-id');
                console.log('ID do produto extraído:', productId);

                // Verifica se o productId foi extraído corretamente
                if (!productId) {
                    console.error('Erro: productId não encontrado');
                    return;
                }

                // Define a quantidade, por exemplo, 1 para adicionar um item
                const quantity = 1;

                // Chama a função addToCart com o ID do produto e a quantidade
                console.log('Chamando addToCart com productId:', productId, 'e quantity:', quantity);
                addToCart(productId, quantity);
            });
        });
    } else {
        console.error('Nenhum botão de adicionar ao carrinho encontrado');
    }
}, 1500);

async function addToCart(productId, quantity) {
    try {
        console.log('Iniciando requisição para /cart');
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                credentials: 'include', // Garante que o cookie seja enviado
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        console.log('Resposta do servidor:', data);

        // Tratar a resposta e atualizar o front-end
        console.log(data.message); // Exibe a mensagem "Item adicionado ao carrinho."
        updateCartDisplay(data.cart); // Atualiza a exibição do carrinho com os produtos

    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
    }
}

function updateCartDisplay(cart) {
    const cartContainer = document.getElementById('conteudo-cart'); // Seleciona o tbody
    cartContainer.innerHTML = ''; // Limpa o conteúdo atual do carrinho

    cart.items.forEach(item => {
        const product = item.productId; // Produto populado com a imagem, nome e outros dados

        // Criar o elemento <tr> para cada produto no carrinho
        const cartRow = document.createElement('tr');
        cartRow.classList.add('my-auto');

        // HTML dinâmico para o produto no carrinho
        cartRow.innerHTML = `
            <td>
                <div class="product d-flex align-items-center">
                    <img src="http://seu-site.com/${product.img}" alt="${product.name}" class="img-fluid rounded">
                    <div class="info ms-3 d-none d-lg-block">
                        <div class="name h5">${product.name}</div>
                        <div class="category text-muted">Categoria: ${product.category || 'N/A'}</div>
                    </div>
                </div>
            </td>
            <td class="font-cart-td"><strong>R$</strong> ${product.price.toFixed(2)}</td>
            <td class="font-cart-td">
                <div class="qty d-flex flex-lg-row align-items-center bg-light rounded d-inline-flex rounded-lg-pill">
                    <button class="btn p-0 px-2" aria-label="Remover um item" onclick="updateQuantity('${product._id}', -1)">
                        <i class="bi bi-dash"></i>
                    </button>
                    <span class="my-2 my-lg-0 mx-2">${item.quantity}</span>
                    <button class="btn p-0 px-2" aria-label="Adicionar um item" onclick="updateQuantity('${product._id}', 1)">
                        <i class="bi bi-plus"></i>
                    </button>
                </div>
            </td>
            <td class="font-cart-td"><strong>R$</strong> ${(product.price * item.quantity).toFixed(2)}</td>
            <td class="font-cart-td">
                <button class="btn btn-danger rounded-circle" aria-label="Remover item do carrinho" onclick="removeItemFromCart('${product._id}')">
                    <i class="bi bi-x"></i>
                </button>
            </td>
            <div class="info ms-1 d-lg-none border-top pt-2">
                <div class="name h5">${product.name}</div>
                <div class="category text-muted">Categoria: ${product.category || 'N/A'}</div>
            </div>
        `;

        // Adicionar a linha ao tbody
        cartContainer.appendChild(cartRow);
    });
}