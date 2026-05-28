# shared/

Briques **réutilisables**, sans logique métier ni état partagé.

## Règles

- Composants/pipes/directives génériques (`Button`, `Card`, `RelativeTimePipe`…).
- Pas d'appel HTTP, pas de store, pas d'import d'une feature.
- Doit être consommable depuis n'importe quelle feature.

## Contenu

- `ui/` — composants UI génériques (Button, Card, Input…).
- `pipes/`
- `directives/`
- `utils/` — helpers purs (dates, strings, type `Result<T, E>`).
