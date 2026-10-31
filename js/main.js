// Elementos — Seleção dos controles básicos da página.
const botaoMenu = document.querySelector('.botao-menu');
const menuPrincipal = document.querySelector('#menu-principal');
const imagensPreparadas = document.querySelectorAll('[data-espaco-imagem] > img');
const formularioContato = document.querySelector('.contato-formulario');

// Navegação — O menu continua acessível se o JavaScript não carregar.
function fecharMenu() {
  menuPrincipal.classList.remove('menu-aberto');
  botaoMenu.setAttribute('aria-expanded', 'false');
}

function alternarMenu() {
  const menuAberto = menuPrincipal.classList.toggle('menu-aberto');
  botaoMenu.setAttribute('aria-expanded', String(menuAberto));
}

function tratarTeclaNavegacao(evento) {
  if (evento.key === 'Escape' && menuPrincipal.classList.contains('menu-aberto')) {
    fecharMenu();
    botaoMenu.focus();
  }
}

if (botaoMenu && menuPrincipal) {
  botaoMenu.addEventListener('click', alternarMenu);
  menuPrincipal.querySelectorAll('a').forEach((linkNavegacao) => {
    linkNavegacao.addEventListener('click', fecharMenu);
  });
  document.addEventListener('keydown', tratarTeclaNavegacao);
  document.documentElement.classList.add('javascript-ativo');
}

// Imagens e ícones — Exibir o recurso apenas quando carregar com sucesso.
// O texto alternativo visual permanece disponível em caso de falha do arquivo.
function atualizarImagem(imagem) {
  const imagemDisponivel = imagem.complete && imagem.naturalWidth > 0;
  imagem.parentElement.classList.toggle('imagem-carregada', imagemDisponivel);
}

imagensPreparadas.forEach((imagem) => {
  imagem.addEventListener('load', () => atualizarImagem(imagem));
  imagem.addEventListener('error', () => atualizarImagem(imagem));
  atualizarImagem(imagem);
});

// Contato — Bloquear qualquer envio, inclusive pela tecla Enter.
if (formularioContato) {
  formularioContato.addEventListener('submit', (evento) => {
    evento.preventDefault();
  });
}

// Minha Jornada — Um único marco expandido, com estado acessível e foco preservado.
const botoesTrajetoria = document.querySelectorAll('#experiencia .trajetoria-botao');

function definirEstadoDescricao(botao, expandir) {
  const descricao = document.getElementById(botao.getAttribute('aria-controls'));
  if (!descricao) return;

  const estavaAberta = descricao.classList.contains('descricao-aberta');
  botao.setAttribute('aria-expanded', String(expandir));
  botao.querySelector('.trajetoria-botao-texto').textContent = expandir
    ? 'Ocultar descrição'
    : 'Ver descrição';
  descricao.inert = !expandir;

  if (expandir) {
    descricao.hidden = false;
    // Registrar a altura recolhida antes de iniciar a transição no próximo quadro.
    descricao.getBoundingClientRect();
    requestAnimationFrame(() => {
      if (botao.getAttribute('aria-expanded') === 'true') {
        descricao.classList.add('descricao-aberta');
      }
    });
  } else {
    descricao.classList.remove('descricao-aberta');
    if (!estavaAberta || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      descricao.hidden = true;
    }
  }
}

botoesTrajetoria.forEach((botao) => {
  const descricao = document.getElementById(botao.getAttribute('aria-controls'));
  if (!descricao) return;

  botao.addEventListener('click', () => {
    const expandir = botao.getAttribute('aria-expanded') !== 'true';
    botoesTrajetoria.forEach((outroBotao) => {
      if (outroBotao !== botao && outroBotao.getAttribute('aria-expanded') === 'true') {
        definirEstadoDescricao(outroBotao, false);
      }
    });
    definirEstadoDescricao(botao, expandir);
  });

  const finalizarRecolhimento = (evento) => {
    if (evento.target === descricao && botao.getAttribute('aria-expanded') === 'false') {
      descricao.hidden = true;
    }
  };
  descricao.addEventListener('transitionend', finalizarRecolhimento);
  descricao.addEventListener('transitioncancel', finalizarRecolhimento);
});
