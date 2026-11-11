# Feature Specification: Redesign do portfólio

**Feature Branch**: `docs/redesign-spec` (implementação em uma branch por parte, PR para `dev`)

**Created**: 2026-11-11

**Status**: Draft

**Input**: User description: "Redesign do portfólio conforme o protótipo aprovado no Figma (fileKey nuxSe49ViC40aYOcI0nImY): direção editorial minimalista com um momento cinematográfico por página, accent único, títulos de seção grandes, assinatura "inspect outline" (hero, hover de títulos, 404 tracejada "elemento não encontrado", focus ring). Telas: Home (hero, Stack nome + "desde ano", Projetos com destaque, Experiência com atual completa e antigas compactas em accordion, Contato com form), Projetos (layout de 1 projeto; filtros e contador só com 4+), Detalhe do projeto, 404, menu mobile, formulário com estados (erros, enviando, enviado, falha) inline. Voz do contato: "Vamos conversar?" / "Escrever mensagem" / "Enviar mensagem" → "Mensagem enviada.". Só campos que o Hygraph tem. Bilíngue PT/EN. Diretório: specs/002-redesign."

**Fonte de verdade visual**: Figma `nuxSe49ViC40aYOcI0nImY`. Desktop 1440: Home 6:21, Form 27:314, Projetos 9:137, referência 4+ 9:137→24:242, Detalhe 9:227, 404 12:385. Mobile 390: Home 8:29, Menu 8:228, Projetos 11:328, Detalhe 11:402, 404 12:583. Componentes 4:3, Motion 12:21.

## User Scenarios & Testing *(mandatory)*

Visitantes típicos: recrutadores e tech leads avaliando o Eduardo para uma vaga de front-end ou QA, e
pessoas com um projeto em mente. Eles chegam por um link (LinkedIn, currículo), passam poucos
minutos e decidem se entram em contato.

### User Story 1 - Entender quem é o Eduardo em segundos (Priority: P1)

A pessoa abre a Home e, sem rolar, entende nome, papel atual, uma frase de apresentação e como
falar com ele. O topo tem o único momento cinematográfico da página: o nome se revela e o
contorno de inspeção se desenha em volta dele.

**Why this priority**: é a primeira impressão; se falhar, nada mais é visto.

**Independent Test**: abrir a Home em 1440 e em 390 e verificar, só com a primeira tela, nome,
papel, apresentação, emprego atual, links sociais e o botão "Vamos conversar".

**Acceptance Scenarios**:

1. **Given** primeira visita da sessão, **When** a Home carrega, **Then** o nome se revela, a foto
   aparece de baixo para cima, apresentação e botões entram em seguida e o contorno de inspeção
   desenha em volta do nome com a etiqueta de medidas; tudo termina em até 2,6 s e a página já
   aceita clique antes de 1 s.
2. **Given** a pessoa voltou para a Home na mesma sessão, **When** a página carrega, **Then** o
   topo aparece pronto, sem repetir a entrada.
3. **Given** o sistema pede "reduzir movimento", **When** a Home carrega, **Then** o conteúdo
   aparece com fade curto, sem deslocamento, e o contorno não se desenha.
4. **Given** existe uma experiência sem data de fim, **When** a Home carrega, **Then** o topo mostra
   "Agora: <cargo> na <empresa>" com um ponto indicador; sem experiência atual, a linha não
   aparece.
5. **Given** a Home carregou, **When** a pessoa clica em "Vamos conversar", **Then** a página rola
   até o formulário de contato e o foco vai para o primeiro campo.

---

### User Story 2 - Mandar uma mensagem sem sair do site (Priority: P1)

A pessoa preenche nome, e-mail e mensagem e recebe confirmação clara ali mesmo. Erros dizem como
corrigir, e uma falha não apaga o que ela escreveu.

**Why this priority**: o contato é o objetivo de negócio do portfólio.

