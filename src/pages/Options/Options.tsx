import React from "react";
import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import './Options.css';

interface Props {
  title: string;
}

const style = {
  title: {
    flexGrow: 1,
    textAlign: 'center',
  },
}

const Options: React.FC<Props> = () => {
  return (
  <Grid
    container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '100vh' }}
  >

    <Grid item xs={3}>
      <Typography variant="h6" sx={style.title}>
        Welcome to chatGPT save to Notion, use popup window to link notion api, select a parent database and save chat history.
      </Typography>
    </Grid>

  </Grid>
);
};

export default Options;
