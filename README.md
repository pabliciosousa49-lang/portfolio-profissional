# Portfólio profissional — José Pablicio Sousa Viana

Meu portfólio reúne projetos de desenvolvimento Full-Stack, trajetória profissional, habilidades e certificados. A proposta é apresentar minha transição da gestão de processos para a tecnologia e demonstrar como aplico meus conhecimentos na construção de soluções digitais.

Desenvolvido com **HTML5, CSS3 e JavaScript ES6+**, com identidade visual escura, detalhes em azul e roxo e layouts adaptados para desktop, tablet e celular.

[Projetos](#projetos-apresentados) · [Execução local](#execução-local) · [Estrutura](#estrutura-do-projeto) · [Contato](#contato)

![Arte da Terra e ondas cósmicas utilizada no fundo da seção de contato](assets/images/contato-terra-cosmica.png)

## Funcionalidades

- **Apresentação profissional:** perfil, habilidades técnicas e informações sobre minha atuação.
- **Minha Jornada:** linha do tempo com descrições expansíveis de experiências e formação.
- **Projetos:** carrossel com navegação por botões, teclado e arraste; pausa durante a interação e painéis com detalhes de cada aplicação.
- **TaskFlow em destaque:** vídeo com reprodução manual, apresentação dos recursos e tecnologias utilizadas.
- **Certificados:** documentos de HTML, CSS, JavaScript e Git e GitHub, com prévia e visualização ampliada.
- **Currículo:** prévia das duas páginas do PDF dentro do portfólio, controles de zoom e acesso ao arquivo original.
- **Contato:** acesso direto ao LinkedIn, GitHub, e-mail e WhatsApp.
- **Animações:** entradas ao rolar a página, efeitos nos cards, zoom nas imagens e transições nos painéis.

## Projetos apresentados

| Projeto | Proposta | Código |
| --- | --- | --- |
| **TaskFlow** | Ambiente de estudos e prática com editor, prévia de código, biblioteca técnica e organização da rotina. | [TaskFlow](https://github.com/pabliciosousa49-lang/TaskFlow) |
| **Página-DevClub-Estudo-AI** | Aplicação JavaScript para estudar trechos de código com integração ao Gemini. | [Page-DevClub-Study](https://github.com/pabliciosousa49-lang/Page-DevClub-Study) |
| **CodeStudy AI** | Versão React para análise de código e apoio ao aprendizado de programação. | [Analitic-Study](https://github.com/pabliciosousa49-lang/Analitic-Study) |
| **Currency Converter** | Conversão entre seis moedas com formatação local e cotações fixas de referência. | [Currency-Converter](https://github.com/pabliciosousa49-lang/Currency-Converter) |
| **Banco Inter Landing Page** | Estudo de interface responsiva inspirado na página do Banco Inter. | [Leading-page-Banco-Inter](https://github.com/pabliciosousa49-lang/Leading-page-Banco-Inter) |

As estrelas exibidas nos cards representam **avaliações pessoais do autor**, independentes da contagem de estrelas no GitHub. As tecnologias listadas em cada projeto pertencem à aplicação apresentada.

## Tecnologias e implementação

| Tecnologia | Utilização no portfólio |
| --- | --- |
| HTML5 | Estrutura semântica, navegação por âncoras, vídeo e painéis com `dialog`. |
| CSS3 | Grid, Flexbox, media queries, gradientes, transições e animações. |
| JavaScript ES6+ | Menu mobile, carrossel, painéis, visualização de documentos e controles de zoom. |
| Intersection Observer | Entrada dos elementos durante a rolagem e controle de visibilidade do carrossel. |

O projeto é estático e pode ser servido diretamente. Não há instalação de dependências ou etapa de build.

## Acessibilidade e responsividade

- Navegação por teclado, foco visível e atalho para o conteúdo principal.
- Painéis com fechamento por botão ou Escape e retorno do foco ao controle de abertura.
- Respeito à preferência `prefers-reduced-motion` nas animações e no carrossel.
- Imagens com textos alternativos e carregamento adiado quando adequado.
- Layout conferido em larguras de 320 a 1920 px.

## Execução local

Clone o repositório:

```bash
git clone https://github.com/pabliciosousa49-lang/portfolio-profissional.git
cd portfolio-profissional
```

Abra `index.html` no navegador. Para executar por HTTP, com **Python 3** instalado, use:

```bash
python -m http.server 5500 --bind 127.0.0.1
```

Acesse [http://127.0.0.1:5500](http://127.0.0.1:5500). O vídeo do TaskFlow e os links externos precisam de conexão com a internet.

## Estrutura do projeto

```text
portfolio-profissional/
├── index.html
├── css/
│   ├── style.css          # Identidade visual e componentes
│   ├── responsive.css     # Adaptações por tamanho de tela
│   └── animations.css     # Entradas, interações e movimento reduzido
├── js/
│   ├── main.js            # Menu, carrossel, painéis e documentos
│   └── scroll.js          # Revelação de elementos durante a rolagem
├── assets/
│   ├── certificados/      # Certificados reais em imagem
│   ├── documentos/        # Currículo em PDF, Word e prévias das páginas
│   ├── icons/             # Ícones e licença dos recursos Devicon
│   └── images/            # Fotografias, projetos e fundos
└── docs/                  # Documentação complementar
```

## Observações sobre os recursos

- O **formulário de contato é demonstrativo** e não envia mensagens. Para entrar em contato, utilize os links de e-mail, redes sociais ou WhatsApp.
- A prévia do currículo utiliza imagens geradas das páginas do PDF. Ao atualizar o documento, atualize também as prévias em `assets/documentos/previas/`.
- Ícones provenientes do Devicon têm sua licença disponível em [assets/icons/LICENCA-devicon.txt](assets/icons/LICENCA-devicon.txt).

## Contato

Estou em busca de oportunidades para contribuir com projetos reais de desenvolvimento de software.

- [LinkedIn](https://www.linkedin.com/in/pablicio-sousa-6554462a0/)
- [GitHub](https://github.com/pabliciosousa49-lang)
- [E-mail](mailto:pabliciosousa49@gmail.com)
- [WhatsApp](https://wa.me/5588996942635)
