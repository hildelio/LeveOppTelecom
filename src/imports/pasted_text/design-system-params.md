Sistema de Design (Parâmetros Globais para a IA)
Forneça estas diretrizes primeiro para ancorar o estilo visual:

Theme: Dark Mode obrigatório.

Background Colors: Azul-marinho profundo (Ex: #0B132B ou #0A0F1A) para fundos principais.

Accent Colors: Ciano brilhante/Azul Elétrico (Ex: #00E5FF ou #00B4D8) para botões de CTA, links ativos e glow effects.

Typography: Fonte sem serifa moderna e geométrica (Inter, Plus Jakarta Sans ou Satoshi). Pesos: ExtraBold para títulos, Regular para corpo de texto.

UI Style: Glassmorphism e Clean Tech. Evitar blocos sólidos. Usar containers com fundo translúcido (rgba(255,255,255, 0.05)), bordas finas translúcidas (rgba(255,255,255, 0.1)) e backdrop-filter: blur(12px).

Prompts por Seção (Para geração modular)
1. Header (Navegação Principal)

"Create a sticky header for an internet provider in dark mode. Background is fully transparent with a slight glassmorphism blur. Left side: modern tech logo placeholder. Center: Navigation links (Home, Planos, Leve TV, Contato) using 'Inter' font, 16px, light gray. Right side: A primary CTA button labeled 'Área do Cliente' with a subtle glowing cyan border, no fill, border-radius 8px."

2. Hero Section (A dobra principal com o vídeo)

"Create a high-impact Hero Section. The background should be a dark placeholder indicating a looping video of glowing fiber optics, covered with a 60% dark overlay for readability. Left-aligned content: A bold headline (H1) 'Ultravelocidade de 300 Mega para sua casa', typography size 64px, white. Below it, a short description text in light gray. Below the text, two buttons side-by-side: Primary CTA 'Assine Já' (solid cyan #00E5FF, black text, soft shadow glow) and a secondary CTA 'Ver Planos' (transparent, white text, cyan border). Add a subtle scroll-down indicator animation at the bottom."

3. Planos de Internet (Foco nos 300 Mega)

"Create a pricing section with a dark navy background. Section title centered: 'Escolha a sua velocidade'. Below, a 3-column flexbox layout with pricing cards. The center card must be highlighted. Card style: Glassmorphism effect (semi-transparent dark background, blurred, thin white border). Inside each card: Speed title (e.g., '300 MEGA'), a large price typography, a divider line, a list of 4 benefits with checkmark icons, and a full-width CTA button at the bottom. The highlighted center card should have a glowing cyan border and a small 'Mais Vendido' badge at the top."

4. Seção LEVE TV (Entretenimento)

"Create a feature section for a streaming service called 'LEVE TV'. Layout: 2 columns. Left column: Text content with a section tag 'Entretenimento', a headline 'Filmes, Séries e Canais ao Vivo', and a short paragraph explaining the family package. Add a CTA 'Conhecer Grade de Canais'. Right column: A dynamic, overlapping grid or bento-box layout showing thumbnails of movies, sports, and TV shows to represent the streaming catalog. Apply rounded corners (16px) and subtle drop shadows to the images."

5. Benefícios e Diferenciais (Microinterações)

"Create a features grid section with 4 equal columns. Dark background. Each column contains a small feature card representing: Fibra Óptica, Suporte 24h, Wi-Fi Grátis, and Instalação Rápida. Card design: minimalist, dark grey background, with a prominent icon at the top. The icons should have a duotone cyan and blue style. Add a hover state design for one of the cards, showing a slight vertical lift and a cyan glow effect to simulate an interaction."

6. Footer

"Create a clean, structured footer in dark mode. 4 columns. Column 1: Logo and short description. Column 2: Quick Links. Column 3: Legal and Support links. Column 4: Contact info (WhatsApp, Email) and Social Media icons. Keep the text small (14px) and muted gray. Add a thin dividing line at the bottom with the copyright text."

Prompt Unificado (Master Prompt)
Copie e cole este bloco se a ferramenta de IA exigir apenas uma única entrada de texto:

"Design a modern, high-tech landing page for an internet provider called 'Leve Telecom'. The entire UI must be in Dark Mode (#0B132B background) with Cyan (#00E5FF) as the primary accent color. Use 'Inter' typography. The design language is 'Clean Tech' heavily utilizing Glassmorphism (translucent cards with blur backgrounds and thin subtle borders) instead of flat solid colors.
Structure:

Header: Glassmorphism sticky navbar with navigation links and a hollow 'Área do Cliente' button.

Hero Section: Full-width dark background indicating a video loop, 60% dark overlay. Left-aligned bold H1 'Ultravelocidade de 300 Mega', subtext, and a solid glowing cyan CTA button 'Assine Já'.

Pricing: 3 glassmorphism pricing cards. Highlight the middle card ('300 Mega') with a cyan glow and a 'Mais Vendido' badge. Include price, features list with checkmarks, and bottom CTA in each card.

Leve TV Section: 2-column layout. Left: Text promoting live channels and movies. Right: A modern bento-grid arrangement of TV show/movie thumbnails with rounded corners.

Features Grid: 4-column icon grid (Fiber, Support, Wi-Fi, Fast Install) with a minimalist design, ready for CSS hover animations.

Footer: Clean 4-column layout with links, contact info, and social icons.
Output a highly structured, auto-layout ready design with proper padding and visual hierarchy."