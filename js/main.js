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

// Projetos — Movimento contínuo com pausa, navegação manual e arraste.
function iniciarCarrosselProjetos() {
  const carrossel = document.querySelector('.carrossel-projetos');
  if (!carrossel) return;
  const janela = carrossel.querySelector('.carrossel-janela');
  const lista = carrossel.querySelector('.projetos-lista');
  const originais = [...lista.children];
  const anterior = carrossel.querySelector('.carrossel-anterior');
  const proximo = carrossel.querySelector('.carrossel-proximo');
  const movimento = carrossel.querySelector('.carrossel-movimento');
  const indicador = carrossel.querySelector('.carrossel-posicao');
  const instrucoes = carrossel.querySelector('#carrossel-instrucoes');
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const telaPequena = window.matchMedia('(max-width: 767px)');
  const pausas = new Set();
  const VELOCIDADE_CARROSSEL = 24;
  let posicao = 0;
  let periodo = 0;
  let passo = 0;
  let quadro = null;
  let instanteAnterior = null;
  let navegacao = null;
  let ponteiro = null;
  let arrastou = false;
  let pausaEscolhida = false;
  let visivel = true;

  // As cópias continuam clicáveis pelo mouse, sem repetir itens na leitura ou tabulação.
  originais.forEach((original) => {
    const copia = original.cloneNode(true);
    copia.setAttribute('aria-hidden', 'true');
    copia.dataset.copia = 'true';
    copia.querySelectorAll('[id]').forEach((elemento) => elemento.removeAttribute('id'));
    copia.querySelectorAll('a, button, [tabindex]').forEach((elemento) => {
      elemento.setAttribute('tabindex', '-1');
    });
    copia.querySelectorAll('img').forEach((imagem) => {
      imagem.addEventListener('load', () => atualizarImagem(imagem));
      imagem.addEventListener('error', () => atualizarImagem(imagem));
      atualizarImagem(imagem);
    });
    lista.append(copia);
  });

  function normalizar(valor) {
    return periodo ? ((valor % periodo) + periodo) % periodo : 0;
  }

  function apresentarPosicao() {
    posicao = normalizar(posicao);
    lista.style.transform = `translate3d(${-posicao}px, 0, 0)`;
    const indice = passo ? Math.floor((posicao + 1) / passo) % originais.length : 0;
    indicador.textContent = `${String(indice + 1).padStart(2, '0')} / ${String(originais.length).padStart(2, '0')}`;
  }

  function podeMoverAutomaticamente() {
    return periodo > 0 && !pausaEscolhida && !reduzirMovimento.matches && !telaPequena.matches
      && !pausas.size && !ponteiro && !document.hidden && visivel;
  }

  function agendarMovimento() {
    if (quadro === null && (navegacao || podeMoverAutomaticamente())) {
      instanteAnterior = null;
      quadro = requestAnimationFrame(animarCarrossel);
    }
  }

  function animarCarrossel(instante) {
    quadro = null;
    const intervalo = instanteAnterior === null ? 0 : Math.min(instante - instanteAnterior, 50);
    instanteAnterior = instante;
    if (navegacao) {
      navegacao.decorrido += intervalo;
      const progresso = Math.min(navegacao.decorrido / 350, 1);
      const suavizacao = 1 - (1 - progresso) ** 3;
      posicao = navegacao.inicio + navegacao.distancia * suavizacao;
      if (progresso === 1) navegacao = null;
      apresentarPosicao();
    } else if (podeMoverAutomaticamente()) {
      posicao += VELOCIDADE_CARROSSEL * intervalo / 1000;
      apresentarPosicao();
    }
    if (navegacao || podeMoverAutomaticamente()) quadro = requestAnimationFrame(animarCarrossel);
  }

  function navegarAte(destino) {
    if (!periodo) return;
    if (reduzirMovimento.matches) {
      navegacao = null;
      posicao = destino;
      apresentarPosicao();
    } else {
      navegacao = { inicio: posicao, distancia: destino - posicao, decorrido: 0 };
      agendarMovimento();
    }
  }

  function avancarProjeto(direcao) {
    if (passo <= 0) return;
    navegarAte((Math.round(posicao / passo) + direcao) * passo);
  }

  function medirCarrossel() {
    const proporcao = periodo ? posicao / periodo : 0;
    passo = originais[0].getBoundingClientRect().width + parseFloat(getComputedStyle(lista).columnGap);
    periodo = lista.children[originais.length].offsetLeft - originais[0].offsetLeft;
    navegacao = null;
    posicao = proporcao * periodo;
    apresentarPosicao();
    agendarMovimento();
  }

  function atualizarPreferencias() {
    const desativado = reduzirMovimento.matches || telaPequena.matches;
    movimento.disabled = desativado;
    movimento.setAttribute('aria-pressed', String(pausaEscolhida));
    movimento.textContent = desativado ? 'Movimento desativado' : pausaEscolhida ? 'Retomar movimento' : 'Pausar movimento';
    instrucoes.textContent = desativado
      ? 'Use os botões, as setas do teclado ou arraste horizontalmente para explorar os projetos.'
      : 'O movimento pausa ao passar o mouse ou usar o teclado. Você também pode arrastar os cards.';
    if (reduzirMovimento.matches && navegacao) {
      posicao = navegacao.inicio + navegacao.distancia;
      navegacao = null;
      apresentarPosicao();
    }
    agendarMovimento();
  }

  anterior.addEventListener('click', () => avancarProjeto(-1));
  proximo.addEventListener('click', () => avancarProjeto(1));
  movimento.addEventListener('click', () => {
    pausaEscolhida = !pausaEscolhida;
    atualizarPreferencias();
  });
  carrossel.addEventListener('projeto-visualizacao', (evento) => {
    if (evento.detail.aberta) {
      pausas.add('painel');
      navegacao = null;
    } else {
      pausas.delete('painel');
      agendarMovimento();
    }
  });
  carrossel.addEventListener('projeto-reproducao', (evento) => {
    if (evento.detail.ativa) {
      pausas.add('video');
      navegacao = null;
    } else {
      pausas.delete('video');
      agendarMovimento();
    }
  });
  carrossel.addEventListener('mouseenter', () => pausas.add('mouse'));
  carrossel.addEventListener('mouseleave', () => { pausas.delete('mouse'); agendarMovimento(); });
  carrossel.addEventListener('focusin', (evento) => {
    pausas.add('foco');
    const item = evento.target.closest('.projeto-item');
    const indice = originais.indexOf(item);
    if (indice < 0) return;
    const inicio = indice * passo - posicao;
    if (inicio < -1 || inicio + item.getBoundingClientRect().width > janela.clientWidth + 1) {
      navegacao = null;
      posicao = indice * passo;
      apresentarPosicao();
    }
  });
  carrossel.addEventListener('focusout', (evento) => {
    if (!carrossel.contains(evento.relatedTarget)) { pausas.delete('foco'); agendarMovimento(); }
  });
  janela.addEventListener('keydown', (evento) => {
    if (evento.target !== janela) return;
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(evento.key)) return;
    evento.preventDefault();
    if (evento.key === 'Home') navegarAte(0);
    else if (evento.key === 'End') navegarAte((originais.length - 1) * passo);
    else avancarProjeto(evento.key === 'ArrowRight' ? 1 : -1);
  });

  janela.addEventListener('pointerdown', (evento) => {
    if (!evento.isPrimary || evento.button !== 0) return;
    ponteiro = { id: evento.pointerId, x: evento.clientX, y: evento.clientY, origem: posicao };
    navegacao = null;
    arrastou = false;
  });
  janela.addEventListener('pointermove', (evento) => {
    if (!ponteiro || evento.pointerId !== ponteiro.id) return;
    const deslocamento = evento.clientX - ponteiro.x;
    const vertical = Math.abs(evento.clientY - ponteiro.y);
    if (!arrastou && vertical > 8 && vertical > Math.abs(deslocamento)) {
      ponteiro = null;
      agendarMovimento();
      return;
    }
    if (!arrastou && Math.abs(deslocamento) > 8) {
      arrastou = true;
      janela.setPointerCapture(evento.pointerId);
      carrossel.classList.add('carrossel-arrastando');
    }
    if (arrastou) {
      evento.preventDefault();
      posicao = ponteiro.origem - deslocamento;
      apresentarPosicao();
    }
  });
  function encerrarArraste(evento) {
    if (!ponteiro || evento.pointerId !== ponteiro.id) return;
    if (janela.hasPointerCapture(evento.pointerId)) janela.releasePointerCapture(evento.pointerId);
    ponteiro = null;
    carrossel.classList.remove('carrossel-arrastando');
    agendarMovimento();
  }
  janela.addEventListener('pointerup', encerrarArraste);
  janela.addEventListener('pointercancel', encerrarArraste);
  janela.addEventListener('lostpointercapture', encerrarArraste);
  janela.addEventListener('click', (evento) => {
    if (arrastou && evento.detail > 0) { evento.preventDefault(); evento.stopPropagation(); }
  }, true);
  janela.addEventListener('dragstart', (evento) => evento.preventDefault());
  document.addEventListener('visibilitychange', agendarMovimento);
  reduzirMovimento.addEventListener('change', atualizarPreferencias);
  telaPequena.addEventListener('change', atualizarPreferencias);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entrada]) => { visivel = entrada.isIntersecting; agendarMovimento(); }).observe(carrossel);
  }
  carrossel.classList.add('carrossel-ativo');
  carrossel.querySelector('.carrossel-controles').hidden = false;
  medirCarrossel();
  atualizarPreferencias();
  if ('ResizeObserver' in window) new ResizeObserver(medirCarrossel).observe(janela);
  else window.addEventListener('resize', medirCarrossel);
}

