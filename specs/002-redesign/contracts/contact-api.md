# Contrato: `POST /api/contact`

Rota existente (`app/api/contact/route.ts`), ajustada para os estados do formulário (FR-014–FR-017).

## Request

`Content-Type: application/json`

```json
{ "name": "Maria Silva", "email": "maria@empresa.com", "message": "Oi, Eduardo! ..." }
```

| Campo | Regra |
|-------|-------|
| `name` | string, aparada, 3–100 caracteres |
| `email` | string, e-mail válido, até 254 caracteres |
| `message` | string, aparada, 1–500 caracteres |

O schema zod é **o mesmo** no cliente e no servidor (`app/lib/contact-schema.ts`). Campos extras são ignorados.

## Responses

| Status | Corpo | Quando | Estado no form |
|--------|-------|--------|----------------|
| `200` | `{ "ok": true }` | webhook aceitou | `sent` |
| `400` | `{ "ok": false, "error": "invalid_input" }` | corpo não passa no schema ou JSON inválido | `failed` (o cliente já valida antes, então isto é defesa) |
| `502` | `{ "ok": false, "error": "delivery_failed" }` | webhook respondeu erro ou deu timeout (10 s) | `failed` |
| `500` | `{ "ok": false, "error": "unexpected" }` | qualquer outra falha | `failed` |

- Nenhuma resposta inclui stack, mensagem do webhook ou valores de ambiente.
- Sem `WEBHOOK_URL` configurada → `500 unexpected`, com log no servidor.
- O conteúdo do usuário vai para o webhook como texto (campos do embed), nunca interpretado.

## Testes

- Unitário da rota (Jest): payload válido → 200 com o webhook mockado; inválido → 400; webhook
  falhando → 502.
- E2E (Playwright): `page.route('**/api/contact')` responde 200 ou 502 para exercitar `sent` e
  `failed` sem chamar o webhook real.
