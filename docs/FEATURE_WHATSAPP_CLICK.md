# Feature: Clique no Telefone para WhatsApp

## Descrição

Ao visualizar o histórico de um lead, os números de telefone exibidos nos cards **Contato** (empresa) e **Dados do Lead** tornam-se links clicáveis que abrem diretamente uma conversa no WhatsApp via API pública da Meta (`wa.me`).

## Como funciona

### URL utilizada

```
https://wa.me/<número_E164_sem_+>
```

A [API Click to Chat da Meta](https://faq.whatsapp.com/5913398998672934) permite abrir uma conversa no WhatsApp Web ou no aplicativo mobile apenas com um link nesse formato — sem necessidade de autenticação ou token.

### Lógica de formatação (`src/utils/whatsapp.ts`)

1. Remove todos os caracteres não numéricos do telefone armazenado.
2. Se o resultado ainda não começar com `55` (código do Brasil) ou tiver menos de 12 dígitos, prefixa com `55`.
3. Monta a URL `https://wa.me/<número>`.

```ts
// Exemplo
buildWhatsAppUrl("(11) 91234-5678") // → "https://wa.me/5511912345678"
buildWhatsAppUrl("+55 11 91234-5678") // → "https://wa.me/5511912345678"
```

## Arquivos alterados

| Arquivo | Mudança |
|---|---|
| `src/utils/whatsapp.ts` | Novo utilitário `buildWhatsAppUrl` |
| `src/components/CompanyResult/ContactCard.tsx` | Telefone da empresa vira link clicável |
| `src/components/CompanyResult/LeadCard.tsx` | Telefone do lead vira link clicável |

## Comportamento visual

- O número aparece em **verde** com ícone de mensagem (Lucide `MessageCircle`).
- O link abre em nova aba (`target="_blank"`).
- Ao passar o mouse, sublinha e escurece levemente.

## Limitações

- A API `wa.me` é pública e não requer configuração — mas **não garante entrega de mensagem**; apenas abre o chat.
- Números inválidos ou fora do Brasil podem gerar uma tela de erro do WhatsApp.
- Para envio programático de mensagens (ex.: disparos em massa) é necessária a **WhatsApp Business API** com token de acesso Meta, o que envolve criação de um aplicativo no Meta for Developers e aprovação de templates de mensagem.

## Possível evolução futura

Para disparos via WhatsApp Business API com mensagem pré-preenchida:

```
https://wa.me/<número>?text=<mensagem_codificada_em_URL>
```

Ou, para integração server-side com a Graph API da Meta:

```
POST https://graph.facebook.com/v20.0/<phone_number_id>/messages
Authorization: Bearer <ACCESS_TOKEN>
```