// Projetos — Painéis acessíveis compartilhando a mesma interação.
function iniciarPaineisProjetos() {
  const secao = document.querySelector('#projetos');
  if (!secao) return;
  const carrossel = secao.querySelector('.carrossel-projetos');
  const retornos = new WeakMap();

  function informarVisualizacao(aberta) {
    carrossel.dispatchEvent(new CustomEvent('projeto-visualizacao', { detail: { aberta } }));
  }

  secao.addEventListener('click', (evento) => {
    const botao = evento.target.closest('[data-projeto-detalhes]');
    if (!botao) return;
    const painel = document.getElementById(botao.getAttribute('aria-controls'));
    if (!painel || !painel.matches('.projeto-painel') || painel.open) return;
    const retorno = botao.closest('[data-copia]')
      ? secao.querySelector('.projeto-item:not([data-copia]) [aria-controls="' + painel.id + '"]')
      : botao;
    retornos.set(painel, retorno);
    informarVisualizacao(true);
    document.querySelector('.detalhes-video')?.pause();
    document.documentElement.classList.add('projeto-painel-aberto');
    painel.showModal();
    painel.scrollTop = 0;
    const video = painel.querySelector('.projeto-video');
    if (video) {
      const aviso = painel.querySelector('.projeto-video-ajuda');
      aviso.textContent = 'Use os controles para assistir ao vídeo. O carrossel fica pausado enquanto o painel estiver aberto.';
      painel.querySelector('.projeto-video-alternativa').hidden = true;
      video.src = video.dataset.origem;
      video.load();
    }
  });

  secao.querySelectorAll('.projeto-painel').forEach((painel) => {
    painel.querySelector('.projeto-painel-fechar').addEventListener('click', () => painel.close());
    painel.addEventListener('click', (evento) => {
      if (evento.target === painel) painel.close();
    });
    painel.addEventListener('close', () => {
      const video = painel.querySelector('.projeto-video');
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
      document.documentElement.classList.remove('projeto-painel-aberto');
      const retorno = retornos.get(painel);
      if (retorno?.isConnected) retorno.focus({ preventScroll: true });
      informarVisualizacao(false);
    });
    const video = painel.querySelector('.projeto-video');
    video?.addEventListener('error', () => {
      if (!painel.open) return;
      painel.querySelector('.projeto-video-ajuda').textContent = 'Não foi possível carregar o vídeo. Tente novamente ou abra o arquivo diretamente.';
      painel.querySelector('.projeto-video-alternativa').hidden = false;
    });
  });
}

