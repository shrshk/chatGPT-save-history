import React, { useEffect, useState } from "react";
import "./Popup.css";
import { Button, Grid, Typography } from "@mui/material";
import { useChromeStorageLocal } from 'use-chrome-storage'
import { getAllLinkedPagesOrDatabases } from '../../../utils/notionClient'
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material'
import { getLocalStorageKey, userDataToMap, disconnectNotion, setIntegrationParent } from '../../../utils/storageUtil'

const style = {
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
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
  }, [notionLinked])

  // useEffect(() => {
  // }, [integratedParents])

  useEffect(() => {

    const selectedIntegrationParent = integratedParents.find(parent => parent.id === selectedIntegrationParentId)

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
  }

  const callOptionsPage = () => {
    if (!chrome.runtime) {
      console.log('no chrome runtime, bailing out')
      return
    }
    chrome.runtime.openOptionsPage()
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
            !notionLinked && (
              <Typography variant='subtitle2' align='center' sx={{
                color: '#990014'
              }}>
                Notion account not linked, click below
              </Typography>
            )
          }
        </Grid>
        <Grid item xs={3}>
          {
            !notionLinked ? (
              <Button variant="contained" color="primary" onClick={() => callOptionsPage()}>
                Connect to Notion
              </Button>
              ) :
              <Button variant="contained" color="error" onClick={() => {
                disconnectNotion().then(() => setNotionLinked(false))
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
