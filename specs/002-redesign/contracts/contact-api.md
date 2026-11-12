# Contrato: `POST /api/contact`

Rota existente (`app/api/contact/route.ts`), ajustada para os estados do formulário (FR-014–FR-017).

## Request

`Content-Type: application/json` (regex `^application/json\s*(;|$)`, case-insensitive; `text/plain; x=application/json` is rejected)

```json
{ "name": "Maria Silva", "email": "maria@empresa.com", "message": "Oi, Eduardo! ..." }
```

| Campo | Regra |
|-------|-------|
| `name` | string, aparada, 3–100 caracteres |
| `email` | string, e-mail válido, até 254 caracteres |
| `message` | string, aparada, 1–500 caracteres |
| `company_url` | opcional (honeypot), string até 200 caracteres, padrão `""` |

Caracteres de controle ASCII são removidos (em `message` ficam `
` e `	`) antes da validação.

O schema zod é **o mesmo** no cliente e no servidor (`app/lib/contact-schema.ts`). Campos extras são ignorados.

## Responses

| Status | Corpo | Quando | Estado no form |
|--------|-------|--------|----------------|
| `200` | `{ "ok": true }` | webhook aceitou | `sent` |
| `400` | `{ "ok": false, "error": "invalid_input" }` | corpo não passa no schema ou JSON inválido | `failed` (o cliente já valida antes, então isto é defesa) |
| `502` | `{ "ok": false, "error": "delivery_failed" }` | webhook respondeu erro ou deu timeout (10 s) | `failed` |
| `500` | `{ "ok": false, "error": "unexpected" }` | qualquer outra falha | `failed` |

- **Honeypot**: se `company_url` vier não vazio (após trim), responde `200 { "ok": true }` **sem** chamar o webhook. O campo é oculto no formulário (fora da tela, `tabIndex=-1`, `aria-hidden`); o cliente nunca o envia, e finge sucesso se ele estiver preenchido.
- **Mesma origem**: se houver header `Origin` e o host dele diferir do header `host` (ou o `Origin` for inválido) → `400 invalid_input`. Sem `Origin` é aceito.
- **Limite de corpo**: 10 KB. O corpo é lido em stream e a leitura é cancelada ao passar do limite (`400 invalid_input`), mesmo sem `Content-Length`. `Content-Length` presente mas inválido (não numérico, negativo) ou acima do limite → `400`.
- Qualquer exceção inesperada → `500 unexpected` (log sem dados do usuário). Runtime `nodejs`; o POST ao webhook usa `maxRedirects: 0`.
- Nenhuma resposta inclui stack, mensagem do webhook ou valores de ambiente.
- Sem `WEBHOOK_URL` configurada → `500 unexpected`, com log no servidor.
- O conteúdo do usuário vai para o webhook como texto (campos do embed), nunca interpretado.

## Testes

- Unitário da rota (Jest): payload válido → 200 com o webhook mockado; inválido → 400; webhook
  falhando → 502.
- E2E (Playwright): `page.route('**/api/contact')` responde 200 ou 502 para exercitar `sent` e
  `failed` sem chamar o webhook real.
