import { showAlert } from "../alerts.js";
import { verifySession } from "./User.js";
let addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartContainer = document.getElementById('conteudo-cart');
const mainCart = document.getElementById('main_cart');
const nomeUsuario = document.getElementById('nome_usuario');
console.log(addToCartButtons)


const addCartButtonInterval = setInterval(() => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');

    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            button.addEventListener('click', async function (event) {
                event.preventDefault();

                const isAuthenticated = await verifySession();
                if (!isAuthenticated) {
                    openLoginModal();
                    return;
                }

                const productId = this.getAttribute('data-produto-id');
                if (!productId) {
                    console.error('Erro: productId não encontrado');
                    return;
                }

                const quantity = 1;
                addToCart(productId, quantity);
            });
        });

        clearInterval(addCartButtonInterval);
    }
}, 500);

async function addToCart(productId, quantity) {
    try {
        const response = await fetch('https://grind-zone-api.vercel.app/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            })
        });

        if (response.ok) {
            const data = await response.json();
            showAlert('Produto adicionado com sucesso!', true);
            updateCartDisplay(data.cart);
        } else {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

    } catch (error) {
        showAlert(error.message || 'Erro ao adicionar produto', false);
    }
}

async function fetchCart() {
    try {
        const response = await fetch('https://grind-zone-api.vercel.app/api/cart', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            updateCartDisplay(data.cart);
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

export async function removeItemFromCart(productId) {
    try {
        const response = await fetch(`https://grind-zone-api.vercel.app/api/cart/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            showAlert('Produto excluído com sucesso!', true);
            updateCartDisplay(data.cart);
            renderizarResumoCompra(data.cart);
        } else {
            console.error('Erro ao remover item do carrinho:', response.statusText);
            showAlert('Erro ao excluír produto!', false);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

export async function updateQuantity(productId, change) {
    try {
        const response = await fetch(`https://grind-zone-api.vercel.app/api/cart/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: change }),
            credentials: 'include'
        });

        if (response.ok) {
            const updatedCart = await response.json();
            showAlert('Quantidade alterada com sucesso!', true);
            updateCartDisplay(updatedCart);
            renderizarResumoCompra(updatedCart);
        } else {
            const errorData = await response.json();
            showAlert(`Erro ao alterar a quantidade: ${errorData.message}`, false);
        }
    } catch (error) {
        console.error('Erro no servidor ao alterar a quantidade:', error);
        showAlert('Erro no servidor ao alterar a quantidade!', false);
    }
}

function openLoginModal() {
    const loginModal = new bootstrap.Modal(document.getElementById('modal-perfil'), {
        keyboard: false
    });
    loginModal.show();
}

const emptyMessage = document.createElement('h3');
emptyMessage.classList.add('text-center', 'font-padrao', 'mt-5', 'pt-5');

function updateCartDisplay(cart) {
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
        emptyMessage.textContent = 'Seu carrinho está vazio.';
        if (!mainCart.contains(emptyMessage)) {
            mainCart.appendChild(emptyMessage);
        }
        return;
    } else {
        if (mainCart.contains(emptyMessage)) {
            mainCart.removeChild(emptyMessage);
        }
    }

    cart.items.forEach(item => {
        const product = item.productId;

        if (product && product.price) {
            const cartRow = document.createElement('tr');
            cartRow.classList.add('my-auto');

            cartRow.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="https://grind-zone-api.vercel.app/${product.img}" style="width: 90px" alt="${product.name}" class="img-fluid rounded">
                        <div class="ms-3 d-none d-lg-block">
                            <div class="name h5">${product.name}</div>
                            <div class="category text-muted">Categoria: ${product.category || 'N/A'}</div>
                        </div>
                    </div>
                </td>
                <td class="font-cart-td"><strong>R$</strong> ${product.price.toFixed(2)}</td>
                <td class="font-cart-td">
                    <div class="qty d-flex flex-lg-row align-items-center bg-light rounded d-inline-flex rounded-lg-pill">
                        <button class="btn p-0 px-2 updateCartMinus" data-product-id="${product._id}">
                            <i class="bi bi-dash"></i>
                        </button>
                        <span class="my-2 my-lg-0 mx-2">${item.quantity}</span>
                        <button class="btn p-0 px-2 updateCartPlus" data-product-id="${product._id}">
                            <i class="bi bi-plus"></i>
                        </button>
                    </div>
                </td>
                <td class="font-cart-td"><strong>R$</strong> ${(product.price * item.quantity).toFixed(2)}</td>
                <td class="font-cart-td">
                    <button class="btn btn-danger rounded-circle remove_cart" data-product-id="${product._id}">
                        <i class="bi bi-x"></i>
                    </button>
                </td>
            `;

            cartContent.appendChild(cartRow);
        } else {
            console.error("Produto ou preço não encontrado:", product);
        }
    });

    const removeBtns = document.querySelectorAll('.remove_cart');
    const updateMinusBtns = document.querySelectorAll('.updateCartMinus');
    const updatePlusBtns = document.querySelectorAll('.updateCartPlus');

    removeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product-id');
            removeItemFromCart(productId,);
        });
    });

    updateMinusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product-id');
            updateQuantity(productId, -1);
        });
    });
    
    updatePlusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product-id');
            updateQuantity(productId, 1);
        });
    });
}

function renderizarResumoCompra(carrinho) {

    const resumoContainer = document.getElementById('resumo-compra-container');

    resumoContainer.innerHTML = '';

    if (carrinho.items.length > 0) {
        const subTotal = carrinho.items.reduce((total, item) => total + (item.quantity * item.productId.price), 0);
        const frete = 0;
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
document.addEventListener('DOMContentLoaded', function () {
    navCart.addEventListener('click', () => {
        mainCart
        fetchCart();
    });
})
