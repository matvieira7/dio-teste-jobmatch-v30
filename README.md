# MatchMaker Pro

Crie um aplicativo completo de Matchmaking de Vagas + Currículo ATS Friendly

Quero que você desenvolva um aplicativo web completo do zero, com foco em matchmaking inteligente entre candidatos e vagas de emprego, permitindo também criar versões personalizadas e ATS Friendly do currículo do usuário para cada vaga.

Neste primeiro momento, NÃO implemente sistema de login, cadastro, autenticação ou criação de contas.

O usuário deve simplesmente acessar a aplicação e começar a utilizar o sistema imediatamente.

A persistência de usuário, autenticação e gerenciamento de contas serão implementados posteriormente.

O projeto deve ter aparência de produto SaaS profissional, moderno, limpo, responsivo e preparado para evolução futura.

1. Objetivo principal

A aplicação deve resolver dois problemas principais:

Ajudar o usuário a encontrar vagas compatíveis com seu perfil.

Adaptar o currículo do usuário para cada vaga, aumentando a compatibilidade com sistemas ATS.

O fluxo principal deve ser:

Entrada na aplicação → Criação/preenchimento do perfil → Importação/criação do currículo → Análise do perfil → Busca de vagas → Match com vagas → Análise de compatibilidade → Geração de currículo ATS específico para a vaga → Exportação do currículo.

2. Stack e arquitetura

Utilize uma arquitetura moderna e organizada.

Frontend

Next.js

TypeScript

React

Tailwind CSS

shadcn/ui como Design System principal

Lucide Icons

React Hook Form

Zod

TanStack Query quando fizer sentido

Backend

Utilize uma arquitetura preparada para crescimento.

Node.js

TypeScript

API REST

Validação com Zod

Separação clara entre controllers, services, repositories e schemas

Banco de dados

Utilize:

PostgreSQL

Drizzle ORM

Neste primeiro momento, o sistema pode funcionar sem autenticação de usuário.

A arquitetura, porém, deve ser preparada para receber autenticação posteriormente.

3. Design System

É obrigatório utilizar shadcn/ui para os componentes da interface.

Não crie componentes visuais complexos do zero quando existir equivalente no shadcn/ui.

Utilize componentes como:

Button

Input

Textarea

Select

Checkbox

Radio Group

Dialog

Sheet

Dropdown Menu

Tabs

Card

Badge

Avatar

Progress

Accordion

Tooltip

Alert

Toast

Table

Skeleton

Separator

Form

Command

Calendar

Pagination

Crie uma camada de componentes reutilizáveis baseada no shadcn/ui.

4. Identidade visual

A identidade visual deve utilizar exclusivamente como base:

Verde claro

Para:

destaques

indicadores positivos

botões secundários

badges

elementos de progresso

backgrounds suaves

Branco

Para:

fundo principal

cards

áreas de conteúdo

Verde escuro

Para:

textos importantes

títulos

botões principais

navegação

elementos de maior destaque

A interface deve transmitir:

tecnologia

empregabilidade

confiança

inteligência

simplicidade

profissionalismo

Evite aparência excessivamente corporativa ou genérica.

Evite excesso de sombras, gradientes fortes e elementos visuais desnecessários.

Utilize bastante espaço em branco.

O layout deve parecer um SaaS moderno, semelhante ao nível visual de produtos como Linear, Notion, Vercel e ferramentas modernas de recrutamento, porém mantendo identidade própria.

5. Responsividade

A aplicação deve funcionar perfeitamente em:

Desktop

Notebook

Tablet

Smartphone

Priorize Desktop para o dashboard, mas não deixe a experiência mobile de lado.

A interface não pode depender apenas de hover.

Menus, tabelas e cards devem possuir comportamento adequado em telas pequenas.

6. Landing Page / Tela inicial

Como não haverá login neste momento, a aplicação deve abrir diretamente em uma tela inicial funcional, sem exigir autenticação.

Criar uma landing page profissional para apresentar o produto.

Hero

Título:

"Encontre vagas que combinam com você. Crie um currículo feito para cada oportunidade."

Subtítulo explicando que a plataforma:

analisa o perfil do candidato

encontra vagas compatíveis

