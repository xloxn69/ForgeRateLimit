module.exports = {
  name: "pagingdemo",
  type: "messageCreate",
  code: `
$pagesInit[demo;|;Apple|Banana|Cherry|Date|Elderberry|Fig|Grape|Honeydew|Kiwi|Lemon|Mango|Orange|Peach|Quince|Raspberry|Strawberry|Tangerine|Ugli|Vanilla|Watermelon]

**🍎 ForgePages Demo - Fruit Store**

**📊 Stats:**
• Total pages (5 per page): $pageCount[demo;5]

**📄 Page 1 (5 items):**
$pagesList[demo;1;5]

**📄 Page 2 (5 items):**
$pagesList[demo;2;5]

**🔍 Search Result:** 
"grape" found on page: $searchPages[demo;grape;5]

$sortPages[demo;desc]
**📄 After sorting descending - Page 1:**
$pagesList[demo;1;5]

✅ ForgePages extension working!
`
}; 