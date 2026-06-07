# Vila Refúgio Hotel

Site institucional da **Vila Refúgio Hotel**, desenvolvido por Gabriel M. C. para apresentar chalés, experiências, áreas de lazer e canais de contato em uma experiência visual premium.

Este repositório é o projeto oficial do site da Vila Refúgio Hotel, desenvolvido e organizado para representar a identidade da marca Vila Refúgio.

## Visão geral

- Interface em React com Vite.
- Animações e transições com GSAP.
- Scroll suave com Lenis.
- Estilos com Tailwind CSS 4 e CSS modular por componente.
- Deploy planejado para GitHub Pages em `/capsule/`.

## Tecnologias

- React 19
- Vite 6
- React Router 7
- Tailwind CSS 4
- GSAP 3
- Lenis
- Three.js
- React Icons

## Como rodar localmente

Instale as dependências do frontend:

```bash
cd frontend
npm install
```

Rode o servidor de desenvolvimento:

```bash
npm run dev
```

O projeto usa `base: '/capsule/'`, então em desenvolvimento o endereço padrão fica:

```text
http://localhost:5173/capsule/
```

## Scripts principais

Na raiz:

```bash
npm run dev
npm run build
npm run preview
```

No frontend:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Publicação no GitHub

Repositório de destino:

```text
https://github.com/gabrielmco/Vila-refugio-hotel.git
```

Para conectar este projeto ao repositório remoto:

```bash
git remote add origin https://github.com/gabrielmco/Vila-refugio-hotel.git
git branch -M main
git push -u origin main
```

Se o remoto `origin` já existir, atualize a URL:

```bash
git remote set-url origin https://github.com/gabrielmco/Vila-refugio-hotel.git
git branch -M main
git push -u origin main
```

## Estrutura

```text
frontend/
  public/
  src/
    assets/
    components/
    constants/
    layouts/
    lib/
    pages/
```

## Observações de produção

- Arquivos de auditoria, screenshots locais, `dist` e `node_modules` não devem ser versionados.
- Links de contato podem ser mantidos como placeholders enquanto os dados oficiais não forem definidos.
- Antes de publicar, rode `npm run lint` e `npm run build` dentro de `frontend`.

## Autor

Projeto desenvolvido e mantido por **Gabriel M. C.**
