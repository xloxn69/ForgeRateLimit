# ForgePages

Light-weight paging helpers for @tryforge/forgescript.

## Installation

```bash
npm install forgepages
```

Or install directly from GitHub:

```bash
npm install "github:xloxn69/ForgePages#main"
```

## Usage

```js
const { ForgeClient } = require("@tryforge/forgescript");
const ForgePages = require("forgepages");

const client = new ForgeClient({
  prefixes: ["!"],
  extensions: [new ForgePages()]
});
```

## Functions

| Function | Description |
|----------|-------------|
| `$pagesInit` | Create/overwrite a store |
| `$pagesList` | Get a page |
| `$pagesSlice` | Get any slice |
| `$pageCount` | Total pages |
| `$addPageData` | Append items |
| `$removePageEntry` | Delete by index |
| `$sortPages` | Sort asc/desc |
| `$searchPages` | Locate query's page |

## Example

```
$pagesInit[fruits;|;Apple|Banana|Cherry|Date|Elderberry]
$pagesList[fruits;1;3]
// Returns: Apple|Banana|Cherry
```

## License

MIT 