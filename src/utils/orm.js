export function useOrm() {

  const getByUnique = (slug, list, fieldName, findIndex = false) => {
    if (findIndex) {
      return list.findIndex(elem => elem[fieldName] === slug)
    }
    return list.find(elem => elem[fieldName] === slug)
  }

  const getByUniqueComputed = (slug, list, fieldName, findIndex = false) => {
    if (findIndex) {
      return list.value.findIndex(elem => elem[fieldName] === slug.value)
    }
    return list.value.find(elem => elem[fieldName] === slug.value)
  }

  const getByUniqueNews = (slug, list, fieldName, findIndex = false) => {
    let found;
    if (findIndex) {
      list.forEach(element => {
        found = element.findIndex(elem => elem[fieldName] === slug)
        if (found !== undefined) return false
      });
    }
    list.forEach(element => {
      found = element.find(elem => elem[fieldName] === slug)
      if (found !== undefined) return false
    });
    return found
  }

  return { getByUniqueComputed, getByUnique, getByUniqueNews }
}
