# core/errors

Hiérarchie d'erreurs partagée.

- `DomainError` — base abstraite des erreurs métier. À sous-classer dans chaque feature (`InvalidEmailError`, `UserNotFoundError`…).
- `InfrastructureError` — erreurs techniques (HTTP, storage). Encapsule la cause d'origine.

Règle : **jamais** de `throw 'string'` ni de `throw new Error('...')` brut. Toujours une sous-classe explicite.
