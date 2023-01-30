import React from "react";
import { Grid } from '@mui/material';
import { Typography, Link } from '@mui/material';
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
    spacing={1}
    direction="column"
    alignItems="center"
    justifyContent="center"
    style={{ minHeight: '100vh' }}
  >
    <Grid item xs={6}>
      <Typography variant="h2" sx={style.title}>
        chatGPT save history to Notion.
      </Typography>
    </Grid>
    <Grid item xs={6}>
      <Typography variant="subtitle2" sx={style.title}>
        Welcome to chatGPT save to Notion, use popup window to link notion api, select a parent database and save chat history.
        File a bug <Link href="https://github.com/shrshk/chatGPT-save-history">here</Link> if something doesn't work.
      </Typography>
    </Grid>
  </Grid>
);
};

export default Options;
