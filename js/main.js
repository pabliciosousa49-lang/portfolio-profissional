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