identifica palavras-chave importantes

calcula compatibilidade

adapta o currículo

gera uma versão ATS Friendly

Botão principal:

Começar agora

Botão secundário:

Ver como funciona

O botão Começar agora deve levar diretamente para o fluxo de criação do perfil, sem login.

Seção "Como funciona"

Mostrar um fluxo visual:

1. Crie seu perfil

Informe experiências, formação, competências e objetivos.

2. Encontre vagas compatíveis

A plataforma compara seu perfil com as oportunidades disponíveis.

3. Veja seu Match

Entenda exatamente por que uma vaga combina com seu perfil.

4. Gere seu currículo

Crie automaticamente uma versão personalizada e ATS Friendly.

5. Candidate-se

Baixe o currículo e utilize-o na candidatura.

Seção de benefícios

Mostrar cards para:

Match inteligente

Análise de currículo

Otimização ATS

Personalização por vaga

Identificação de palavras-chave

Acompanhamento das candidaturas

CTA final

Chamada para o usuário começar imediatamente.

Não mostrar tela de login.

7. Entrada direta no aplicativo

O usuário deve poder acessar o produto e começar imediatamente.

Ao clicar em:

Começar agora

abrir o fluxo de onboarding.

Não solicitar:

email

senha

cadastro

login

Criar o estado do usuário como uma sessão local temporária, preparada para posteriormente ser vinculada a um sistema de autenticação real.

Enquanto não houver autenticação:

utilizar estado local quando apropriado

utilizar banco quando necessário

considerar localStorage/sessionStorage para protótipo

manter arquitetura preparada para substituição futura por usuário autenticado

Não amarrar a aplicação a um usuário fixo.

8. Onboarding

Criar um fluxo dividido em etapas.

Etapa 1 — Informações pessoais

Nome

Foto

Cidade

Estado

País

LinkedIn

GitHub

Portfólio

Telefone

Etapa 2 — Objetivo profissional

Cargo desejado

Área

Senioridade

Modelo de trabalho

Localização desejada

Pretensão salarial

Disponibilidade

Modelo de trabalho:

Presencial

Híbrido

Remoto

Etapa 3 — Formação

Permitir múltiplas formações.

Campos:

Curso

Instituição

Grau

Data inicial

Data final

Em andamento

Etapa 4 — Experiência profissional

Permitir múltiplas experiências.

Campos:

Empresa

Cargo

Tipo de contrato

Localização

Data inicial

Data final

Atual

Descrição

Principais responsabilidades

Resultados/conquistas

Etapa 5 — Competências

Permitir adicionar:

Hard Skills

Soft Skills

Ferramentas

Linguagens

Frameworks

Bancos de dados

Certificações

9. Importação de currículo

Permitir que o usuário:

envie PDF

envie DOCX

cole o conteúdo manualmente

A plataforma deve extrair e estruturar as informações.

Depois da importação, mostrar uma tela de revisão:

"Encontramos estas informações no seu currículo."

Cada informação deve poder ser editada antes de salvar.

10. Dashboard

Depois que o usuário completar o perfil, criar um dashboard principal.

Mostrar:

Saudação

"Olá, [Nome] 👋"

Cards principais

Vagas recomendadas

Match médio

Currículos criados

Candidaturas acompanhadas

Seção "Melhores oportunidades"

Mostrar as vagas com maior compatibilidade.

Cada vaga deve apresentar:

Cargo

Empresa

Localização

Modelo de trabalho

Senioridade

Salário, quando disponível

Match %

Utilizar um indicador visual de compatibilidade.

Exemplo:

92% Match

11. Sistema de Matchmaking

Esse é um dos recursos mais importantes do sistema.

Criar um algoritmo responsável por comparar:

Perfil do usuário

Com:

Requisitos da vaga

Considerar:

Cargo

Experiência

Senioridade

Skills

Tecnologias

Formação

Idiomas

Localização

Modelo de trabalho

Experiência específica

Palavras-chave

Requisitos obrigatórios

Requisitos desejáveis

Calcular uma porcentagem de compatibilidade.

Exemplo:

92% de compatibilidade

Mostrar também a explicação.

Match Breakdown

Exemplo:

