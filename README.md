# NextCertify

**NextCertify** é um sistema web de gerenciamento de certificados acadêmicos desenvolvido para facilitar o controle e validação de certificados de participação em programas de tutoria e monitoria.

## 📋 Sobre o Projeto

O NextCertify é uma plataforma completa que permite o gerenciamento de certificados acadêmicos com diferentes níveis de acesso para:

- **Alunos**: Visualização de certificados, avaliação de tutorias e gerenciamento de perfil
- **Tutores**: Acompanhamento de alunos, preenchimento de formulários e geração de relatórios
- **Bolsistas**: Registro de alunos e tutores, validação de certificados e geração de relatórios consolidados
- **Coordenadores**: Visualização de relatórios gerais e acompanhamento do programa

## 🚀 Tecnologias Utilizadas

### Core
- **React** (v19.2.0) - Biblioteca JavaScript para construção de interfaces
- **Vite** (v7.2.4) - Build tool e dev server de alta performance
- **React Router DOM** (v7.9.6) - Roteamento e navegação entre páginas

### UI/UX
- **Bootstrap** (v5.3.8) - Framework CSS para design responsivo
- **React Bootstrap** (v2.10.10) - Componentes Bootstrap para React
- **React Icons** (v5.5.0) - Biblioteca de ícones

### Funcionalidades Específicas
- **jsPDF** (v4.0.0) - Geração de documentos PDF
- **jspdf-autotable** (v5.0.2) - Criação de tabelas em PDFs
- **Recharts** (v3.6.0) - Biblioteca de gráficos para visualização de dados
- **jwt-decode** (v4.0.0) - Decodificação de tokens JWT para autenticação

### Ferramentas de Desenvolvimento
- **ESLint** (v9.39.1) - Linter para qualidade de código
- **@vitejs/plugin-react** (v5.1.1) - Plugin Vite para suporte a React

## 📦 Instalação

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn

### Passos para instalação

1. **Clone o repositório** (se aplicável):
```bash
git clone <url-do-repositorio>
cd NextCertify
```

2. **Instale as dependências**:
```bash
npm install
```

## 🎯 Execução

### Modo de Desenvolvimento
Para executar o projeto em modo de desenvolvimento com hot-reload:

```bash
npm run dev
```

O servidor de desenvolvimento será iniciado e você verá uma mensagem no terminal com a URL local (geralmente `http://localhost:5173`). Abra esta URL no seu navegador.

### Build para Produção
Para criar uma versão otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### Preview da Build
Para visualizar a versão de produção localmente:

```bash
npm run preview
```

### Linting
Para verificar a qualidade do código:

```bash
npm run lint
```

## 📁 Estrutura do Projeto

```
NextCertify/
├── public/                      # Arquivos públicos estáticos
│   └── vite.svg                # Favicon
├── src/                        # Código fonte da aplicação
│   ├── assets/                 # Recursos estáticos (imagens, etc.)
│   ├── components/             # Componentes reutilizáveis
│   │   ├── AlertBox.jsx       # Componente de alertas
│   │   ├── BotaoPrincipal.jsx # Botão principal customizado
│   │   ├── InputFlutuante.jsx # Input com label flutuante
│   │   └── RecordsTable.jsx   # Tabela de registros
│   ├── css/                    # Arquivos de estilo CSS
│   │   └── index.css          # Estilos globais
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useAlert.jsx       # Hook para gerenciamento de alertas
│   │   └── useAuthenticatedUser.jsx # Hook para autenticação
│   ├── img/                    # Imagens da aplicação
│   ├── mocks/                  # Dados mockados para desenvolvimento
│   │   ├── auth-mock.json     # Dados de autenticação
│   │   ├── registro-alunos-mock.json
│   │   ├── registro-tutores-mock.json
│   │   ├── relatorio-*.json   # Diversos relatórios mockados
│   │   └── ...
│   ├── pages/                  # Páginas da aplicação
│   │   ├── Login.jsx          # Página de login
│   │   ├── Cadastro.jsx       # Cadastro de usuários
│   │   ├── RedefinirSenha.jsx # Redefinição de senha
│   │   ├── VerificarCodigo.jsx # Verificação de código
│   │   ├── Contato.jsx        # Página de contato
│   │   ├── EditarPerfil.jsx   # Edição de perfil
│   │   │
│   │   ├── HomeAluno.jsx      # Dashboard do aluno
│   │   ├── MeusCertificados.jsx # Certificados do aluno
│   │   ├── AvaliacaoTutoria.jsx # Avaliação de tutoria
│   │   │
│   │   ├── HomeTutor.jsx      # Dashboard do tutor
│   │   ├── AlunosTutor.jsx    # Lista de alunos do tutor
│   │   ├── FormsTutor.jsx     # Formulários do tutor
│   │   ├── RelatoriosTutor.jsx # Relatórios do tutor
│   │   │
│   │   ├── HomeBolsista.jsx   # Dashboard do bolsista
│   │   ├── RegistroAluno.jsx  # Registro de alunos
│   │   ├── RegistroTutores.jsx # Registro de tutores
│   │   ├── ValidarCertificados.jsx # Validação de certificados
│   │   ├── RelatorioIndividualTutor.jsx
│   │   ├── RelatorioGeralTutor.jsx
│   │   ├── RelatorioIndividualAluno.jsx
│   │   ├── RelatorioGeralAluno.jsx
│   │   ├── Predefinicoes.jsx  # Configurações predefinidas
│   │   │
│   │   └── HomeCoordenador.jsx # Dashboard do coordenador
│   │       └── RelatoriosCoordenador.jsx
│   ├── services/               # Serviços e APIs
│   │   ├── api.js             # Funções de requisição HTTP
│   │   └── authService.js     # Serviço de autenticação
│   ├── App.jsx                 # Componente principal com rotas
│   └── main.jsx                # Ponto de entrada da aplicação
├── index.html                  # HTML base
├── vite.config.js             # Configuração do Vite
├── eslint.config.js           # Configuração do ESLint
├── package.json               # Dependências e scripts
└── README.md                  # Este arquivo

```

