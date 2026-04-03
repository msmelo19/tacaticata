# Tacaticatá - Treino de tamborim

Uma aplicação web moderna para praticar tamborim com recursos avançados de metrônomo e exercícios personalizados.

## 🎵 Características

- **Metrônomo em Tempo Real**: Reprodução de batidas com precisão ajustável
- **Indicador Visual de Batidas**: Feedback visual durante a prática
- **Exercícios Musicais**: Conjuntos de exercícios organizados para diferentes níveis
- **Reprodutor de Exercícios**: Interface interativa para praticar exercícios específicos
- **Design Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis
- **Interface Moderna**: Construída com componentes de alta qualidade

## 🛠️ Tecnologias Utilizadas

- **Frontend Framework**: React 18+ com TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui (baseado em Radix UI)
- **State Management**: React Hooks
- **Testing**: Vitest
- **E2E Testing**: Playwright
- **Linting**: ESLint

## 📋 Requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun

## 🚀 Instalação e Uso

### Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd tempo-master

# Instale as dependências
npm install
# ou
bun install
```

### Desenvolvimento

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:5173
```

### Build para Produção

```bash
# Crie a build otimizada
npm run build

# Visualize a build
npm run preview
```

## 🧪 Testes

```bash
# Execute os testes unitários
npm run test

# Execute os testes em modo watch
npm run test:watch

# Execute testes E2E
npx playwright test
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── BeatIndicator.tsx      # Componente visual de indicação de batidas
│   ├── Metronome.tsx          # Componente principal do metrônomo
│   ├── NavLink.tsx            # Componente de navegação
│   └── ui/                    # Componentes reutilizáveis (Shadcn)
├── hooks/
│   ├── useMetronome.ts        # Hook para lógica do metrônomo
│   ├── useExerciseMetronome.ts # Hook para exercícios
│   └── use-mobile.tsx         # Hook para detecção de dispositivo móvel
├── pages/
│   ├── Home.tsx               # Página inicial
│   ├── Exercises.tsx          # Página de exercícios
│   ├── ExercisePlayer.tsx     # Reprodutor de exercícios
│   └── NotFound.tsx           # Página 404
├── lib/
│   └── utils.ts               # Funções utilitárias
└── test/
    └── setup.ts               # Configuração de testes
```

## 📖 Como Usar

### Metrônomo Básico
1. Navegue até a página inicial
2. Ajuste o BPM (batidas por minuto) desejado
3. Configure o tempo musical (4/4, 3/4, etc.)
4. Clique em "Iniciar" para começar

### Exercícios
1. Acesse a seção de Exercícios
2. Selecione um exercício disponível
3. Use o reprodutor para praticar
4. O metrônomo executará automaticamente as batidas do exercício

## 🔒 Licença

Este projeto está licenciado sob a **GNU General Public License v3.0 (GPL-3.0)**.

Você é livre para:
- ✅ Usar a aplicação para qualquer propósito
- ✅ Modificar o código
- ✅ Distribuir versões modificadas

Sob a condição de:
- ⚠️ Disponibilizar o código-fonte das modificações
- ⚠️ Manter a mesma licença GPL-3.0
- ⚠️ Incluir aviso de alterações significativas

Para mais detalhes, veja o arquivo [LICENSE](LICENSE) ou visite https://www.gnu.org/licenses/gpl-3.0.html

## 👨‍💻 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