// Projeto Destaque — Reprodução nativa sem início automático.
function iniciarVideoDestaqueTaskFlow() {
  const area = document.querySelector('.detalhes-demonstracao');
  const video = area?.querySelector('.detalhes-video');
  const carrossel = document.querySelector('.carrossel-projetos');
  if (!video || !carrossel) return;
  function atualizarPausaVideo() {
    const interagindo = area.matches(':hover') || area.contains(document.activeElement);
    const ativa = (!video.paused && !video.ended) || interagindo;
    carrossel.dispatchEvent(new CustomEvent('projeto-reproducao', { detail: { ativa } }));
  }
  ['play', 'pause', 'ended'].forEach((evento) => video.addEventListener(evento, atualizarPausaVideo));
  ['pointerenter', 'pointerleave', 'focusin'].forEach((evento) => area.addEventListener(evento, atualizarPausaVideo));
  area.addEventListener('focusout', () => requestAnimationFrame(atualizarPausaVideo));
  video.addEventListener('error', () => {
    area.querySelector('.detalhes-video-alternativa').hidden = false;
    area.querySelector('figcaption').textContent = 'Não foi possível carregar o vídeo. Você pode abri-lo diretamente pelo link abaixo.';
    atualizarPausaVideo();
  });
}

iniciarCarrosselProjetos();
iniciarPaineisProjetos();
iniciarVideoDestaqueTaskFlow();

