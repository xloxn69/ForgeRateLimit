| Function | Description |
|----------|-------------|
| `$pagesInit` | Creates / overwrites a paging store. |
| `$addPageData` | Appends entries to an existing store. |
| `$removePageEntry` | Deletes one entry by 1-based index. |
| `$pagesList` | Returns a fixed-width page of data. |
| `$pagesSlice` | Returns an arbitrary slice from start, count. |
| `$pageCount` | How many pages the store has at N per-page. |
| `$searchPages` | Finds the page on which a query first appears. |
| `$advancedSearchPages` | Runs your snippet against each page-store entry (bound to your variable) and returns those entries where it returns true. |
| `$sortPages` | Alphabetically sorts a store asc/desc. |