## 🔐 Autenticação e Roles

O sistema utiliza um sistema de autenticação baseado em roles (papéis) com os seguintes níveis de acesso:

- **aluno**: Acesso a certificados e avaliações
- **tutor**: Acesso a gerenciamento de alunos e relatórios
- **bolsista**: Acesso a registros e validações
- **coordenador**: Acesso a relatórios gerais

> **Nota**: Atualmente o sistema utiliza dados mockados (arquivos JSON na pasta `mocks/`) e localStorage para desenvolvimento. Em produção, estes devem ser substituídos por chamadas a uma API real.

## 🛣️ Rotas Principais

### Públicas
- `/` - Login
- `/cadastro` - Cadastro de usuário
- `/redefinir-senha` - Redefinição de senha
- `/verificar-codigo` - Verificação de código
- `/contato` - Página de contato

### Aluno
- `/aluno` - Dashboard do aluno
- `/meus-certificados` - Visualização de certificados
- `/avaliacao-tutoria` - Avaliação de tutoria
- `/editar-perfil` - Edição de perfil

### Tutor
- `/home-tutor` - Dashboard do tutor
- `/alunos-tutor` - Lista de alunos
- `/forms-tutor` - Formulários
- `/relatorios-tutor` - Relatórios

### Bolsista
- `/bolsista` - Dashboard do bolsista
- `/registro-aluno` - Registro de alunos
- `/registro-tutores` - Registro de tutores
- `/validar-certificados` - Validação de certificados
- `/relatorio-individual-tutor` - Relatório individual de tutor
- `/relatorio-geral-tutor` - Relatório geral de tutores
- `/relatorio-individual-aluno` - Relatório individual de aluno
- `/relatorio-geral-aluno` - Relatório geral de alunos
- `/predefinicoes` - Configurações

### Coordenador
- `/coordenador` - Dashboard do coordenador
- `/relatorios-coordenador` - Relatórios consolidados

## 🎨 Recursos e Funcionalidades

### Geração de PDFs
O sistema utiliza jsPDF e jspdf-autotable para gerar certificados e relatórios em formato PDF.

### Visualização de Dados
Gráficos e dashboards são criados com Recharts para melhor visualização de métricas e estatísticas.

### Design Responsivo
Interface totalmente responsiva utilizando Bootstrap 5, garantindo boa experiência em dispositivos móveis e desktop.

### Componentes Reutilizáveis
- **AlertBox**: Sistema de notificações e alertas
- **BotaoPrincipal**: Botão estilizado padrão
- **InputFlutuante**: Campo de entrada com label animado
- **RecordsTable**: Tabela de dados com funcionalidades avançadas

## 🔧 Configuração

### Vite
O projeto utiliza Vite como bundler e dev server. A configuração está em `vite.config.js`.

### ESLint
Regras de linting configuradas em `eslint.config.js` para manter a qualidade do código.

## 📝 Notas de Desenvolvimento

- O sistema atualmente usa dados mockados para desenvolvimento
- A autenticação é simulada com localStorage
- Usuários cadastrados localmente são armazenados no localStorage
- Para produção, será necessário integrar com uma API backend real

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request