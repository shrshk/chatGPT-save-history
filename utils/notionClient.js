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
  return await notionClient.search({
    filter: {
      value: 'database',
      property: 'object'
    }
  })
}