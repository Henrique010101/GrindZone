async function addToCart(productId, quatity) {
    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quatity }),
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
        } else {
            alert(data.messsage || 'Erro ao adicionar item ao carrinho.');
        }
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        alert('Erroa ao adicionar item ao carrinho.');
    }
}

async function removeFromCart(productId) {
    try {
        const response = await fetch('http://localhost:3000/api/cart/${productId}', {
            method: 'DELETE',
            credentials: 'include',
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            updadeCartDisplay();
        } else {
            alert(data.message || 'Erro ao remover item do carrinho.');
        }
    } catch (error) {
        console.error('Error ao remover item do carrinho:', error);
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
            alert(data.mesasge || 'Error ao obter itens do carrinho.');
        }
    } catch(error) {
        console.error('Erro ao obter itens do carrinho:', error);
        alert('erro ao obter itens do carrinho')
    }
}

function displayCartItems(cart) {
    const cartContainer = document.getElementById('');
    cartContainer.innerHTML = '';

    if (cart.items.length === 0) {
        cartContainer.innerHTML = <h2>Seu carrinho está vazio.</h2>;
        return;
    }

    cart.items.forEach(item => {
        const product = item.productId;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');

        cartItem.innerHTML = `
        <article style="max-height: 120px;" class="d-flex py-1 border rounded cart-item">
          <img class="image-cart" src="/assets/shape-maple-cbgang.jpg" alt="shape">
          <div class="d-flex justify-content-between w-100 p-1">
            <div class="d-flex descricao-itens-cart flex-column">
              <h5 class="product-cart-name fw-semibold">Shape CB Gang</h5>
                <p class="descricao-item-cart fs-6 fw-light"></p>
            </div>
            <div id="valor-item" class="d-flex flex-column align-items-center justify-content-end">
              <span id="product-cart-price-promo" class="product-cart-price-promo fw-light text-decoration-line-through text-black-50">200,00 R$</span>
              <span id="product-cart-price" class="product-cart-price">200,00 R$</span>
            </div>
          </div>
        </article>
        `

        cartContainer.appendChild(cartItem);
    });
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
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

        if(response.ok) {
            const cart = await response.json();
            displayCartItems(cary);
        } else {
            console.error('Erro ao atualizar o  carrinho:', response.statusText);
            alert('Erro ao atualizar o carrinho.');
        }
    } catch(error) {
        console.error('Error ao buscar itens do carrinho:', error);
        alert('Erro ao buscar itens do carrinho.');
    }
}