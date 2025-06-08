# ForgePages

A pagination extension for ForgeScript that provides powerful data pagination functions.

## Installation

```bash
npm install forgepages
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

**Examples:**
```javascript
// Create a store with comma-separated names
$pagesInit[users;,;Alice,Bob,Charlie,David,Eve,Frank,Grace,Henry]

// Create a store with newline-separated items
$pagesInit[items;\n;Item 1\nItem 2\nItem 3\nItem 4\nItem 5]

// Create a store with custom separator
$pagesInit[products;|;Phone|Laptop|Tablet|Watch|Headphones]
```

#### `$addPageData[id;values]`
Appends new entries to an existing store.

**Parameters:**
- `id` (String) - Store identifier
- `values` (String) - Values to append (will be split by store's separator)

**Returns:** Boolean (true if successful)

**Examples:**
```javascript
// Add more users to the existing store
$addPageData[users;Ivan,Jack,Kate]

// Add single item
$addPageData[items;Item 6]

// Add multiple products
$addPageData[products;Camera|Speaker|Monitor]
```

#### `$removePageEntry[id;index]`
Removes one entry by 1-based index.

**Parameters:**
- `id` (String) - Store identifier  
- `index` (Number) - 1-based index to remove

**Returns:** Boolean (true if item was removed, false if index out of bounds)

**Examples:**
```javascript
// Remove the first user
$removePageEntry[users;1]

// Remove the 5th item
$removePageEntry[items;5]

// Remove the last product (if you know it's at index 8)
$removePageEntry[products;8]
```

### Query Functions

#### `$pagesList[id;page;itemsPerPage]`
Returns a specific page of data.

**Parameters:**
- `id` (String) - Store identifier
- `page` (Number) - Page number to get (1-based)
- `itemsPerPage` (Number) - Items per page

**Returns:** String (joined data using store's separator)

**Examples:**
```javascript
// Get first page with 3 users per page
$pagesList[users;1;3]
// Returns: "Alice,Bob,Charlie"

// Get second page with 2 items per page  
$pagesList[items;2;2]
// Returns: "Item 3\nItem 4"

// Get third page with 2 products per page
$pagesList[products;3;2]
// Returns: "Tablet|Watch"
```

#### `$pagesSlice[id;startIndex;count]`
Returns an arbitrary slice of data from start index.

**Parameters:**
- `id` (String) - Store identifier
- `startIndex` (Number) - 1-based start index
- `count` (Number) - Number of items to get

**Returns:** String (joined data using store's separator)

**Examples:**
```javascript
// Get 3 users starting from index 2
$pagesSlice[users;2;3]
// Returns: "Bob,Charlie,David"

// Get 2 items starting from index 4
$pagesSlice[items;4;2]  
// Returns: "Item 4\nItem 5"

// Get 4 products starting from index 1
$pagesSlice[products;1;4]
// Returns: "Phone|Laptop|Tablet|Watch"
```

#### `$pageCount[id;itemsPerPage?]`
Returns the total number of pages for given items per page.

**Parameters:**
- `id` (String) - Store identifier
- `itemsPerPage` (Number, optional) - Items per page (default: 10)

**Returns:** Number (total pages)

**Examples:**
```javascript
// Count pages with 3 users per page
$pageCount[users;3]
// Returns: 3 (if 8 users total)

// Count pages with default 10 items per page
$pageCount[items]
// Returns: 1 (if 6 items total)

// Count pages with 2 products per page
$pageCount[products;2]
// Returns: 3 (if 5 products total)
```

#### `$searchPages[id;query;itemsPerPage?]`
Finds the page number where a search query first appears.

**Parameters:**
- `id` (String) - Store identifier
- `query` (String) - Search query (case-insensitive)
- `itemsPerPage` (Number, optional) - Items per page (default: 10)

**Returns:** Number (page number, or 0 if not found)

**Examples:**
```javascript
// Find which page contains "Charlie" with 3 users per page
$searchPages[users;Charlie;3]
// Returns: 1 (Charlie is on page 1)

// Find which page contains "Item 4" with 2 items per page
$searchPages[items;Item 4;2]
// Returns: 2 (Item 4 is on page 2)

// Search for "laptop" (case-insensitive)
$searchPages[products;laptop;10]
// Returns: 1 (finds "Laptop" on page 1)
```

### Utility Functions

#### `$sortPages[id;direction?]`
Sorts the store data alphabetically.

**Parameters:**
- `id` (String) - Store identifier
- `direction` (String, optional) - Sort direction: "asc" (default) or "desc"

**Returns:** Boolean (true if successful)

**Examples:**
```javascript
// Sort users alphabetically (ascending)
$sortPages[users;asc]
// Users are now: Alice,Bob,Charlie,David,Eve,Frank,Grace,Henry

// Sort items in descending order
$sortPages[items;desc]
// Items are now: Item 6,Item 5,Item 4,Item 3,Item 2,Item 1

// Sort products (default ascending)
$sortPages[products]
// Products are now: Camera,Headphones,Laptop,Monitor,Phone,Speaker,Tablet,Watch
```

## Complete Example

```javascript
// Initialize a store with user data
$pagesInit[users;,;Alice,Bob,Charlie,David,Eve,Frank,Grace,Henry,Ivan,Jack]

// Add more users
$addPageData[users;Kate,Liam,Maya]

// Sort alphabetically
$sortPages[users;asc]

// Get total pages (4 users per page)
$pageCount[users;4]  // Returns: 4

// Get first page
$pagesList[users;1;4]  // Returns: "Alice,Bob,Charlie,David"

// Get second page  
$pagesList[users;2;4]  // Returns: "Eve,Frank,Grace,Henry"

// Find page containing "Maya"
$searchPages[users;Maya;4]  // Returns: 4

// Remove a user
$removePageEntry[users;5]  // Removes "Eve"

// Get slice of 3 users starting from index 6
$pagesSlice[users;6;3]  // Returns: "Grace,Henry,Ivan"
```

## Error Handling

Functions return appropriate error messages for:
- Non-existent stores
- Invalid indices
- Out-of-bounds operations

All functions validate their inputs and provide meaningful error messages when operations fail.

## Support
If you need any help, open a form in the offical BotForge discord support channel and ping me :D

## License

MIT 