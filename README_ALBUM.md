# Componente AlbumDeFotos

Um componente React moderno e responsivo para gerenciar e visualizar álbuns de fotos, seguindo o padrão visual do projeto Unindo Destinos.

## 🎯 Funcionalidades

### ✅ Modo Proprietário (isOwner=true)
- Upload de até 6 fotos
- Remoção de fotos existentes
- Validação de tipos de arquivo (imagens)
- Validação de tamanho (máx. 5MB)
- Feedback visual durante upload/remoção
- Aviso quando atingir limite de fotos

### ✅ Modo Visualização (isOwner=false)
- Visualização do álbum de outros usuários
- Sem opções de upload ou remoção
- Interface clean e focada na visualização

### ✅ Galeria Fullscreen
- Visualização fullscreen com alta qualidade
- Navegação por teclado (setas, ESC)
- Thumbnails na parte inferior
- Contador de fotos
- Animações suaves com Framer Motion
- Controles intuitivos

## 🚀 Como Usar

### No Perfil do Usuário
```tsx
// Na página de perfil (/profile) como aba
<AlbumDeFotos isOwner={true} />
```

### No Modal de Usuário
```tsx
// Para visualizar álbum de outro usuário
<AlbumDeFotos isOwner={false} usuarioId={outroUsuario.id} />
```

### Props

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `isOwner` | `boolean` | `false` | Se true, permite upload e remoção |
| `usuarioId` | `number` | `undefined` | ID do usuário para visualizar fotos |
| `className` | `string` | `""` | Classes CSS adicionais |

## 🎨 Design

### Características Visuais
- **Minimalista**: Interface clean e moderna
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Animações**: Transitions suaves com Framer Motion
- **Gradientes**: Cores que seguem o padrão do projeto (primary → orange-500)
- **Grid Adaptativo**: 2 colunas no mobile, 3 no desktop
- **Hover Effects**: Efeitos elegantes ao passar o mouse

### Estados Visuais
- **Loading**: Spinner durante carregamento
- **Vazio**: Ilustração e call-to-action quando não há fotos
- **Limite**: Aviso quando atingir 6 fotos
- **Upload**: Feedback visual durante upload
- **Erro**: Toast notifications para erros

## 🔧 Integração

### Services Utilizados
- `uploadFotoAlbum(file: File)`: Upload de nova foto
- `listarFotosAlbum()`: Lista fotos do usuário logado
- `listarFotosAlbumUsuario(usuarioId: number)`: Lista fotos de outro usuário
- `removerFotoAlbum(id: number)`: Remove foto específica

### DTOs
```typescript
interface AlbumFotoDTO {
  id: number;
  urlFoto: string;
}
```

## 🎯 Exemplos de Uso

### 1. Integração no Profile.tsx
```tsx
// Adicionado como nova aba
const tabs = [
  { label: "Dados Pessoais", param: "dados" },
  { label: "Álbum", param: "album" }, // ← Nova aba
  // ... outras abas
];

// Na TabPanel correspondente
<TabPanel>
  <AlbumDeFotos isOwner={true} />
</TabPanel>
```

### 2. Integração no MiniPerfilModal.tsx
```tsx
// Adicionado como nova aba no modal
<Tab>
  <ImageIcon className="w-4 h-4" />
  Álbum
</Tab>

// Na TabPanel correspondente
<TabPanel className="p-6">
  <AlbumDeFotos isOwner={false} usuarioId={usuario.id} />
</TabPanel>
```

## 🎬 Interações

### Navegação por Teclado (Galeria Fullscreen)
- **ESC**: Fechar galeria
- **→**: Próxima foto
- **←**: Foto anterior

### Validações
- **Tipos aceitos**: JPEG, PNG, WebP, GIF
- **Tamanho máximo**: 5MB por foto
- **Limite**: Máximo 6 fotos por usuário

### Estados de Loading
- Carregamento inicial do álbum
- Upload de novas fotos
- Remoção de fotos

## 🎨 Cores e Estilos

Seguindo o padrão do projeto:
- **Primary**: `#ea580c` (laranja)
- **Gradients**: `from-primary to-orange-500`
- **Backgrounds**: Branco com transparência
- **Borders**: Bordas arredondadas (rounded-xl, rounded-2xl)
- **Shadows**: Sombras sutis e elegantes

## 📱 Responsividade

- **Mobile**: Grid 2x3, botões adaptados para touch
- **Desktop**: Grid 3x2, hover effects mais elaborados
- **Tablet**: Híbrido, adaptação automática

## 🚨 Tratamento de Erros

- **Arquivo inválido**: Toast com mensagem clara
- **Tamanho excedido**: Aviso de limite de 5MB
- **Erro de upload**: Feedback visual e toast
- **Erro de remoção**: Toast de erro
- **Erro de carregamento**: Estado de erro com retry

## 🎯 Performance

### Otimizações
- **Lazy loading**: Imagens carregadas sob demanda
- **Animações otimizadas**: Framer Motion com configurações de performance
- **Estados locais**: Gerenciamento eficiente de estado
- **Debounce**: Evita múltiplos uploads simultâneos

### Acessibilidade
- **ARIA labels**: Botões com labels descritivos
- **Keyboard navigation**: Navegação completa por teclado
- **Screen readers**: Suporte a leitores de tela
- **Focus management**: Gerenciamento adequado do foco

Este componente oferece uma experiência completa e profissional para gerenciamento de álbuns de fotos, mantendo a consistência visual e UX do projeto Unindo Destinos. 