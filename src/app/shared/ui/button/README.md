# `<app-button>`

Composant Button standalone, accessible, basé Tailwind.

## Usage

```html
<app-button (pressed)="save()">Save</app-button>

<app-button variant="danger" size="lg" (pressed)="remove()">
  Delete account
</app-button>

<app-button type="submit" [loading]="submitting()" [fullWidth]="true">
  Create
</app-button>
```

## Inputs

| Input       | Type                                            | Défaut      | Description |
|-------------|-------------------------------------------------|-------------|-------------|
| `variant`   | `'primary' \| 'secondary' \| 'danger' \| 'ghost'` | `'primary'` | Style visuel |
| `size`      | `'sm' \| 'md' \| 'lg'`                          | `'md'`      | Taille |
| `type`      | `'button' \| 'submit' \| 'reset'`               | `'button'`  | Attribut HTML `type` |
| `disabled`  | `boolean`                                       | `false`     | Désactive le bouton |
| `loading`   | `boolean`                                       | `false`     | Affiche un spinner + désactive |
| `fullWidth` | `boolean`                                       | `false`     | `w-full` |

## Outputs

| Output    | Payload      | Description |
|-----------|--------------|-------------|
| `pressed` | `MouseEvent` | Émis au clic (jamais quand `disabled` ou `loading`) |

## Accessibilité

- Utilise un `<button>` natif → focus, clavier, screen reader gratuits.
- `aria-busy="true"` automatique en mode `loading`.
- Texte du spinner masqué visuellement mais lu par les lecteurs d'écran (`sr-only`).
- Anneau de focus visible (`focus-visible:outline`).

## Tests

Voir [`button.component.spec.ts`](./button.component.spec.ts).
