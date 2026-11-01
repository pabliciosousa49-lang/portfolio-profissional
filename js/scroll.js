// Entradas — Revelar uma única vez, com conteúdo acessível sem JavaScript.
function iniciarEntradasVisuais() {
  const preferencia = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (preferencia.matches || !('IntersectionObserver' in window)) return;

  const elementos = document.querySelectorAll([
    '.sobre-texto', '.sobre-fotografia', '.valor-cartao',
    '.habilidades-cabecalho > *', '.tecnologia-cartao',
    '.trajetoria-texto', '.trajetoria-marco', '.projetos-apresentacao',
    '.detalhes-texto', '.detalhes-apresentacao', '.detalhes-recurso',
    '.certificados-cabecalho', '.certificado-cartao',
    '.contato-texto', '.contato-formulario'
  ].join(','));

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('entrada-visivel');
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });

  elementos.forEach((elemento) => {
    // Conteúdo já alcançado por uma âncora ou pelo histórico aparece imediatamente.
    if (elemento.getBoundingClientRect().top < window.innerHeight) return;
    elemento.classList.add('revelar-entrada');
    observador.observe(elemento);
  });

  document.addEventListener('focusin', (evento) => {
    const elemento = evento.target.closest('.revelar-entrada');
    if (!elemento) return;
    elemento.classList.add('entrada-visivel');
    observador.unobserve(elemento);
  });

  preferencia.addEventListener('change', (evento) => {
    if (!evento.matches) return;
    elementos.forEach((elemento) => elemento.classList.add('entrada-visivel'));
    observador.disconnect();
  });
}

iniciarEntradasVisuais();
