# ForgePages

ForgePages is a extension built for ForgeScript, enabling you to easily create, manage, and navigate through paginated data directly in your bot.

## Installation

```bash
npm install github:xloxn69/ForgePages
```

## Usage

```javascript
const { ForgeClient } = require("@tryforge/forgescript");
const ForgePages = require("forgepages");

const client = new ForgeClient({
    extensions: [
        new ForgePages()
    ]
});
```

## Functions

### Core Functions

#### `$pagesInit[id;separator;rawData]`
Creates or overwrites a pagination store with data split by separator.

**Parameters:**
- `id` (String) - Store identifier
- `separator` (String) - Separator to split data by
- `rawData` (String) - Raw data string to split

**Returns:** Boolean (true if successful)

#### `$addPageData[id;values]`
Appends new entries to an existing store.

**Parameters:**
- `id` (String) - Store identifier
- `values` (String) - Values to append (will be split by store's separator)

**Returns:** Boolean (true if successful)

#### `$removePageEntry[id;index]`
Removes one entry by 1-based index.

**Parameters:**
- `id` (String) - Store identifier  
- `index` (Number) - 1-based index to remove

**Returns:** Boolean (true if item was removed, false if index out of bounds)

### Query Functions

#### `$pagesList[id;page;itemsPerPage]`
Returns a specific page of data.

**Parameters:**
- `id` (String) - Store identifier
- `page` (Number) - Page number to get (1-based)
- `itemsPerPage` (Number) - Items per page

**Returns:** String (joined data using store's separator)

#### `$pagesSlice[id;startIndex;count]`
Returns an arbitrary slice of data from start index.

**Parameters:**
- `id` (String) - Store identifier
- `startIndex` (Number) - 1-based start index
- `count` (Number) - Number of items to get

**Returns:** String (joined data using store's separator)

#### `$pageCount[id;itemsPerPage?]`
Returns the total number of pages for given items per page.

**Parameters:**
- `id` (String) - Store identifier
- `itemsPerPage` (Number, optional) - Items per page (default: 10)

**Returns:** Number (total pages)

#### `$searchPages[id;query;itemsPerPage?]`
Finds the page number where a search query first appears.

**Parameters:**
- `id` (String) - Store identifier
- `query` (String) - Search query (case-insensitive)
- `itemsPerPage` (Number, optional) - Items per page (default: 10)

**Returns:** Number (page number, or 0 if not found)

#### `$advancedSearchPages[id;variable;code;per?]`
Filters entries via a ForgeScript code snippet that must return true. Each entry is bound to your specified variable.

**Parameters:**
- `id` (String) - Store identifier
- `variable` (String) - Variable name to bind each entry to (accessible as `$env[variable]`)
- `code` (String) - ForgeScript code to execute against each entry
- `per` (Number, optional) - Items per page (unused, for compatibility)

**Returns:** String (filtered entries joined by store's separator)

### Utility Functions

#### `$sortPages[id;direction?]`
Sorts the store data alphabetically.

**Parameters:**
- `id` (String) - Store identifier
- `direction` (String, optional) - Sort direction: "asc" (default) or "desc"

**Returns:** Boolean (true if successful)

## Complete Example

```
$c[Initialize a store with user data]
$pagesInit[users;,;Alice,Bob,Charlie,David,Eve,Frank,Grace,Henry,Ivan,Jack]

$c[Add more users to the store]
$addPageData[users;Kate,Liam,Maya,Noah,Olivia]

$c[Sort users alphabetically in ascending order]
$sortPages[users;asc]

$c[Get total number of pages with 4 users per page]
$pageCount[users;4]
$c[Returns: 4]

$c[Get the first page with 4 users per page]
$pagesList[users;1;4]
$c[Returns: "Alice,Bob,Charlie,David"]

$c[Get the second page with 4 users per page]
$pagesList[users;2;4]
$c[Returns: "Eve,Frank,Grace,Henry"]

$c[Get the third page with 4 users per page]
$pagesList[users;3;4]
$c[Returns: "Ivan,Jack,Kate,Liam"]

$c[Get a custom slice: 3 users starting from index 6]
$pagesSlice[users;6;3]
$c[Returns: "Frank,Grace,Henry"]

$c[Find which page contains "Maya" with 4 users per page]
$searchPages[users;Maya;4]
$c[Returns: 4]

$c[Remove the 5th user (Eve)]
$removePageEntry[users;5]

$c[Check total pages again after removal]
$pageCount[users;4]
$c[Returns: 4 (now 14 users total)]

$c[Get updated second page after removal]
$pagesList[users;2;4]
$c[Returns: "Frank,Grace,Henry,Ivan"]

$c[Sort in descending order]
$sortPages[users;desc]

$c[Get first page after descending sort]
$pagesList[users;1;4]
$c[Returns: "Olivia,Noah,Maya,Liam"]

$c[Create another store with different separator]
$pagesInit[items;|;Phone|Laptop|Tablet|Watch|Camera|Speaker]

$c[Get total pages for items with 2 per page]
$pageCount[items;2]
$c[Returns: 3]

$c[Get second page of items]
$pagesList[items;2;2]
$c[Returns: "Tablet|Watch"]

$c[Search for "laptop" (case-insensitive)]
$searchPages[items;laptop;2]
$c[Returns: 1]

$c[Find devices containing "a"]
$advancedSearchPages[items;item;$return[$checkContains[$env[item];a]]]
$c[Returns: "Camera"]

$c[Find devices with exactly 5 characters]
$advancedSearchPages[items;device;$return[$equals[$stringLength[$env[device]];5]]]
$c[Returns: "Phone|Watch"]

```

## Support
If you need any assistance, don't hesitate to reach out by opening a support form in the official BotForge Discord server! :D

## License

MIT