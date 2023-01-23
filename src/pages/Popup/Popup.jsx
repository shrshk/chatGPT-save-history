import React, { useEffect } from "react";
import "./Popup.css";
import { Button, Grid, SvgIcon, Typography } from "@mui/material";
import NotionLogoPath from "../../../logos/notion-logo.svg";

const style = {
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
}

const NotionLogo = () => {
  return (
    <SvgIcon path={NotionLogoPath} fontSize='small' color='primary' />
  )
}

const getLocalStorageKey = () => {
  if (!chrome.runtime.id) {
    return null
  }
  return `${chrome.runtime.id}_chatGPTSaveNotion`
}

const beginAuthFlow = async () => {
  const redirectUri = 'https://' + chrome.runtime.id +
    '.chromiumapp.org/options.html';

  const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=3636a610-ed79-4965-8312-cabfd9fd3075&response_type=code&owner=user&redirect_uri=${redirectUri}`;

  if (chrome.identity) {
    const responseUrl = await chrome.identity.launchWebAuthFlow({url: authUrl, interactive: true});

    if (responseUrl==null) {
      console.log('no resp url')
      return;
    }

    const urlParams = new URLSearchParams(new URL(responseUrl).search)
    const code = urlParams.get('code');

    if (code == null) {
      console.log('did not  get code')
      return;
    }

    const authTokenResponse = await getAuthTokenForCode(code)

    console.log('authToken response from server is ' + JSON.stringify(authTokenResponse))

    await setLocalStorageDataAfterAuth(authTokenResponse)

  } else {
    console.log(chrome.identity + " chrome indentity");
  }
}

async function getAuthTokenForCode(code) {
  try {
    const res = await fetch('https://notion.computersandtacos.com/authToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code
      })
    })
    return await res.json()
  } catch (e) {
    console.log('error getting auth token' + e)
  }
}

const getFromLocalStorage = async (key) => {
  if (key==null) {
    console.log('null key provided to getFromLocalStorage')
    return
  }
  return await chrome.storage.local.get([key]);
}

const setToLocalStorage = async (key, value) => {
  if (key==null) {
    console.log('null key provided setToLocalStorage')
    return
  }

  await chrome.storage.local.set({ [key]: value });
}

const setLocalStorageDataAfterAuth = async (authTokenResponse) => {

  const localStorageKey = getLocalStorageKey()

  if (localStorageKey == null) {
    console.log('failed to get extensionId before setting user data in local storage')
    return
  }

  await setToLocalStorage(localStorageKey, {
    'integrationDB': null,
    'integrationPage': null,
    'authInfo': authTokenResponse
  })

}

const getUserDataFromLocalStorage = async () => {
  const localStorageKey = getLocalStorageKey()

  if (localStorageKey == null) {
    console.log('failed to get extensionId before getting user data from local storage')
    return
  }

  const savedRes = await getFromLocalStorage(localStorageKey)

  console.log('all of saved ' + JSON.stringify(savedRes))

  const savedMap = new Map(Object.entries(savedRes[localStorageKey]))

  console.log(savedMap.get('integrationDB') + ' integrationDB')
  console.log(savedMap.get('integrationPage') + ' integrationPage')
  console.log(JSON.stringify(savedMap.get('authInfo')) + ' auth Info')
  console.log(savedMap.get('authInfo').access_token + ' access token')

  return savedMap
}

const testLocalStorage = async () => {
  const extensionId = chrome.runtime.id
  const localStorageKey = `${extensionId}_chatGPTSaveNotion`

  const storageData = await getFromLocalStorage(localStorageKey)

  const savedMap = new Map(Object.entries(storageData[localStorageKey]))
  savedMap.set('integrationPage', null)

  await setToLocalStorage(localStorageKey, Object.fromEntries(savedMap))

  const res = await getFromLocalStorage(localStorageKey)
  console.log('res ' + JSON.stringify(res))

}

const Popup = () => {

  useEffect(() => {

  })


  return (
    <div style={style.root}>
      <Typography variant="h6" sx={style.title}>
        chatGPT save to Notion
      </Typography>
      <Grid
        container
        spacing={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >

        <Grid item xs={3}>
          <Button variant="contained" color="primary" onClick={getUserDataFromLocalStorage}>
            Connect with Notion
          </Button>
        </Grid>

      </Grid>
    </div>
  );
};

export default Popup;
