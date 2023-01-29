const { getAuthToken } = require('./storageUtil')

const { Client } = require('@notionhq/client')

let notionClient = null;

export const createNotionClient = async () => {
  const authToken = await getAuthToken()
  if (!authToken) {
    console.log('no auth token found')
    return
  }
  notionClient = new Client({
    auth: authToken
  })
}

(async () => {
  await createNotionClient()
})()

export const searchNotion = async () => {
  if (!notionClient) {
    console.log('no notion client found ')
    await createNotionClient()
  }
  if (!notionClient) {
    console.log('no notion client found ')
    return
  }
  return await notionClient.search({
    filter: {
      value: 'database',
      property: 'object'
    }
  })
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

export const createPage = async (createPageRequest) => {

  let res;

  try {
    if (!notionClient) {
      await createNotionClient()
    }

    if (!notionClient) {
      console.log('still no notion client')
      return
    }

    const { integrationParent, createPageTitle, createPageData } = createPageRequest

    const { type, id } = integrationParent

    let parent = {}

    if (type === 'database') {
      parent.database_id = id
    } else if (type === 'page') {
      parent.page_id = id
    }

    const children = await convertMarkdownToNotionBlocks(createPageData)
    await notionClient.pages.create({
      parent,
      properties: {
        Name: {
          title: [
            {
              text: {
                content: createPageTitle,
              },
            },
          ],
        }
      },
      children
    });
    res = {
      error: false,
      message: 'page successfully saved with title ' + createPageTitle
    }
  } catch (e) {
    console.log('error creating page in notion ' + e)
    res = {
      error: true,
      message: 'failed to create page in notion',
      exception: e.toString()
    }
  }

  return res
}

const convertMarkdownToNotionBlocks = async (markdown) => {
  const res = await fetch('https://notion.computersandtacos.com/markdownToNotion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      markdown,
      method: 'markdownToRichText'
    })
  })

  const data = await res.json()

  return data.notionBlocks
}