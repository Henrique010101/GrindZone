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