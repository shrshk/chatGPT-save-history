import React, { useEffect, useState } from "react";
import "./Popup.css";
import { Button, Grid, SvgIcon, Typography } from "@mui/material";
import { useChromeStorageLocal } from 'use-chrome-storage'
import { searchNotion } from '../../../utils/notionClient'
// import NotionLogoPath from "../../../logos/notion-logo.svg";
import { getLocalStorageKey, setLocalStorageDataAfterAuth, userDataToMap } from '../../../utils/storageUtil'

const style = {
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
}

// const NotionLogo = () => {
//   return (
//     <SvgIcon path={NotionLogoPath} fontSize='small' color='primary' />
//   )
// }

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
    console.log(chrome.identity + " chrome identity");
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

// const testLocalStorage = async () => {
//   const extensionId = chrome.runtime.id
//   const localStorageKey = `${extensionId}_chatGPTSaveNotion`
//
//   const storageData = await getFromLocalStorage(localStorageKey)
//
//   const savedMap = new Map(Object.entries(storageData[localStorageKey]))
//   savedMap.set('integrationPage', null)
//
//   await setToLocalStorage(localStorageKey, Object.fromEntries(savedMap))
//
//   const res = await getFromLocalStorage(localStorageKey)
//   console.log('res ' + JSON.stringify(res))
//
// }

const Popup = () => {

  const localStorageKey = getLocalStorageKey()

  const [ notionLinked, setNotionLinked] = useState(false)
  const [ linkedPageId, setLinkedPageId ] = useState(null)
  const [ linkedDBId, setLinkedDBId ] = useState(null)

  const [value, isPersistent, error] = useChromeStorageLocal(localStorageKey);

  useEffect(() => {
    if (value) {
      setNotionLinked(true)
      let userDataMap = userDataToMap(value)
      if (!userDataMap) {
        return
      }
      const linkedDBId = userDataMap.get('integrationDBId')
      if (linkedDBId!=null) {
        setLinkedDBId(linkedDBId)
        return
      }
      const linkedPageId = userDataMap.get('integrationPageId')
      if (linkedPageId!=null) {
        setLinkedPageId(linkedPageId)
      }
    }
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
          {
            !notionLinked ?
            <Button variant="contained" color="primary" onClick={beginAuthFlow}>
              Connect with Notion
            </Button> :
              <Button variant="contained" color="error" onClick={() => console.log('disconnect clicked')}>
                Disconnect
              </Button>
          }
        </Grid>
        <Grid item xs={3}>
          {/*{Replace this with pages and dbs from notion search}*/}
        </Grid>

      </Grid>
    </div>
  );
};

export default Popup;
