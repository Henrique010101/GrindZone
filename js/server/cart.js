async function addToCart(productId, quantity) {
    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }), // Adicionando a quantidade
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Atualiza a exibição do carrinho após adicionar o item
            await updateCartDisplay();
        } else {
            alert(data.message || 'Erro ao adicionar item ao carrinho.');
        }
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        alert('Erro ao adicionar item ao carrinho.');
    }
}

async function removeFromCart(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            await updateCartDisplay();
        } else {
            alert(data.message || 'Erro ao remover item do carrinho.');
        }
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
        alert('Erro ao remover item do carrinho.');
    }
}

async function fetchCart() {
    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'GET',
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            displayCartItems(data);
        } else {
            alert(data.message || 'Erro ao obter itens do carrinho.');
        }
    } catch (error) {
        console.error('Erro ao obter itens do carrinho:', error);
        alert('Erro ao obter itens do carrinho.');
    }
}

function displayCartItems(cart) {
    const cartContainer = document.querySelector('.cart-items'); // Seletor atualizado
    cartContainer.innerHTML = '';

    if (cart.items.length === 0) {
        cartContainer.innerHTML = '<h2>Seu carrinho está vazio.</h2>';
        return;
    }

    cart.items.forEach(item => {
        const product = item.productId; // O produto populado
        const cartItem = document.createElement('article');
        cartItem.classList.add('d-flex', 'py-1', 'border', 'rounded', 'cart-item');
        cartItem.style.maxHeight = '120px';

        cartItem.innerHTML = `
          <img class="image-cart" src="${product.imageURL}" alt="${product.name}">
          <div class="d-flex justify-content-between w-100 p-1">
            <div class="d-flex descricao-itens-cart flex-column">
              <h5 class="product-cart-name fw-semibold">${product.name}</h5>
                <p class="descricao-item-cart fs-6 fw-light">${product.description}</p>
            </div>
            <div id="valor-item" class="d-flex flex-column align-items-center justify-content-end">
              <span id="product-cart-price-promo" class="product-cart-price-promo fw-light text-decoration-line-through text-black-50">
                ${product.promocao > 0 ? product.promocao.toFixed(2) + ' R$' : ''}</span>
              <span id="product-cart-price" class="product-cart-price">${product.price.toFixed(2)} R$</span>
              <button type="button" data-id="${product._id}" class="btn btn-danger btn-sm mt-auto remove-btn"><i class="bi bi-trash btn-lg me-1"></i>Excluir</button>
            </div>
          </div>
        `;

        cartContainer.appendChild(cartItem);
    });

    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-id');
            removeFromCart(productId);
        });
    });
}

async function updateCartDisplay() {
    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'GET',
            credentials: 'include',
        });

        if (response.ok) {
            const cart = await response.json();
            displayCartItems(cart);
        } else {
            console.error('Erro ao atualizar o carrinho:', response.statusText);
            alert('Erro ao atualizar o carrinho.');
        }
    } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
        alert('Erro ao buscar itens do carrinho.');
    }
}

const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
    button.addEventListener('click', async function (e) {
        e.preventDefault();
        const productId = this.getAttribute('data-id');
        const quantity = 1;

        await addToCart(productId, quantity);
    });
});