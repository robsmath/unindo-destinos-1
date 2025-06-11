# Mudanças Necessárias no Backend - Funcionalidade Deletar Conta

## Resumo das Alterações Frontend
- ✅ Removida a aba "Notificações" da página de configurações
- ✅ Adicionada funcionalidade completa de deletar conta na aba "Conta"
- ✅ Implementado fluxo de 2 etapas com validação de senha
- ✅ Criados modais com avisos detalhados sobre a irreversibilidade da ação

## Endpoints Necessários no Backend

### 1. Validar Senha para Deleção
```
POST /usuarios/me/validar-senha
Content-Type: application/json

Body:
{
  "senha": "string"
}

Responses:
- 200: Senha válida
- 401: Senha incorreta
- 400: Dados inválidos
```

### 2. Deletar Conta do Usuário
```
DELETE /usuarios/me

Headers:
Authorization: Bearer <token>

Responses:
- 200: Conta deletada com sucesso
- 401: Não autorizado
- 404: Usuário não encontrado
```

## Regras de Negócio para Implementar

### Validação de Senha
- Verificar se a senha fornecida confere com a senha atual do usuário
- Utilizar a mesma criptografia usada no login
- Retornar erro 401 se a senha estiver incorreta

### Deleção da Conta
A deleção deve ser **CASCATEADA** e remover/cancelar:

1. **Viagens criadas pelo usuário:**
   - Status deve ser alterado para "CANCELADA"
   - Participantes devem ser notificados
   - Viagens em status "RASCUNHO" podem ser deletadas completamente

2. **Participações em viagens:**
   - Remover o usuário de todas as viagens onde ele é participante
   - Criadores das viagens devem ser notificados

3. **Solicitações:**
   - Deletar todas as solicitações enviadas (status PENDENTE)
   - Deletar todas as solicitações recebidas (status PENDENTE)
   - Notificar usuários afetados

4. **Avaliações:**
   - Deletar todas as avaliações feitas pelo usuário
   - Deletar todas as avaliações recebidas pelo usuário

5. **Álbum e fotos:**
   - Deletar todas as fotos do álbum
   - Remover arquivos do storage/S3

6. **Dados pessoais:**
   - Deletar completamente o registro do usuário
   - Remover foto de perfil do storage

7. **Conversas/Mensagens:**
   - Deletar todas as conversas onde o usuário participa
   - Ou marcar mensagens como "usuário deletado"

8. **Bloqueios:**
   - Remover todos os bloqueios feitos pelo usuário
   - Remover todos os bloqueios onde o usuário foi bloqueado

9. **Token de autenticação:**
   - Invalidar todos os tokens JWT do usuário

## Considerações de Segurança

1. **Autenticação obrigatória:** Verificar se o usuário está autenticado
2. **Validação de senha:** Confirmar identidade antes da deleção
3. **Log de auditoria:** Registrar a deleção para fins de auditoria
4. **Backup temporal:** Considerar manter backup por período determinado (LGPD)

## Notificações

### Usuários a serem notificados:
1. **Criadores de viagens** onde o usuário era participante
2. **Participantes de viagens** criadas pelo usuário
3. **Usuários com solicitações pendentes** com o usuário deletado

### Conteúdo das notificações:
- "Um participante cancelou sua participação na viagem X"
- "A viagem X foi cancelada pelo criador"
- "Uma solicitação foi cancelada automaticamente"

## Exemplo de Implementação Java/Spring

```java
@DeleteMapping("/me")
@Transactional
public ResponseEntity<Void> deletarConta(Authentication auth) {
    String email = auth.getName();
    Usuario usuario = usuarioRepository.findByEmail(email)
        .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
    
    // 1. Cancelar viagens criadas
    viagemService.cancelarViagensCriadas(usuario.getId());
    
    // 2. Remover participações
    viagemService.removerParticipacoes(usuario.getId());
    
    // 3. Cancelar solicitações
    solicitacaoService.cancelarSolicitacoes(usuario.getId());
    
    // 4. Deletar avaliações
    avaliacaoService.deletarAvaliacoes(usuario.getId());
    
    // 5. Deletar álbum
    albumService.deletarAlbum(usuario.getId());
    
    // 6. Deletar conversas
    chatService.deletarConversas(usuario.getId());
    
    // 7. Deletar bloqueios
    bloqueioService.deletarBloqueios(usuario.getId());
    
    // 8. Log de auditoria
    auditService.registrarDelecaoUsuario(usuario.getId(), usuario.getEmail());
    
    // 9. Deletar usuário
    usuarioRepository.delete(usuario);
    
    return ResponseEntity.ok().build();
}

@PostMapping("/me/validar-senha")
public ResponseEntity<Void> validarSenha(
    @RequestBody ValidarSenhaRequest request,
    Authentication auth
) {
    String email = auth.getName();
    if (authService.validarSenha(email, request.getSenha())) {
        return ResponseEntity.ok().build();
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
}
```

## Ordem de Implementação Recomendada

1. **Criar endpoint de validação de senha**
2. **Implementar serviços de limpeza cascateada**
3. **Criar endpoint de deleção com transação**
4. **Implementar sistema de notificações**
5. **Adicionar logs de auditoria**
6. **Testes unitários e de integração**

## Frontend Pronto ✅

O frontend já está completamente implementado e funcionando:
- Modal de confirmação em 2 etapas
- Validação de senha duplicada
- Avisos detalhados sobre a irreversibilidade
- Loading states e tratamento de erros
- Redirecionamento após deleção bem-sucedida 