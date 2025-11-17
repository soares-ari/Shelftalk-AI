# 🧪 Testes E2E - ShelfTalk AI

## Pré-requisitos

1. ✅ Docker rodando (PostgreSQL + Redis)
2. ✅ Variáveis de ambiente configuradas (`.env`)
3. ✅ `OPENAI_API_KEY` configurada

---

## Executar Testes

### Todos os testes:
```bash
npm run test:e2e
```

### Apenas testes de autenticação:
```bash
npm run test:e2e:auth
```

### Apenas testes de produtos:
```bash
npm run test:e2e:products
```

### Apenas testes de gerações (PRINCIPAL):
```bash
npm run test:e2e:generations
```

### Com coverage:
```bash
npm run test:e2e:cov
```

### Watch mode (re-executa ao salvar):
```bash
npm run test:e2e:watch
```

---

## Estrutura dos Testes
```
test/
├── jest-e2e.json              ← Configuração
├── setup-e2e.ts               ← Setup global
├── helpers/
│   └── test-helpers.ts        ← Funções reutilizáveis
└── e2e/
    ├── auth.e2e-spec.ts       ← Testes de autenticação
    ├── products.e2e-spec.ts   ← Testes de produtos
    └── generations.e2e-spec.ts ← Testes de gerações (IA)
```

---

## Output Esperado
```
 PASS  test/e2e/auth.e2e-spec.ts (12.5s)
 PASS  test/e2e/products.e2e-spec.ts (8.3s)
 PASS  test/e2e/generations.e2e-spec.ts (25.1s)

Test Suites: 3 passed, 3 total
Tests:       28 passed, 28 total
Snapshots:   0 total
Time:        45.9s
```

---

## Custos Estimados

Cada execução completa:
- ~8-10 gerações de IA
- Custo: ~$0.005 USD
- **100 execuções = $0.50 USD**

---

## Troubleshooting

### Erro: "OPENAI_API_KEY is missing"
- Configure no `.env`
- Reinicie o terminal

### Timeout em testes de IA
- Normal em conexões lentas
- Timeout configurado para 30s

### Database connection failed
- Verifique se o Docker está rodando
- `docker-compose up -d`