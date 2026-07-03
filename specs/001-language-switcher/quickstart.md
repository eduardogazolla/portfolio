# Quickstart Validation Guide: Language Switcher (Troca de Idioma)

Este guia descreve as etapas para rodar e validar a funcionalidade de troca de idioma localmente.

## Pré-requisitos
1. Variáveis de ambiente configuradas no arquivo `.env` (incluindo acesso ao Hygraph com suporte aos locales `pt_BR` e `en`).
2. Dependências instaladas (`npm install`).

---

## Passos para Validação

### 1. Inicializar o Servidor de Desenvolvimento
Rode o servidor local:
```bash
npm run dev
```
Acesse `http://localhost:3000`.

---

### 2. Cenário de Validação 1: Alternância de Idioma Estático (UI)
* **Ação:** Clique no botão de alternância de idioma (ex: `EN / PT`) localizado no cabeçalho.
* **Resultado Esperado:**
  * Os links do menu mudam instantaneamente (ex: "Home" / "Projetos" <-> "Home" / "Projects").
  * O rodapé atualiza (ex: "Made with ❤️ by Eduardo Gazolla" <-> "Feito com ❤️ por Eduardo Gazolla").
  * O formulário de contato exibe labels e placeholders traduzidos.

---

### 3. Cenário de Validação 2: Persistência do Idioma
* **Ação:** Altere o idioma para `EN`, atualize a página (`F5`) ou feche/abra a aba do navegador.
* **Resultado Esperado:**
  * O site carrega diretamente em inglês (`EN`), sem piscar ou demonstrar atraso na renderização.
  * O valor no `localStorage` sob a chave `portfolio-gazolla:locale` é atualizado para `"en"`.

---

### 4. Cenário de Validação 3: Conteúdo Localizado do CMS
* **Ação:** Navegue pela home page ou acesse a página de detalhes de um projeto em inglês.
* **Resultado Esperado:**
  * O texto de introdução do Hero, a descrição das tecnologias, as experiências de trabalho e as descrições dos projetos aparecem traduzidos (obtidos a partir do Hygraph no respectivo locale).
  * Caso um projeto não tenha tradução cadastrada no CMS, o sistema deve aplicar o fallback exibindo o conteúdo padrão (Português) sem quebrar.

---

### 5. Execução de Testes Automatizados
Valide se todos os testes unitários do cabeçalho e rodapé passam com o novo botão integrado:
```bash
npm run test
```
* **Resultado Esperado:** Todos os testes executados com sucesso (100% de sucesso).
