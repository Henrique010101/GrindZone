let addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartContainer = document.getElementById('conteudo-cart'); // Seleciona o tbody
const mainCart = document.getElementById('main_cart');
const nomeUsuario =  document.getElementById('nome_usuario');
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
                'Content-Type': 'application/json'
            },
            credentials: 'include', // Garante que o cookie seja enviado
            body: JSON.stringify({ 
                productId: productId,
                quantity: quantity
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Item adicionado ao carrinho:', data);
            // Tratar a resposta e atualizar o front-end
            console.log(data.message); // Exibe a mensagem "Item adicionado ao carrinho."
            updateCartDisplay(data.cart); // Atualiza a exibição do carrinho com os produtos
        } else {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
    }
}

async function fetchCart() {
    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'GET',
            credentials: 'include', // Inclui os cookies
        });

        if (response.ok) {
            const data = await response.json();
            updateCartDisplay(data.cart); // Atualiza a exibição com os itens do carrinho
            renderizarResumoCompra(data.cart);
            document.getElementById('nome_cart').textContent = data.userName;
        } else {
            nomeUsuario.textContent = '';
            nomeUsuario.textContent = 'Seu carrinho';
            cartContainer.innerHTML = `
                <h1 class="d-flex text-center">Carrinho vazio.</h1>
            `;
        }
    } catch (error) {
        console.error('Erro ao buscar o carrinho:', error);
        cartContainer.innerHTML = `
            <h1 class="d-flex align-items-center justify-content-center">Erro ao carregar o carrinho.</h1>
        `;
    }
}

async function removeItemFromCart(productId) {
    console.log("Removendo o produto com o ID:", productId);
    try {
        const response = await fetch(`http://localhost:3000/api/cart/${productId}`, {
            method: 'DELETE',
            credentials: 'include', // Inclui os cookies
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Dados retornados:', data); // Verifique aqui
            updateCartDisplay(data.cart);
            renderizarResumoCompra(data.cart);
        } else {
            console.error('Erro ao remover item do carrinho:', response.statusText);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

const emptyMessage = document.createElement('h5');
emptyMessage.classList.add('text-center', 'fw-semibold', 'mt-5', 'pt-5');

function updateCartDisplay(cart) {
    console.log("Atualizando exibição do carrinho com:", cart);

    const cartTable = document.querySelector("table");
    const cartContent = document.getElementById("conteudo-cart");
    const resumoContainer = document.getElementById("resumo-compra-container");
    const mainCart = document.getElementById("main_cart");

    if (!cartContent) {
        console.error("Elementos do DOM não encontrados.");
        return;
    }

    cartContent.innerHTML = '';
    resumoContainer.innerHTML = '';

    const isCartEmpty = !cart.items || cart.items.length === 0;

    if (cartTable) {
        cartTable.style.display = isCartEmpty ? 'none' : '';
    }

    if (isCartEmpty) {
        console.log("Carrinho vazio.");
        if (!mainCart.contains(emptyMessage)) {
            emptyMessage.textContent = 'Seu carrinho está vazio.';
            mainCart.appendChild(emptyMessage);
        }
        return;
    } else {
        if (mainCart.contains(emptyMessage)) {
            mainCart.removeChild(emptyMessage);
        }
    }

    // Renderiza os produtos no carrinho
    cart.items.forEach(item => {
        const product = item.productId;
        const cartRow = document.createElement('tr');
        cartRow.classList.add('my-auto');

        if (product && product.price) {
            cartRow.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="http://localhost:3000/${product.img}" style="width: 90px" alt="${product.name}" class="img-fluid rounded">
                        <div class="ms-3 d-none d-lg-block">
                            <div class="name h5">${product.name}</div>
                            <div class="category text-muted">Categoria: ${product.category || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="font-cart-td"><strong>R$</strong> ${product.price.toFixed(2)}</td>
                <td class="font-cart-td">
                    <div class="qty d-flex flex-lg-row align-items-center bg-light rounded d-inline-flex rounded-lg-pill">
                        <button class="btn p-0 px-2" onclick="updateQuantity('${product._id}', -1)">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="my-2 my-lg-0 mx-2">${item.quantity}</span>
                        <button class="btn p-0 px-2" onclick="updateQuantity('${product._id}', 1)">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="font-cart-td"><strong>R$</strong> ${(product.price * item.quantity).toFixed(2)}</td>
                <td class="font-cart-td">
                    <button class="btn btn-danger rounded-circle" onclick="removeItemFromCart('${product._id}')">
                        <i class="bi bi-x"></i>
                    </button>
                </td>
            `;
        } else {
            console.error("Produto ou preço não encontrado:", product);
        }

        cartContent.appendChild(cartRow);
    });
}


function renderizarResumoCompra(carrinho) {
    console.log('Renderizando resumo com:', carrinho);
    const resumoContainer = document.getElementById('resumo-compra-container');
    
    // Limpa o conteúdo anterior
    resumoContainer.innerHTML = '';

    if (carrinho.items.length > 0) {
        const subTotal = carrinho.items.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
        const frete = 0; // Adicione lógica para calcular frete, se necessário
        const total = subTotal + frete;

        resumoContainer.innerHTML = `
            <div class="box mb-3 border bg-light">
                <header class="p-3 mb-0 border-bottom h5 resumo-da-compra">Resumo da compra</header>
                <div class="info p-3 resumo-da-compra">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Sub-total</span><span><strong>R$</strong> ${subTotal.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span><i class="bi bi-dash"></i>Frete</span><span>Gratuito</span>
                    </div>
                    <div>
                        <button class="btn btn-link letra-roxa p-0">
                            Adicionar cupom de desconto <i class="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
                <footer class="p-3 bg-secondary text-white d-flex justify-content-between">
                    <span>Total</span><span><strong>R$</strong> ${total.toFixed(2)}</span>
                </footer>
            </div>
            <button class="btn btn-roxo w-100 py-3 text-uppercase">Finalizar Compra</button>
        `;
    }
}

const navCart = document.getElementById('nav_cart');
const removeCart = document.getElementById('button_remove_cart');
document.addEventListener('DOMContentLoaded', function() {
    navCart.addEventListener('click', () => {
        mainCart
        fetchCart();
    });
})