import React, { useEffect, useState } from "react";
import "./Popup.css";
import { Button, Grid, Typography } from "@mui/material";
import { useChromeStorageLocal } from 'use-chrome-storage'
import { getAllLinkedPagesOrDatabases } from '../../../utils/notionClient'
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { getLocalStorageKey, setLocalStorageDataAfterAuth, userDataToMap, disconnectNotion, setIntegrationParent } from '../../../utils/storageUtil'

const style = {
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
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

const Popup = () => {

  const localStorageKey = getLocalStorageKey()

  const [ notionLinked, setNotionLinked] = useState(false)
  const [ selectedIntegrationParentId, setSelectedIntegrationParentId ] = useState('')
  const [ integratedParents, setIntegratedParents ] = useState([])

  const [value, isPersistent, error] = useChromeStorageLocal(localStorageKey);

  useEffect(() => {
    if (value) {
      setNotionLinked(true)
      let userDataMap = userDataToMap(value)
      if (!userDataMap) {
        return
      }

      const selectedIntegrationParent = userDataMap.get('integrationParent')
      console.log(selectedIntegrationParent + ' selectedIntegrationParent')
      if (selectedIntegrationParent!=null) {
        setSelectedIntegrationParentId(selectedIntegrationParent?.id)
      }

    }
  }, [value])

  useEffect(() => {
    const getIntegrationParents = async () => {
      const allLinkedPagesOrDBs = await getAllLinkedPagesOrDatabases()
      if (allLinkedPagesOrDBs!=null) {
        setIntegratedParents(allLinkedPagesOrDBs)
      }
    }
    getIntegrationParents()
  }, [])

  useEffect(() => {
  }, [integratedParents])

  useEffect(() => {

    const selectedIntegrationParent = integratedParents.find(parent => parent.id === selectedIntegrationParentId)

    console.log('on change of integrated parents two ' + JSON.stringify(selectedIntegrationParent))

    if (!selectedIntegrationParent) {
      return
    }

    setIntegrationParent(selectedIntegrationParent).then(
      () => {
        console.log('successfully set integrationParent to local storage')
      }
    )

  }, [selectedIntegrationParentId])

  const onParentSelect = (event) => {
    setSelectedIntegrationParentId(event.target.value)
    // use this parentID to lookup parent obj and save it to local storage
    // const title = getTitleOfSelectedParent(event.target.value)
    // console.log(title)
  }

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
              <Button variant="contained" color="error" onClick={() => {
                disconnectNotion().then(r => setNotionLinked(false))
              }}>
                Disconnect
              </Button>
          }
        </Grid>
        <Grid item xs={12}>
          {
            notionLinked &&
            <FormControl sx={{
              minWidth: 120
            }}>
              <InputLabel id="select-parent-page-or-db">Parent Page or DB</InputLabel>
              <Select
                labelId="select-parent-page-or-db"
                id="parent-page-or-db"
                value={selectedIntegrationParentId ?? ''}
                label="ParentPage"
                defaultValue=''
                onChange={(e) => onParentSelect(e)}
              >
                {
                  Array.isArray(integratedParents) &&
                  integratedParents.map(parent => {
                    return (
                      <MenuItem key={parent.id} value={parent.id}> {parent.title} </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
          }
        </Grid>
      </Grid>
    </div>
  );
};

export default Popup;
