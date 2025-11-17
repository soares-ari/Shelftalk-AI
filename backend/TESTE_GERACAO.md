# 🧪 GUIA DE TESTES - SHELFTALK AI

## Pré-requisitos

1. ✅ Docker rodando (PostgreSQL + Redis)
2. ✅ Backend rodando: `npm run start:dev`
3. ✅ `.env` configurado com `OPENAI_API_KEY`

---

## PASSO 1: Registrar Usuário
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ariel@teste.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "id": "uuid-aqui",
  "email": "ariel@teste.com"
}
```

---

## PASSO 2: Fazer Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ariel@teste.com",
    "password": "senha123"
  }'
```

**Resposta esperada:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**⚠️ IMPORTANTE:** Copie o `accessToken` para usar nas próximas requisições.

---

## PASSO 3: Criar Produto
```bash
export TOKEN="cole-o-token-aqui"

curl -X POST http://localhost:3001/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Camiseta Oversized Preta",
    "description": "100% algodão, modelagem ampla, estilo streetwear"
  }'
```

**Resposta esperada:**
```json
{
  "id": "product-uuid",
  "name": "Camiseta Oversized Preta",
  "description": "100% algodão, modelagem ampla, estilo streetwear",
  "ownerId": "user-uuid",
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

**⚠️ IMPORTANTE:** Copie o `id` do produto.

---

## PASSO 4: Gerar Conteúdo Completo
```bash
export PRODUCT_ID="cole-o-product-id-aqui"

curl -X POST http://localhost:3001/generations/generate-all \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{
    \"productId\": \"$PRODUCT_ID\"
  }"
```

**Resposta esperada (exemplo):**
```json
{
  "id": "generation-uuid",
  "title": "Camiseta Oversized Preta 100% Algodão - Estilo Streetwear Premium",
  "longDescription": "Descubra o conforto e estilo da nossa Camiseta Oversized Preta. Confeccionada em 100% algodão de alta qualidade, esta peça traz a modelagem ampla característica do streetwear moderno. Perfeita para o dia a dia, combina versatilidade com atitude. O tecido respirável garante conforto térmico, enquanto o corte oversized proporciona liberdade de movimento. Ideal para compor looks urbanos e descolados.",
  "tags": "camiseta oversized, streetwear, algodão 100%, moda urbana, roupa preta, estilo casual, modelagem ampla",
  "socialText": "🖤 A oversized que faltava no seu guarda-roupa! \n\nCamiseta 100% algodão com aquela modelagem ampla que você ama. Estilo streetwear, conforto total e muita atitude. \n\n✨ Perfeita pra qualquer look urbano\n🔥 Tecido que respira\n💯 Qualidade premium\n\n#Streetwear #Oversized #ModaUrbana #EstiloContemporâneo",
  "rawPrompt": {
    "name": "Camiseta Oversized Preta",
    "description": "100% algodão, modelagem ampla, estilo streetwear"
  },
  "createdAt": "2025-01-15T10:05:00.000Z"
}
```

---

## PASSO 5: Buscar Gerações de um Produto
```bash
curl -X GET "http://localhost:3001/generations/product/$PRODUCT_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Resposta esperada:**
```json
[
  {
    "id": "generation-uuid",
    "title": "...",
    "longDescription": "...",
    "tags": "...",
    "socialText": "...",
    "createdAt": "2025-01-15T10:05:00.000Z"
  }
]
```

---

## PASSO 6 (OPCIONAL): Testar Preview de Título
```bash
curl -X POST http://localhost:3001/ai/preview/title \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Tênis Nike Air Max",
    "description": "Tênis esportivo com tecnologia de amortecimento",
    "maxLength": 60
  }'
```

---

## ✅ CHECKLIST DE VALIDAÇÃO

- [ ] Registro funcionou
- [ ] Login retornou JWT
- [ ] Produto criado com sucesso
- [ ] Geração completa funcionou (título + descrição + tags + social)
- [ ] Todas as gerações foram salvas no banco
- [ ] Busca por produto retorna as gerações

---

## 🔧 TROUBLESHOOTING

### Erro: "OPENAI_API_KEY is missing"
- Verifique se o `.env` tem `OPENAI_API_KEY=sk-proj-...`
- Reinicie o backend

### Erro: "Product not found"
- Confirme se o `PRODUCT_ID` está correto
- Verifique se o produto pertence ao usuário autenticado

### Erro: "Unauthorized"
- Token JWT pode ter expirado (7 dias)
- Faça login novamente

---

## 💰 ESTIMATIVA DE CUSTOS

Cada geração completa usa aproximadamente:
- **Tokens de entrada:** ~150 tokens
- **Tokens de saída:** ~400 tokens
- **Custo por geração:** ~$0.0005 USD (GPT-4o-mini)

**100 gerações = ~$0.05 USD** 🎉