export const getLocalStorageKey = () => {
  if (!chrome.runtime.id) {
    return null
  }
  return `${chrome.runtime.id}_chatGPTSaveNotion`
}

export const getFromLocalStorage = async (key) => {
  if (key==null) {
    console.log('null key provided to getFromLocalStorage')
    return
  }
  return await chrome.storage.local.get([key]);
}

export const setToLocalStorage = async (key, value) => {
  if (key==null) {
    console.log('null key provided setToLocalStorage')
    return
  }

  await chrome.storage.local.set({ [key]: value });
}

export const getUserDataFromLocalStorage = async () => {
  const localStorageKey = getLocalStorageKey()

  if (localStorageKey == null) {
    console.log('failed to get extensionId before getting user data from local storage')
    return
  }

  const savedRes = await getFromLocalStorage(localStorageKey)

  const savedData = savedRes[localStorageKey]

  return userDataToMap(savedData)
}

export const setLocalStorageDataAfterAuth = async (authTokenResponse) => {

  const localStorageKey = getLocalStorageKey()

  if (localStorageKey == null) {
    console.log('failed to get extensionId before setting user data in local storage')
    return
  }

  await setToLocalStorage(localStorageKey, {
    'integrationParent': null,
    'authInfo': authTokenResponse
  })

}

export const setIntegrationParent = async (integrationParent) => {
  const localStorageKey = getLocalStorageKey()
  const savedRes = await getFromLocalStorage(localStorageKey)

  const savedData = savedRes[localStorageKey]

  savedData['integrationParent'] = integrationParent

  await setToLocalStorage(localStorageKey, savedData)
}

export const userDataToMap = (userDataFromStorage) => {
  let userDataMap = new Map()

  if (!userDataFromStorage) {
    console.log('no userData in storage')
    return
  }

  console.log('what is userDataFromStorage ' + JSON.stringify(userDataFromStorage))

  const authInfoObj = userDataFromStorage['authInfo']
  const accessToken = authInfoObj.access_token
  const avatarUrl = authInfoObj.workspace_icon
  const integrationParent = userDataFromStorage['integrationParent']

  userDataMap.set('accessToken', accessToken)
  userDataMap.set('avatarUrl', avatarUrl)
  userDataMap.set('integrationParent', integrationParent)

  return userDataMap
}

export const getAuthToken = async () => {
  const userDataMap = await getUserDataFromLocalStorage()
  if (!userDataMap) {
    return null
  }
  console.log('in getAuthToken ' + [...userDataMap.values()])
  return userDataMap.get('accessToken')
}

export const disconnectNotion = async () => {
  const localStorageKey = getLocalStorageKey()
  try {
    await deleteFromStorage(localStorageKey)
  } catch (e) {
    console.log('failed to delete from storage for key ' + localStorageKey)
  }
}

const deleteFromStorage = async (key) => {
  if (key==null) {
    console.log('null key given to deleteFromStorage')
    return
  }
  await chrome.storage.local.remove(key)
}

