# Component guidelines

## Where UI lives

| Kind | Location |
| --- | --- |
| Route shell / composition | `src/app/[locale]/...` |
| Product UI | `src/features/<capability>/` |
| Design primitives | `src/components/ui/` (shadcn only) |

Do not put marketplace logic, fetches, or business copy defaults inside `components/ui`.

## Server vs client

- Default to Server Components.
- Use Client Components for: forms with local state, switchers, menus, suggestion panels, anything needing `useState` / browser events.
- Pass serializable props from server parents. Do not pass server repository instances to the client.

## Features map (current)

- `features/home` — market home
- `features/catalog` — listing card, detail, sections, skeletons
- `features/search` — search panel, famous searches, search screen
- `features/shell` — header, footer, locale/currency/market switchers, mobile menu
- `features/preferences` — currency preference actions
- `features/seo` — document locale, GTM

## Patterns

- Skeletons belong next to the feature they placeholder.
- Prefer URL + cookies for durable preference; keep React state for ephemeral UI (open menus, typed query).
- Interactive surfaces may use cards; decorative card wrappers are unnecessary for static content.
- Preserve existing visual language when editing branded pages.
