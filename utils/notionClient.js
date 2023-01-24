const { getAuthToken } = require('./storageUtil')

const { Client } = require('@notionhq/client')

let notionClient = null;

(async () => {
  const authToken = await getAuthToken()
  if (!authToken) {
    return
  }
  notionClient = new Client({
    auth: authToken
  })
})()

export const searchNotion = async () => {
  if (!notionClient) {
    console.log('no notion client found ')
    return
  }
  return await notionClient.search({})
}

export const getAllLinkedPagesOrDatabases = async () => {
  const searchResults = await searchNotion()

  if (searchResults == null) {
    console.log('search returned null')
    return
  }

  const { results } = searchResults

  if (results == null) {
    console.log('results from notion search is null')
    return
  }

  let pagesOrDatabases = []

  results.forEach((searchResult) => {
    const { object, id } = searchResult
    if (object === 'page') {
      const pageTitle = getTitleFromPage(searchResult) || id
      pagesOrDatabases.push({
        type: object,
        id,
        title: pageTitle
      })
    } else if (object === 'database') {
      const titleArr = searchResult?.title
      const databaseTitle = getTitleFromTitleArr(titleArr) || id
      pagesOrDatabases.push({
        type: object,
        id,
        title: databaseTitle
      })
    }
  })

  return pagesOrDatabases
}

const getTitleFromPage = (searchResult) => {
  const { properties } = searchResult
  if (!properties) {
    return null
  }

  const titleArr = properties?.title?.title

  return getTitleFromTitleArr(titleArr)
}

const getTitleFromTitleArr = (titleArr) => {
  if (titleArr==null || !Array.isArray(titleArr) || titleArr.length===0) {
    return null
  }

  const titleObj = titleArr[0]

  return titleObj?.text?.content
}