Skills: 96%

Experiência: 90%

Formação: 100%

Senioridade: 95%

Localização: 100%

Palavras-chave: 84%

Criar uma visualização clara dessas informações.

12. Página de detalhes da vaga

Criar página:

/jobs/[id]

Mostrar:

Cargo

Empresa

Logo

Localização

Modalidade

Salário

Senioridade

Data de publicação

Descrição

Requisitos

Diferenciais

Benefícios

Link da candidatura

Criar também:

"Por que essa vaga combina com você?"

Mostrar os principais fatores responsáveis pelo Match.

Exemplo:

Você possui 8 das 10 competências exigidas.

"O que está faltando?"

Mostrar requisitos ausentes.

Exemplo:

Docker

Inglês avançado

13. Sistema de vagas

Criar estrutura preparada para receber vagas através de:

API externa

banco de dados interno

importação manual

integração futura com plataformas de empregos

Criar entidade Job.

Campos sugeridos:

id

title

company

companyLogo

description

location

workModel

salaryMin

salaryMax

currency

seniority

employmentType

requiredSkills

desiredSkills

educationRequirements

experienceRequirements

keywords

source

sourceUrl

publishedAt

expiresAt

createdAt

updatedAt

14. Pesquisa de vagas

Criar página /jobs.

Filtros:

Cargo

Localização

Distância

Remoto

Híbrido

Presencial

Senioridade

Faixa salarial

Tipo de contrato

Tecnologia

Empresa

Adicionar:

Ordenação

Paginação

Favoritar vaga

Salvar vaga

Mostrar Match % diretamente na listagem.

15. Currículo do usuário

Criar uma seção:

/resume

O usuário deve possuir um currículo base.

Esse currículo deve conter:

Informações pessoais

Resumo profissional

Experiência

Formação

Skills

Certificações

Projetos

Idiomas

Links

Permitir editar cada seção.

Criar uma visualização do currículo antes de exportar.

16. Análise ATS

Criar uma funcionalidade chamada:

ATS Score

A plataforma deve analisar o currículo e verificar aspectos como:

Estrutura

Clareza

Palavras-chave

Compatibilidade com a vaga

Skills

Experiência

Títulos das seções

Formatação

Conteúdo relevante

Informações ausentes

Mostrar um score:

ATS Score: 87/100

Criar visualização com:

Pontos fortes

Exemplo:

Estrutura clara

Skills relevantes

Experiência compatível

Pontos para melhorar

Exemplo:

Poucas palavras-chave da vaga

Resumo profissional genérico

Experiências sem resultados mensuráveis

17. Geração de currículo específico para a vaga

Essa é uma funcionalidade central.

Quando o usuário acessar uma vaga, deve existir um botão:

"Adaptar meu currículo para esta vaga"

Ao clicar, o sistema deverá analisar:

Currículo base

Descrição da vaga

E gerar uma nova versão personalizada.

A versão personalizada deve:

manter apenas informações verdadeiras do usuário

destacar experiências relevantes

reorganizar informações

adaptar o resumo profissional

destacar skills relacionadas

utilizar palavras-chave relevantes da vaga

melhorar descrições das experiências

gerar bullets mais objetivos

evitar informações irrelevantes

Não inventar experiências, tecnologias, cargos, certificações ou resultados que o usuário não informou.

A IA pode melhorar a forma de apresentar informações existentes, mas nunca fabricar informações.

18. Sistema de versões de currículo

Cada vaga pode gerar uma versão diferente do currículo.

Exemplo:

Currículo Base

Currículo — Desenvolvedor Backend

Currículo — Desenvolvedor Full Stack

Currículo — Software Engineer

Criar histórico das versões.

Mostrar:

Nome

Vaga relacionada

Data de criação

ATS Score

Match Score

Permitir:

Visualizar

Editar

Duplicar

Excluir

Exportar PDF

Exportar DOCX

19. Comparação antes/depois

Criar tela de comparação entre:

Currículo original

e

Currículo otimizado

Mostrar:

palavras-chave adicionadas

palavras-chave removidas

alterações no resumo

experiências priorizadas

skills destacadas

melhorias feitas

Usar uma interface visual fácil de entender.

