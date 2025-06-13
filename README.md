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

**Example:**
```
$pagesInit[users;,;Alice,Bob,Charlie,David,Eve]
$c[Returns: true - Creates store "users" with 5 entries]
```

#### `$addPageData[id;values]`
Appends new entries to an existing store.

**Parameters:**
- `id` (String) - Store identifier
- `values` (String) - Values to append (will be split by store's separator)

**Returns:** Boolean (true if successful)

**Example:**
```
$pagesInit[fruits;,;Apple,Banana]
$addPageData[fruits;Cherry,Date]
$pagesList[fruits;1;10]
$c[Returns: "Apple,Banana,Cherry,Date" - Added 2 new entries to store]
```

#### `$removePageEntry[id;index]`
Removes one entry by 1-based index.

**Parameters:**
- `id` (String) - Store identifier  
- `index` (Number) - 1-based index to remove

**Returns:** Boolean (true if item was removed, false if index out of bounds)

**Example:**
```
$pagesInit[colors;,;Red,Green,Blue,Yellow]
$removePageEntry[colors;2]
$pagesList[colors;1;10]
$c[Returns: "Red,Blue,Yellow" - Removed "Green" (index 2)]
```

### Query Functions

#### `$pagesList[id;page;itemsPerPage]`
Returns a specific page of data.

**Parameters:**
- `id` (String) - Store identifier
- `page` (Number) - Page number to get (1-based)
- `itemsPerPage` (Number) - Items per page

**Returns:** String (joined data using store's separator)

**Example:**
```
$pagesInit[items;,;Item1,Item2,Item3,Item4,Item5,Item6]
$pagesList[items;2;3]
$c[Returns: "Item4,Item5,Item6" - Page 2 with 3 items per page]
```

#### `$pagesSlice[id;startIndex;count]`
Returns an arbitrary slice of data from start index.

**Parameters:**
- `id` (String) - Store identifier
- `startIndex` (Number) - 1-based start index
- `count` (Number) - Number of items to get

**Returns:** String (joined data using store's separator)

**Example:**
```
$pagesInit[letters;,;A,B,C,D,E,F,G,H]
$pagesSlice[letters;3;4]
$c[Returns: "C,D,E,F" - 4 items starting from position 3]
```

#### `$pageCount[id;itemsPerPage?]`
Returns the total number of pages for given items per page.

**Parameters:**
- `id` (String) - Store identifier
- `itemsPerPage` (Number, optional) - Items per page (default: 10)

**Returns:** Number (total pages)

**Example:**
```
$pagesInit[data;,;1,2,3,4,5,6,7,8,9,10,11,12,13]
$pageCount[data;5]
$c[Returns: 3 - 13 items divided by 5 per page = 3 pages]
```

#### `$searchPages[id;query;itemsPerPage?]`
Finds the page number where a search query first appears.

**Parameters:**
- `id` (String) - Store identifier
- `query` (String) - Search query (case-insensitive)
- `itemsPerPage` (Number, optional) - Items per page (default: 10)

**Returns:** Number (page number, or 0 if not found)

**Example:**
```
$pagesInit[animals;,;Cat,Dog,Elephant,Fish,Giraffe,Horse]
$searchPages[animals;Elephant;3]
$c[Returns: 1 - "Elephant" found on page 1 with 3 items per page]
```

#### `$advancedSearchPages[id;variable;code]`
Maps through each entry in a paging store, runs code for each entry, and returns all results joined by separator.

**Parameters:**
- `id` (String) - The store identifier
- `variable` (String) - The name of the variable to assign each entry to (accessible as `$env[variable]`)
- `code` (String) - ForgeScript code to execute for each entry (use $return to output values)

**Returns:** String (all returned values joined by store's separator)

**Example:**
```
$pagesInit[numbers;,;1,2,3,4,5]
$advancedSearchPages[numbers;num;$return[$math[$env[num] * 2]]]
$c[Returns: "2,4,6,8,10" - Each number doubled using $return]
```

### Utility Functions

#### `$sortPages[id;direction?]`
Sorts the store data alphabetically.

**Parameters:**
- `id` (String) - Store identifier
- `direction` (String, optional) - Sort direction: "asc" (default) or "desc"

**Returns:** Boolean (true if successful)

**Example:**
```
$pagesInit[names;,;Zoe,Alice,Bob,Charlie]
$sortPages[names;asc]
$pagesList[names;1;10]
$c[Returns: "Alice,Bob,Charlie,Zoe" - Sorted alphabetically ascending]
```

#### `$advancedSortPages[id;var1;var2;code]`
Advanced sort for page store entries using custom comparison logic.

**Parameters:**
- `id` (String) - The store identifier
- `var1` (String) - The $env variable 1 to hold first comparison value
- `var2` (String) - The $env variable 2 to hold second comparison value  
- `code` (String) - Code to execute for comparison (should return number: negative if first < second, 0 if equal, positive if first > second)

**Returns:** Boolean (true if successful)

**Example:**
```
$pagesInit[words;,;Cat,Elephant,Dog,Fish]
$advancedSortPages[words;w1;w2;$sub[$len[$env[w1]];$len[$env[w2]]]]
$pagesList[words;1;10]
$c[Returns: "Cat,Dog,Fish,Elephant" - Sorted by string length (shortest first)]
```



## Complete Usage Example

```
$c[Complete workflow example]
$pagesInit[users;,;Alice,Bob,Charlie,David,Eve,Frank,Grace,Henry,Ivan,Jack]
$addPageData[users;Kate,Liam,Maya,Noah,Olivia]
$sortPages[users;asc]

$c[Display pagination info]
Total users: $len[$split[$pagesList[users;1;100];,]]
Total pages (4 per page): $pageCount[users;4]
Page 1: $pagesList[users;1;4]
Page 2: $pagesList[users;2;4]

$c[Search and modify]
Maya is on page: $searchPages[users;Maya;4]
$removePageEntry[users;5]
$c[After removing 5th user, page 2 is now: $pagesList[users;2;4]]
```
$advancedSortPages[items;x;y;$sub[$charCount[$env[x]];$charCount[$env[y]]]]


```

## Support
If you need any assistance, don't hesitate to reach out by opening a support form in the official BotForge Discord server! :D

## License

MIT