// Certificados — Imagem completa em painel nativo, com retorno do foco.
function iniciarVisualizacaoCertificados() {
  const secao = document.querySelector('#certificados');
  const painel = secao?.querySelector('#certificado-visualizacao');
  if (!painel || typeof painel.showModal !== 'function') return;
  const imagem = painel.querySelector('.certificado-documento');
  const titulo = painel.querySelector('#certificado-visualizacao-titulo');
  const original = painel.querySelector('.certificado-original');
  let retorno;

  secao.addEventListener('click', (evento) => {
    const link = evento.target.closest('[data-visualizar-certificado]');
    if (!link || evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
    evento.preventDefault();
    const cartao = link.closest('.certificado-cartao');
    const miniatura = cartao.querySelector('.certificado-miniatura img');
    titulo.textContent = cartao.querySelector('h4').textContent;
    imagem.src = link.href;
    imagem.alt = miniatura.alt;
    imagem.setAttribute('width', miniatura.getAttribute('width'));
    imagem.setAttribute('height', miniatura.getAttribute('height'));
    original.href = link.href;
    retorno = link;
    document.documentElement.classList.add('certificado-visualizacao-aberta');
    painel.showModal();
    painel.scrollTop = 0;
  });

  painel.querySelector('.certificado-fechar').addEventListener('click', () => painel.close());
  painel.addEventListener('click', (evento) => {
    if (evento.target !== painel) return;
    const limites = painel.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom) painel.close();
  });
  painel.addEventListener('close', () => {
    document.documentElement.classList.remove('certificado-visualizacao-aberta');
    if (retorno?.isConnected) retorno.focus({ preventScroll: true });
  });
}

iniciarVisualizacaoCertificados();

// Currículo — Prévia das páginas do PDF com zoom e acesso ao original.
function iniciarVisualizacaoCurriculo() {
  const link = document.querySelector('[data-visualizar-curriculo]');
  const painel = document.querySelector('#curriculo-visualizacao');
  if (!link || !painel || typeof painel.showModal !== 'function') return;
  const documento = painel.querySelector('.curriculo-documento');
  const reduzir = painel.querySelector('[data-curriculo-zoom="reduzir"]');
  const ampliar = painel.querySelector('[data-curriculo-zoom="ampliar"]');
  const escala = painel.querySelector('.curriculo-escala');
  let zoom = 100;

  function ajustarZoom(valor) {
    zoom = Math.max(100, Math.min(250, valor));
    documento.style.setProperty('--largura-curriculo', zoom + '%');
    escala.textContent = zoom + '%';
    reduzir.disabled = zoom === 100;
    ampliar.disabled = zoom === 250;
  }

  reduzir.addEventListener('click', () => ajustarZoom(zoom - 25));
  ampliar.addEventListener('click', () => ajustarZoom(zoom + 25));

  link.addEventListener('click', (evento) => {
    if (evento.button !== 0 || evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
    evento.preventDefault();
    ajustarZoom(100);
    document.documentElement.classList.add('curriculo-visualizacao-aberta');
    painel.showModal();
    painel.scrollTop = 0;
    documento.scrollTop = 0;
  });

  painel.querySelector('.curriculo-fechar').addEventListener('click', () => painel.close());
  painel.addEventListener('click', (evento) => {
    if (evento.target !== painel) return;
    const limites = painel.getBoundingClientRect();
    if (evento.clientX < limites.left || evento.clientX > limites.right || evento.clientY < limites.top || evento.clientY > limites.bottom) painel.close();
  });
  painel.addEventListener('close', () => {
    document.documentElement.classList.remove('curriculo-visualizacao-aberta');
    link.focus({ preventScroll: true });
  });
}

iniciarVisualizacaoCurriculo();
