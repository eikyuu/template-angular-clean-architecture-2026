# features/

Chaque sous-dossier est une **feature autonome** suivant la Clean Architecture à 4 couches.

```
<feature>/
├── domain/         # entités, VO, erreurs, ports (interfaces de repos)
├── application/    # use-cases, signal stores, ports applicatifs
├── infrastructure/ # HTTP repos, mappers, DTO, fakes, providers DI
└── presentation/   # composants, pages, routes
```

## Règles

- Aucune feature n'importe une autre feature.
- `domain/` ne dépend de rien (zéro import Angular/RxJS/HTTP).
- `application/` ne dépend que de `domain/`.
- `infrastructure/` implémente les ports de `domain/`.
- `presentation/` consomme uniquement `application/` et `shared/`.

Voir [`docs/ARCHITECTURE.md`](../../../docs/ARCHITECTURE.md) et [`docs/FEATURE-RECIPE.md`](../../../docs/FEATURE-RECIPE.md).

## Exemple

La feature `users/` sert de référence — elle implémente tous les patterns du template.
