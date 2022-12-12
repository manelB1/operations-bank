tipos de parametro

Rout Params: seu objetivo é identificar um recurso, editar, buscar ou deletar

Query Params: Seu objetivo é realizar paginação, filtros.

body params: Os objetos inserção/alteração(JSON)

### Requirements

[x] Deve ser possivel criar uma conta
[x] Deve ser possivel buscar o extrato bancário do client
[x] Deve ser possivel realizar um depósito
[x] Deve ser possivel realizar um saque
[x] Deve ser possivel buscar o extrato bancário do client por data
[x] Deve ser possivel atualizar dados da conta do cliente
[x] Deve ser possivel obter dados da conta do cliente
[x] Deve ser possivel deletar uma conta
[x] Deve ser possivel retornar o balance


## Regras de negocios

[x] Não deve ser possível cadastrar uma conta com CPF já existente
[x] Não deve ser possível buscar extrato em uma conta não existente
[x] Não deve ser possível fazer depósito em uma conta não existente
[x] Não deve ser possível fazer saque em uma conta não existente
[x] Não deve ser possível fazer saque quando o saldo for insuficiente
[x] Não deve ser possível excluir uma conta não existente

