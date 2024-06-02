document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll("#nav-link");
    const inputCheck = document.querySelector('#modo-noturno');
    const elemento = document.querySelector('body');
    const img = document.querySelector('.img-img');
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
            img.src = ativo ? "./assets/GrindZone-dark.png" : "./assets/GrindZone-light.png";
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
        link.addEventListener('click', function() {
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
