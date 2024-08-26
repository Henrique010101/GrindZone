const API_URL = 'http://localhost:3000/api'

document.addEventListener('DOMContentLoaded', function () {
    const todosProdutos = document.getElementById('produtos');

    async function renderizarProdutos() {

        try {
            const response = await fetch(`${API_URL}/products`)
            const produtosHTML = await response.text(); // Supondo que a resposta seja HTML
            todosProdutos.innerHTML = produtosHTML;
        } catch (err) {
            console.error('Erro ao carregar produtos:', err);
            todosProdutos.innerHTML = '<p>Não foi possível carregar os produtos.</p>';
        }
    }
    
    renderizarProdutos(); // Chama a função para renderizar os produtos
});