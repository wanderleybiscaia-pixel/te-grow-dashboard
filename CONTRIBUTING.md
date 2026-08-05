# Contributing to Te-Grow Dashboard

## 🤝 Como Contribuir

Obrigado por considerar contribuir para o Te-Grow Dashboard! Existem várias maneiras de contribuir.

## 🐛 Relatando Bugs

Antes de criar relatórios de bugs, verifique a lista de issues pois você pode descobrir que o bug já foi relatado. Ao criar um relatório de bug, inclua o máximo de detalhes possível:

- **Use um título claro e descritivo**
- **Descreva as etapas exatas que reproduzem o problema**
- **Forneça exemplos específicos para demonstrar as etapas**
- **Descreva o comportamento observado**
- **Descreva o comportamento esperado**
- **Inclua capturas de tela se possível**

## 💡 Sugerindo Melhorias

- Use um título claro e descritivo
- Forneça uma descrição detalhada
- Liste alguns exemplos de como essa funcionalidade seria usada

## 🔧 Pull Requests

1. Faça um fork do repositório
2. Clone o repositório forkado
3. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
4. Faça suas mudanças
5. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
6. Push para a branch (`git push origin feature/AmazingFeature`)
7. Abra um Pull Request

## 📝 Guia de Estilo

### JavaScript/React

```javascript
// ✅ Bom
function uploadDocument(file) {
  // código bem formatado
  return result;
}

// ❌ Ruim
function upload_document(file){return result;}
```

### CSS/Tailwind

```jsx
// ✅ Bom - Use Tailwind classes
<div className="bg-blue-600 text-white p-4 rounded-lg">
  Content
</div>

// ❌ Ruim - Não use inline styles
<div style={{ backgroundColor: 'blue', color: 'white' }}>
  Content
</div>
```

## 📋 Checklist para PR

- [ ] Meu código segue o guia de estilo do projeto
- [ ] Executei uma auto-revisão do meu próprio código
- [ ] Adicionei comentários onde o código não é autoexplicativo
- [ ] Meu código não gera novos warnings
- [ ] Testei manualmente todas as mudanças
- [ ] Atualizei a documentação se necessário

## 🧪 Testando

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# Ambos
npm run test:all
```

## 📚 Estrutura de Commits

Use mensagens de commit significativas:

```
feat: Adicionar nova funcionalidade X
fix: Corrigir bug em Y
docs: Atualizar documentação de Z
style: Formatar código (sem mudanças lógicas)
refactor: Refatorar componente X
test: Adicionar testes para Y
perf: Melhorar performance de Z
```

## 🚀 Processo de Review

Os PRs serão revisados por um dos mantenedores. Ele pode sugerir mudanças e melhorias.

## ⚖️ Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob sua licença MIT existente.

---

**Obrigado por contribuir! 🙏**
