export const flatArrayToTree = (
  arr,
  idProp = "id",
  parentProp = "parent_id",
  childrenProp = "children",
  sortProp = "sort",
  parent = null
) =>
  arr
    .filter((item) => item[parentProp] === parent)
    .sort((a, b) => a[sortProp] - b[sortProp])
    .map((child, index) => ({
      ...child,
      [childrenProp]: flatArrayToTree(
        arr,
        idProp,
        parentProp,
        childrenProp,
        sortProp,
        child[idProp]
      ),
    }));
