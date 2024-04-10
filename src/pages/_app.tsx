import * as React from 'react';
import { AppProps } from 'next/app';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../styles/theme';
import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';

const App = ({ Component }: AppProps): JSX.Element => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Component />
  </ThemeProvider>
);

App.onRedirectCallback = (appState: { targetUrl: string }): void => {
  history.state.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname,
  );
};

export default appWithTranslation(App);