**Independent Test**: preencher e enviar o form com dados válidos, inválidos e com o envio
falhando, observando mensagens na tela e o que um leitor de tela anuncia.

**Acceptance Scenarios**:

1. **Given** campos vazios ou inválidos, **When** a pessoa envia, **Then** cada campo com erro
   mostra uma mensagem logo abaixo dizendo como corrigir (ex.: "Falta o domínio. Use algo como
   nome@gmail.com."), o foco vai para o primeiro campo com erro e os erros são anunciados.
2. **Given** um campo com erro, **When** a pessoa sai do campo depois de corrigi-lo, **Then** o erro
   desaparece sem esperar novo envio.
3. **Given** dados válidos, **When** a pessoa envia, **Then** campos e botão ficam desabilitados e o
   botão mostra "Enviando…" com indicador de progresso até a resposta.
4. **Given** o envio deu certo, **When** a resposta chega, **Then** o formulário é substituído pela
   confirmação "Mensagem enviada." com o texto de apoio e o botão "Enviar outra mensagem", e o
   foco vai para o título da confirmação.
5. **Given** o envio falhou, **When** a resposta chega, **Then** os dados continuam nos campos, um
   aviso "Não consegui enviar agora." com saída alternativa (LinkedIn) aparece acima do botão, que
   passa a dizer "Tentar de novo".
6. **Given** a confirmação está na tela, **When** a pessoa clica em "Enviar outra mensagem",
   **Then** o formulário volta vazio, com foco no primeiro campo.

---

### User Story 3 - Avaliar a stack e a experiência (Priority: P2)

A pessoa rola a Home e vê a stack (tecnologia + "desde <ano>") e a experiência: a posição atual
completa e as anteriores em linhas compactas que abrem sob demanda.

**Why this priority**: é o que o recrutador compara com a vaga.

**Independent Test**: rolar a Home, conferir stack e experiências contra o CMS e abrir/fechar as
experiências anteriores com mouse e teclado.

**Acceptance Scenarios**:

1. **Given** as tecnologias cadastradas no CMS, **When** a seção Stack aparece, **Then** cada uma
   mostra só o nome e "desde <ano de início>" (sem ícone, sem barra), em duas colunas no desktop e
   uma no mobile.
2. **Given** várias experiências, **When** a seção Experiência aparece, **Then** a atual (sem data
   de fim) mostra período, duração calculada (ex.: "1 ano e 9 meses"), cargo, empresa com link,
   descrição e tecnologias; as anteriores mostram uma linha com período, cargo, empresa e
   duração, mais um controle "+".
3. **Given** uma experiência anterior fechada, **When** a pessoa ativa o "+" com clique, Enter ou
   Espaço, **Then** a descrição abre empurrando o conteúdo, o "+" vira "×" e o estado aberto é
   anunciado; ativar de novo fecha.
4. **Given** o CMS tem mais de uma experiência sem data de fim, **When** a seção renderiza,
   **Then** só a de início mais recente é tratada como atual.

---

### User Story 4 - Conhecer os projetos (Priority: P2)

A pessoa vê o projeto em destaque na Home, abre a página Projetos e entra no detalhe para ver
o que é, contexto, links, descrição e telas.

**Why this priority**: prova de trabalho; hoje há um projeto, mas o layout precisa escalar.

**Independent Test**: navegar Home → Projetos → Detalhe → voltar, com 1 projeto no CMS; e verificar
o layout de lista com 4+ projetos usando dados de teste.

**Acceptance Scenarios**:

1. **Given** um projeto em destaque, **When** a seção Projetos da Home entra na tela ao rolar,
   **Then** a imagem cresce até ocupar o bloco e depois título, descrição curta, tecnologias e
   "Ver projeto" aparecem; com reduzir movimento, tudo já aparece pronto.
2. **Given** menos de 4 projetos, **When** a página Projetos abre, **Then** cada projeto aparece em
   bloco de destaque (imagem, rótulo de contexto, título, descrição, tecnologias, "Ver projeto"),
   sem filtros nem contador, seguido da linha "Mais projetos chegando…" com link para o GitHub.
3. **Given** 4 ou mais projetos, **When** a página Projetos abre, **Then** aparecem o contador
   ("N projetos"), filtros por tecnologia (começando em "Todos") e uma lista de linhas; filtrar
   mostra só os projetos com aquela tecnologia e atualiza o contador.
4. **Given** a lista de 4+ e um mouse, **When** a pessoa passa sobre uma linha, **Then** o fundo
   acende, a seta se move levemente, o título ganha o contorno de inspeção e uma prévia da imagem
   segue o cursor; no toque ou com reduzir movimento, a prévia fica fixa ou não aparece.
5. **Given** o detalhe de um projeto, **When** a página abre, **Then** mostra "Todos os projetos",
   título com contorno, "O que é", "Contexto", links "Repositório" e "Ver online" (só os que
   existem), imagem principal, "Sobre o projeto" com tecnologias e descrição, e um bloco por seção
   (título + imagem) cadastrada no CMS.
6. **Given** só existe um projeto publicado, **When** o detalhe termina, **Then** aparece "Por
   enquanto, este é o único projeto publicado." com link de volta para a lista.

---

### User Story 5 - Ler tudo em inglês (Priority: P2)

A pessoa troca PT/EN no cabeçalho e todo o conteúdo e a interface mudam de idioma, sem trocar de
URL.

**Why this priority**: recrutadores de fora do Brasil; o recurso já existe e não pode regredir.

**Independent Test**: alternar o idioma em cada página e conferir textos de interface e conteúdo
do CMS.

**Acceptance Scenarios**:

1. **Given** PT ativo, **When** a pessoa escolhe EN, **Then** a pílula desliza para EN, os textos
   trocam com fade curto e a preferência fica salva para as próximas visitas.
2. **Given** um conteúdo sem tradução em EN, **When** EN está ativo, **Then** o texto em PT aparece
   no lugar, sem lacunas.
3. **Given** um leitor de tela, **When** o idioma muda, **Then** o idioma do documento muda junto.

---

### User Story 6 - Navegar no celular (Priority: P2)

No celular, o cabeçalho mostra nome, seletor de idioma e "Menu". O menu abre em tela cheia com
links grandes, redes sociais e "Vamos conversar".

**Why this priority**: boa parte dos acessos vem do LinkedIn no celular.

**Independent Test**: em 390 px, abrir e fechar o menu, navegar por ele e usar só teclado.

**Acceptance Scenarios**:

1. **Given** tela estreita, **When** a pessoa toca em "Menu", **Then** o menu abre em círculo a
   partir do botão, os links (Home, Projetos, Experiência, Contato) sobem um a um, o botão vira
   "Fechar" e a página de trás não rola.
2. **Given** o menu aberto, **When** a pessoa toca num link, aperta Esc ou toca em "Fechar",
   **Then** o menu fecha em até 180 ms e o foco volta ao botão "Menu" (ou vai ao destino do link).
3. **Given** o menu aberto, **When** a pessoa navega com Tab, **Then** o foco fica preso dentro do
   menu.
4. **Given** a página atual, **When** o menu ou a navegação desktop renderiza, **Then** o item
   atual tem o ponto indicador e é anunciado como página atual.

---

### User Story 7 - Achar o caminho numa página inexistente (Priority: P3)

Quem cai num link quebrado vê um 404 que conversa com a identidade do site e tem saída clara.

**Why this priority**: raro, mas é onde a assinatura brilha e evita abandono.

**Independent Test**: abrir uma URL inexistente e um slug de projeto inexistente.

**Acceptance Scenarios**:

1. **Given** uma URL que não existe, **When** a página abre, **Then** aparece "404" grande com o
   contorno de inspeção tracejado e a etiqueta "elemento não encontrado" (decorativos, ignorados
   por leitor de tela), o título "Essa página não existe.", o texto de apoio e os botões "Voltar
   para a Home" e "Ver projetos".
2. **Given** um slug de projeto inexistente, **When** a página abre, **Then** o mesmo 404 aparece.

---

### User Story 8 - Usar tudo só com teclado (Priority: P1)

Quem navega por teclado vê sempre onde está e alcança todas as ações.

**Why this priority**: acessibilidade é inegociável (constitution IV).

**Independent Test**: percorrer cada página só com Tab, Shift+Tab, Enter, Espaço e Esc.

**Acceptance Scenarios**:

1. **Given** qualquer elemento interativo, **When** recebe foco por teclado, **Then** mostra o focus
   ring (contorno de inspeção sem etiqueta) com contraste suficiente; o clique com mouse não
   mostra o anel.
2. **Given** qualquer página, **When** a pessoa aperta Tab pela primeira vez, **Then** aparece um
   link "Pular para o conteúdo".
3. **Given** a pessoa rolou mais de 1,5 tela, **When** o botão "Voltar ao topo" aparece e é
   ativado, **Then** a página volta ao topo e o foco vai para o início do conteúdo.

### Edge Cases

- **CMS fora do ar ou sem dados**: seções sem conteúdo somem ou mostram estado vazio discreto; a
  página nunca quebra nem mostra texto em branco. Sem projeto em destaque, a seção Projetos da
  Home some.
- **Projeto sem imagem, sem seções, sem link de repositório ou de site**: o bloco correspondente
  não aparece; links ausentes não viram botões mortos.
- **Experiência sem descrição ou sem tecnologias**: a linha compacta não mostra o "+".
- **Nomes e textos longos** (ex.: título de projeto com 60+ caracteres, cargo longo): quebram
  linha sem sobrepor elementos nem gerar rolagem horizontal em 360 px.
- **Títulos gigantes no mobile**: o título de seção cabe em 360 px sem cortar palavras.
- **Mensagem do form com 500 caracteres** (limite): é aceita; acima disso, o campo não deixa
  digitar e o limite é informado.
- **Envio duplo**: cliques repetidos durante o envio não disparam outra mensagem.
- **JavaScript desabilitado ou lento**: conteúdo e links continuam legíveis e navegáveis; as
  animações de entrada não deixam conteúdo invisível.
- **Filtro sem resultado** (4+): mostra "Nenhum projeto com <tecnologia>" e um jeito de limpar.
- **Social sem nome preenchido**: o rótulo do link cai para o domínio da URL (github.com → "GitHub").

## Requirements *(mandatory)*

### Functional Requirements

**Identidade visual**

- **FR-001**: Todas as páginas MUST seguir a direção editorial aprovada no Figma: fundo escuro,
  um único accent, títulos de seção grandes (112 px desktop / 64 px mobile no design aprovado) e
  no máximo um momento cinematográfico por página.
- **FR-002**: O contorno de inspeção MUST aparecer em quatro situações: em volta do nome no topo da
  Home (desenhado na entrada), no hover de títulos e linhas de projeto (só com mouse), no 404
  (tracejado, "elemento não encontrado") e como focus ring de teclado (sem etiqueta).
- **FR-003**: A etiqueta do contorno MUST mostrar o seletor e as medidas reais do elemento
  (ex.: "h1.name 720 × 212"), exceto no 404, que mostra "elemento não encontrado".

**Cabeçalho, navegação e rodapé**

- **FR-004**: O cabeçalho MUST mostrar o nome (link para a Home), navegação (Home, Projetos,
  Contato no desktop), item atual com ponto indicador e o seletor PT/EN.
- **FR-005**: Abaixo de 768 px, a navegação MUST virar o botão "Menu" que abre o menu em tela cheia
  descrito na User Story 6.
- **FR-006**: O rodapé MUST mostrar "© <ano atual> Eduardo Gazolla", links sociais vindos do CMS e o
  botão de voltar ao topo.
- **FR-007**: Páginas que não são a Home MUST terminar com a faixa "Vamos conversar?" com o texto
  "Vaga ou projeto, a mensagem chega direto para mim." e o botão "Escrever mensagem", que leva ao
  formulário da Home.

**Home**

- **FR-008**: O topo MUST mostrar a linha de papel ("Desenvolvedor front-end e analista de
  testes"), o nome em duas linhas, a apresentação vinda do CMS, os botões "Vamos conversar" e
  "Ver projetos", a foto vinda do CMS, a linha "Agora: …" e os links sociais.
- **FR-009**: A entrada do topo MUST rodar só na primeira visita da sessão e nunca bloquear
  interação.
- **FR-010**: A seção Stack MUST listar as tecnologias conhecidas do CMS com nome e "desde <ano>",
  ordenadas pelo ano de início mais antigo, com o subtítulo "Tecnologias que uso no dia a dia.".
- **FR-011**: A seção Projetos MUST mostrar o(s) projeto(s) em destaque do CMS e o link "Ver todos
  os projetos", seguido da linha "Mais projetos chegando…" com link para o GitHub.
- **FR-012**: A seção Experiência MUST mostrar a atual completa e as anteriores compactas em
  sanfona acessível, com duração calculada em anos e meses no idioma ativo.
- **FR-013**: A seção Contato MUST ter o título "Vamos conversar?", o texto "Conte o que você
  precisa, seja uma vaga ou um projeto. A mensagem chega direto para mim." e o formulário.

**Formulário de contato**

- **FR-014**: O formulário MUST ter os campos Nome (3–100 caracteres), E-mail (válido) e Mensagem
  (1–500 caracteres), cada um com rótulo visível e placeholder de exemplo.
- **FR-015**: O formulário MUST validar ao enviar e ao sair de cada campo, mostrando o erro abaixo
  do campo e ligando-o ao campo para tecnologias assistivas.
- **FR-016**: O formulário MUST ter os estados erros, enviando, enviado e falha descritos na User
  Story 2, sempre na própria página e anunciados por leitor de tela, sem notificações flutuantes.
- **FR-017**: O servidor MUST revalidar os dados recebidos e responder com erro genérico em caso de
  falha, sem expor detalhes internos.

**Projetos e detalhe**

- **FR-018**: A página Projetos MUST alternar entre o layout de destaque (menos de 4 projetos) e o
  layout de lista com filtros e contador (4 ou mais), conforme a User Story 4.
- **FR-019**: O detalhe MUST mostrar apenas os blocos cujos dados existem no CMS e ser acessível por
  um endereço estável baseado no slug do projeto.
- **FR-020**: Imagens de projeto MUST ter texto alternativo derivado do título do projeto ou da seção.
- **FR-021**: O rótulo de contexto do projeto ("TCC" na lista, "Contexto" no detalhe) MUST vir do
  campo localizado `context` do projeto no CMS (criado em 2026-11-11); com o campo vazio, o rótulo
  e a coluna "Contexto" não aparecem.

**404**

- **FR-022**: URLs e slugs inexistentes MUST mostrar o 404 descrito na User Story 7.

**Idioma, conteúdo e acessibilidade**

- **FR-023**: Toda a interface MUST existir em PT e EN; o conteúdo do CMS MUST seguir o idioma
  ativo com fallback para PT; a preferência MUST ficar salva.
- **FR-024**: Todo texto mostrado que não é string de interface MUST vir do CMS; a interface MUST
  NOT exibir dado que o CMS não tem.
- **FR-025**: O site MUST atender WCAG 2.2 AA, ser operável só por teclado, ter link "Pular para o
  conteúdo" e respeitar "reduzir movimento" em toda animação, conforme a coluna "Menos
  movimento" do board de Motion.
- **FR-026**: Elementos decorativos (contorno do hero e do 404, ponto pulsante) MUST ser ignorados
  por leitores de tela.

**Movimento**

- **FR-027**: As interações MUST seguir a tabela do board de Motion (12:21): contorno nos títulos,
  linha de projeto, prévia que segue o cursor, destaque da Home ligado à rolagem, imagem do
  detalhe, sanfona, seletor PT/EN, botões, troca de página, menu mobile, ponto do emprego atual,
  formulário e voltar ao topo.
- **FR-028**: Efeitos de hover MUST existir só em dispositivos com mouse; no toque, o estado
  pressionado substitui o hover.

### Key Entities *(include if feature involves data)*

- **Página Home** (CMS): apresentação (rich text), foto de perfil, redes sociais (nome, URL, ícone; o ícone não é usado),
  tecnologias conhecidas, projetos em destaque.
- **Tecnologia conhecida** (CMS): nome, data de início. O ícone existe no CMS, mas não é usado.
- **Projeto** (CMS): slug, título, descrição curta, descrição (rich text), tecnologias, imagem de
  capa, imagem da página, seções (título + imagem), URL do repositório, URL do site no ar.
  Contexto (texto curto localizado, opcional; FR-021).
- **Experiência** (CMS): cargo, empresa, URL da empresa, logo (não usado), início, fim (vazio =
  atual), descrição (rich text), tecnologias.
- **Mensagem de contato** (não persistida): nome, e-mail, mensagem; entregue ao canal privado do
  Eduardo.
- **Preferência de idioma** (no navegador): PT ou EN.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 1440 e 390, nome, papel, apresentação e o botão "Vamos conversar" estão visíveis
  sem rolar, e a página aceita interação em menos de 1 s após aparecer.
- **SC-002**: Uma pessoa sem contexto consegue enviar uma mensagem em menos de 1 minuto a partir
  da Home; com dado inválido, corrige pelo texto do erro na primeira tentativa.
- **SC-003**: 100 % das ações do site são alcançáveis e executáveis só com teclado, com foco sempre
  visível.
- **SC-004**: A auditoria automática de acessibilidade não acusa nenhuma violação de nível A ou AA
  em nenhuma página, e a nota de acessibilidade da auditoria de qualidade é a máxima.
- **SC-005**: No celular, o conteúdo principal aparece em menos de 2,5 s e o layout não pula
  durante o carregamento (deslocamento acumulado < 0,1); nota de performance da mesma auditoria ≥ 90 no celular.
- **SC-006**: Nenhuma página gera rolagem horizontal entre 360 px e 1920 px.
- **SC-007**: Com "reduzir movimento" ativo, nenhum elemento se desloca nem muda de escala.
- **SC-008**: Em PT e EN, 0 textos de interface ficam no idioma errado em todas as páginas.
- **SC-009**: As telas implementadas correspondem aos frames aprovados no Figma em 1440 e 390, sem
  divergência de layout, texto ou hierarquia apontada na revisão visual.

## Assumptions

- O protótipo do Figma é a referência aprovada; divergências entre o spec e o Figma se resolvem a
  favor do Figma, exceto em acessibilidade, que segue o spec.
- O formulário de contato fica só na Home; nas outras páginas, "Escrever mensagem" leva até ele.
- O link "Experiência" existe só no menu mobile; no desktop, a navegação mantém Home, Projetos e
  Contato, como no Figma.
- Os rótulos das redes sociais vêm do campo `name` da social no CMS (existe no schema, mas a consulta atual não o busca).
- A linha de papel do topo, os subtítulos de seção e toda a voz do contato são strings de
  interface PT/EN, não conteúdo do CMS.
- A troca do toast por mensagens na página remove o sistema de notificações flutuantes do site.
- Fora de escopo: estudo de caso do Hour Sync, download de currículo, inclusão de TypeScript na
  stack do CMS, correções de texto no CMS ("TCC" → "projeto integrador") e o texto sobre a DB1. A
  foto do perfil será trocada pelo Eduardo no CMS depois.
- Dependências: upgrade de React e da configuração de lint antes das partes visuais (Parte 0), e
  acesso de leitura ao CMS com os locales PT-BR e EN.