20. Análise inteligente da vaga

Criar uma seção:

"O que essa empresa está procurando?"

A plataforma deve interpretar a descrição da vaga e separar:

Requisitos obrigatórios

Requisitos desejáveis

Tecnologias

Soft Skills

Experiência

Formação

Palavras-chave

Responsabilidades

Isso será utilizado também no cálculo do Match e na geração do currículo.

21. Busca e Match com IA

Criar uma camada de inteligência responsável por:

interpretar o currículo

interpretar a vaga

normalizar tecnologias e competências

encontrar equivalências

calcular compatibilidade

identificar gaps

sugerir melhorias

adaptar o currículo

Exemplo:

Se o usuário possui:

JavaScript

e a vaga exige:

JS

o sistema deve reconhecer que são equivalentes.

Também deve reconhecer variações como:

React ↔ React.js

Node ↔ Node.js

PostgreSQL ↔ Postgres

JavaScript ↔ JS

Criar uma estrutura que permita evoluir futuramente para um sistema de embeddings e busca semântica.

22. Aplicações

Criar sistema de acompanhamento de candidaturas.

Status:

Interessado

Aplicado

Entrevista

Teste técnico

Oferta

Rejeitado

O usuário pode mover a candidatura entre etapas.

Criar uma visualização estilo Kanban.

23. Favoritos

Permitir favoritar:

vagas

currículos

empresas

24. Página de perfil

Criar:

/profile

Seções:

Informações pessoais

Dados profissionais

Formação

Experiências

Skills

Links

Preferências de emprego

25. Página de configurações

Criar:

/settings

Como ainda não existe autenticação, não implementar configurações relacionadas a:

troca de senha

recuperação de senha

email da conta

sessões autenticadas

Por enquanto, utilizar somente configurações relevantes para o aplicativo.

Seções:

Preferências

Notificações

Privacidade

Dados locais

Preferências de currículo

Deixar a arquitetura preparada para receber posteriormente:

Conta

Segurança

Assinatura

Sessões

26. Navegação

Sidebar no desktop.

Itens:

Dashboard

Encontrar vagas

Minhas vagas

Meu currículo

Currículos personalizados

Candidaturas

Perfil

Configurações

No mobile, utilizar menu lateral através do Sheet do shadcn/ui.

27. Experiência visual

Criar microinterações sutis:

loading states

skeletons

hover states

transições

feedback de sucesso

feedback de erro

progress bars

estados vazios

Evitar animações exageradas.

28. Estados vazios

Não deixar telas vazias.

Criar mensagens amigáveis.

Exemplo:

Nenhuma vaga encontrada

"Você ainda não possui vagas salvas. Comece explorando oportunidades compatíveis com seu perfil."

Adicionar CTA correspondente.

29. Componentização

Manter arquitetura limpa.

Organizar componentes por domínio.

Exemplo:

components/
  ui/
  onboarding/
  dashboard/
  jobs/
  resume/
  ats/
  profile/
  applications/


Separar:

lib/
services/
repositories/
schemas/
types/
hooks/
utils/


Evitar componentes gigantes.

30. Banco de dados

Criar modelagem completa para entidades como:

UserProfile

Resume

ResumeVersion

Experience

Education

Skill

Certification

Project

Job

JobSkill

Match

SavedJob

Application

AtsAnalysis

ResumeOptimization

Notification

Como ainda não haverá autenticação, o modelo deve ser preparado para posteriormente receber uma entidade User e associar todos os dados a ela.

Não criar dependência obrigatória de autenticação nesta fase.

Criar relacionamentos corretamente.

31. Segurança

Implementar boas práticas:

validação de dados

sanitização

proteção contra manipulação de IDs

tratamento seguro de upload

limite de tamanho de arquivos

validação MIME

tratamento de erros

proteção adequada das APIs

Nunca expor secrets no frontend.

Mesmo sem login, não confiar cegamente em dados enviados pelo cliente.

32. IA

Criar uma camada de abstração para o provedor de IA.

Não deixar o código inteiro dependente diretamente de um único fornecedor.

Criar algo semelhante a:

AIService


Com funções como:

analyzeResume()
analyzeJob()
calculateMatch()
optimizeResume()
extractKeywords()
generateProfessionalSummary()


