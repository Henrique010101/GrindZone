document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll(".nav-link");
    const inputCheck = document.querySelector('#modo-noturno');
    const elemento = document.querySelector('body');
    const img = document.querySelectorAll('.img-img');
    const spanBanner = document.querySelector('.carousel');

    // Função para aplicar o modo noturno
    const aplicarModoNoturno = (ativo) => {
        const modo = ativo ? 'dark' : 'light';
        elemento.setAttribute("data-bs-theme", modo);
        localStorage.setItem('modoNoturnoAtivo', ativo);

        if (spanBanner) {
            if (ativo) {
                spanBanner.classList.remove('carousel-dark');
            } else {
                spanBanner.classList.add('carousel-dark');
            }
        }

        if (img) {
            img.forEach(imagem => {
                imagem.src = ativo ? "./assets/GrindZone_logo_dark.png" : "./assets/GrindZone_logo.png";
            });
        }
    };

    // Sincronizar o estado do modo noturno ao carregar a página
    const modoNoturnoAtivo = localStorage.getItem('modoNoturnoAtivo') === 'true';
    aplicarModoNoturno(modoNoturnoAtivo);
    if (inputCheck) {
        inputCheck.checked = modoNoturnoAtivo;
    }

    // Adicionar evento de clique para mudar a classe active nos links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Adicionar evento de clique para o modo noturno
    if (inputCheck) {
        inputCheck.addEventListener('click', () => {
            aplicarModoNoturno(inputCheck.checked);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const btnMoletom = document.getElementById('Moletom');
    const btnShape = document.getElementById('Shape');
    const btnTruck = document.getElementById('Truck');
    const btnRolamento = document.getElementById('Rolamento');
    const btnRodinha = document.getElementById('Rodinha');
    const btnTenis = document.getElementById('Tênis');

    // Mapeamento entre IDs e valores de categoria
    const categorias = {
        '1': 'Shape',
        '2': 'Rodinha',
        '3': 'Rolamento',
        '4': 'Truck',
        '5': 'Moletom',
        '6': 'Tênis'
    };

    function redirecionarParaProdutos(categoria) {
        window.location.href = `./produtos.html?categoria=${categoria}`;
    }

    // Verifique se os elementos existem antes de adicionar o listener
    if (btnMoletom) btnMoletom.addEventListener('click', () => redirecionarParaProdutos(categorias['5']));
    if (btnShape) btnShape.addEventListener('click', () => redirecionarParaProdutos(categorias['1']));
    if (btnTruck) btnTruck.addEventListener('click', () => redirecionarParaProdutos(categorias['4']));
    if (btnRolamento) btnRolamento.addEventListener('click', () => redirecionarParaProdutos(categorias['3']));
    if (btnRodinha) btnRodinha.addEventListener('click', () => redirecionarParaProdutos(categorias['2']));
    if (btnTenis) btnTenis.addEventListener('click', () => redirecionarParaProdutos(categorias['6']));
});

