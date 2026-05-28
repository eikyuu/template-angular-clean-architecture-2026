# core/

Code **transversal** à toute l'application : configuration, infrastructure HTTP de base, gestion d'erreurs globale, guards génériques.

## Règles

- Une seule instance dans toute l'app (singletons via `providedIn: 'root'`).
- Pas de logique métier — toute règle métier vit dans `features/<x>/domain/`.
- N'importe **jamais** une feature.

## Contenu

- `config/` — `AppConfig` + token DI, branché sur `environments/`.
- `http/` — interceptors (base URL, auth, retry…).
- `errors/` — `DomainError`, `InfrastructureError`, `GlobalErrorHandler`.
- `di/` — `InjectionToken` partagés (Clock, IdGenerator…).
- `guards/` — guards globaux (auth, role).