Isso permitirá trocar o provedor de IA no futuro.

33. Importação de currículo

O parser deve tentar identificar automaticamente:

Nome

Email

Telefone

LinkedIn

GitHub

Resumo

Experiências

Formação

Skills

Certificações

Projetos

Idiomas

Após o processamento, sempre pedir confirmação do usuário antes de salvar definitivamente as informações.

34. Geração ATS

A versão ATS Friendly deve seguir regras como:

layout simples

tipografia legível

hierarquia clara

títulos de seção reconhecíveis

evitar elementos que dificultem parsing

evitar excesso de gráficos

evitar informações exclusivamente visuais

utilizar palavras-chave relevantes

manter conteúdo textual estruturado

A visualização pode ser bonita dentro da aplicação, mas a versão exportada como ATS deve priorizar compatibilidade e legibilidade.

35. Página de criação de currículo ATS

Criar uma página específica:

/resume/create/[jobId]

Estrutura:

Coluna esquerda

Editor do currículo.

Coluna direita

Preview em tempo real.

No topo:

ATS Score

Match Score

Palavras-chave

Botão:

Gerar currículo otimizado

Depois da geração:

Salvar versão

Baixar PDF

Baixar DOCX

36. Explicações transparentes

O sistema nunca deve simplesmente mostrar:

"Match 92%"

Sem explicar a origem.

Sempre mostrar informações como:

"Seu perfil corresponde a 9 dos 10 requisitos principais da vaga."

E mostrar quais requisitos foram considerados.

O score deve ser tratado como uma estimativa de compatibilidade, não como garantia de contratação.

37. Dashboard de inteligência

Criar uma seção chamada:

Insights do seu perfil

Exibir recomendações como:

"Você possui alta compatibilidade com vagas de Backend."

"Adicionar Docker ao currículo pode aumentar sua compatibilidade com determinadas vagas."

"Seu currículo apresenta poucas palavras-chave relacionadas a APIs REST."

"Seu perfil possui boa aderência para vagas Junior."

As sugestões devem ser baseadas nos dados reais do usuário.

38. Design das métricas

Utilizar visualizações simples.

Exemplo:

Match Score
██████████████████░░  92%

ATS Score
█████████████████░░░  87%


Utilizar componentes do shadcn/ui sempre que apropriado.

39. Desktop

No desktop:

┌───────────────────────────────────────────────┐
│ Sidebar │ Header                              │
│         ├─────────────────────────────────────┤
│         │                                     │
│         │ Dashboard                            │
│         │                                     │
│         │ Cards                               │
│         │                                     │
│         │ Vagas recomendadas                 │
│         │                                     │
│         └─────────────────────────────────────┘
└───────────────────────────────────────────────┘


40. Mobile

No mobile:

Sidebar vira menu Sheet

cards ficam empilhados

tabelas se tornam listas/cards

filtros aparecem em Sheet ou Dialog

editor de currículo deve continuar utilizável

41. Código

O código deve ser:

limpo

tipado

modular

reutilizável

escalável

documentado apenas quando necessário

Evitar:

any

lógica duplicada

componentes monolíticos

funções gigantes

valores mágicos

código morto

arquivos desnecessariamente complexos

Utilizar TypeScript de forma rigorosa.

42. UX

Priorizar experiência do usuário.

O usuário deve entender rapidamente:

"Qual vaga combina comigo?"

"Por que ela combina comigo?"

"O que está faltando?"

"Como melhorar meu currículo?"

"Qual versão do currículo devo enviar?"

Todas essas respostas devem estar visíveis na interface.

43. Seed inicial

Criar dados fictícios para desenvolvimento:

perfis

empresas

vagas

skills

currículos

Criar pelo menos 10 vagas fictícias diferentes para testar o matchmaking.

Criar diferentes níveis de compatibilidade.

Como não haverá autenticação, esses dados devem ser utilizados exclusivamente para desenvolvimento/demo.

44. Dados fictícios

Não usar dados reais de pessoas.

Utilizar nomes, emails e empresas fictícias nos seeds.

45. Tratamento de erros

Criar mensagens amigáveis.

