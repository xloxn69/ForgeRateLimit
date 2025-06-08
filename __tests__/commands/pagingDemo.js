module.exports = {
  name: "pagingdemo",
  code: `
$pagesInit[demo;|;Apple|Banana|Cherry|Date|Elderberry|Fig|Grape|Honeydew|Kiwi|Lemon|Mango|Orange|Peach|Quince|Raspberry|Strawberry|Tangerine|Ugli|Vanilla|Watermelon]

**Fruit Store Demo**
Total items: $getVar[data;$pagesInit[demo;|;Apple|Banana|Cherry|Date|Elderberry|Fig|Grape|Honeydew|Kiwi|Lemon|Mango|Orange|Peach|Quince|Raspberry|Strawberry|Tangerine|Ugli|Vanilla|Watermelon]]
Total pages (5 per page): $pageCount[demo;5]

**Page 1 (5 items):**
$pagesList[demo;1;5]

**Page 2 (5 items):**
$pagesList[demo;2;5]

**Searching for "grape":** Found on page $searchPages[demo;grape;5]

$sortPages[demo;desc]
**After sorting descending - Page 1:**
$pagesList[demo;1;5]
`
}; 