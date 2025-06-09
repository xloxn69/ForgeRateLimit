| Function | Description |
|----------|-------------|
| `$pagesInit` | Creates / overwrites a paging store. |
| `$addPageData` | Appends entries to an existing store. |
| `$removePageEntry` | Deletes one entry by 1-based index. |
| `$pagesList` | Returns a fixed-width page of data. |
| `$pagesSlice` | Returns an arbitrary slice from start, count. |
| `$pageCount` | How many pages the store has at N per-page. |
| `$searchPages` | Finds the page on which a query first appears. |
| `$advancedSearchPages` | Loops through each entry in a paging store (bound to your variable), runs your code snippet, and returns all entries where it returned true. |
| `$sortPages` | Alphabetically sorts a store asc/desc. |
| `$advancedSortPages` | Advanced sort for page store entries using custom comparison logic |