Nunca mostrar stack trace ao usuário.

Criar estados:

loading

success

empty

error

46. Performance

Priorizar:

carregamento rápido

lazy loading quando necessário

paginação

cache

queries eficientes

otimização de imagens

evitar chamadas desnecessárias à IA

47. SEO

A landing page deve possuir:

title

description

Open Graph

favicon

metadata

As páginas internas de utilização do aplicativo podem ser configuradas conforme necessário.

48. Acessibilidade

Seguir boas práticas de acessibilidade:

navegação por teclado

labels

contraste adequado

foco visível

aria quando necessário

botões semanticamente corretos

formulários acessíveis

49. Resultado esperado

Entregar uma aplicação funcional de ponta a ponta.

O usuário deve conseguir:

Entrar na aplicação
↓
Clicar em "Começar agora"
↓
Criar perfil
↓
Adicionar currículo
↓
Analisar currículo
↓
Encontrar vagas
↓
Ver Match
↓
Ver requisitos faltantes
↓
Adaptar currículo para a vaga
↓
Analisar ATS
↓
Salvar nova versão
↓
Baixar currículo
↓
Acompanhar candidatura


Nenhuma dessas etapas deve exigir login ou cadastro nesta primeira versão.

50. Prioridade do desenvolvimento

Desenvolva nesta ordem:

Fase 1

Setup

Design System

Layout

Entrada direta sem autenticação

Banco

Perfil

Onboarding

Fase 2

Currículo

Importação de currículo

Editor de currículo

Preview

Fase 3

Sistema de vagas

Pesquisa

Filtros

Matchmaking

Fase 4

Análise ATS

Análise de vaga

Geração de currículo personalizado

Sistema de versões

Fase 5

Candidaturas

Favoritos

Insights

Notificações

Fase 6

Performance

Segurança

Responsividade

Acessibilidade

Testes

Refinamento visual

Fase futura

Não implementar agora, mas deixar a arquitetura preparada para:

Cadastro

Login

Recuperação de senha

Usuários autenticados

Persistência por conta

Perfil vinculado a usuário

Assinatura

Planos

Controle de uso de IA

51. Regra importante sobre IA e currículo

A inteligência artificial deve otimizar a apresentação das informações existentes, mas não pode inventar informações profissionais.

Nunca criar:

experiência falsa

empresa falsa como experiência

certificação inexistente

tecnologia que o usuário nunca utilizou

cargo que o usuário nunca ocupou

resultados que não foram informados

números inventados

Quando alguma informação necessária não existir, o sistema deve sinalizar:

"Essa informação não foi encontrada no seu perfil."

52. Regra importante sobre ATS

Não vender o ATS Score como garantia de aprovação.

Utilizar linguagem como:

"Estimativa de compatibilidade ATS"

"Análise baseada nos requisitos encontrados nesta vaga."

53. Resultado visual final

O produto deve parecer um SaaS real pronto para ser apresentado a usuários.

A primeira impressão deve ser:

"Essa plataforma entende meu currículo, encontra as vagas certas e me ajuda a adaptar minha candidatura."

O design deve ser:

moderno

minimalista

profissional

tecnológico

intuitivo

elegante

Utilize ShadCN/UI + Tailwind CSS como base visual obrigatória.

A paleta principal deve ser composta por:

verde claro + branco + verde escuro

Evite utilizar outras cores como identidade principal.

Crie uma experiência consistente em todas as páginas, mantendo o mesmo Design System, espaçamentos, tipografia, componentes, estados e padrões de interação.

Objetivo final

Construir um produto completo de Matchmaking de vagas + análise de currículo + otimização ATS + geração de currículo personalizado, com uma arquitetura profissional e escalável, sem login ou cadastro nesta primeira versão, permitindo que qualquer usuário entre e utilize imediatamente o sistema.

A arquitetura deve permanecer preparada para adicionar autenticação, contas, assinatura e persistência individual posteriormente.

Comece pelo projeto base e desenvolva a aplicação de forma incremental, garantindo que cada etapa esteja funcional antes de avançar para a próxima.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://dio-teste-jobmatch-v30.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/84a9cf4a-2b9a-4cd9-9804-0aec43fb83a2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
