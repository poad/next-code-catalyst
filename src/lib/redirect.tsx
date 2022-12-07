import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import languageDetector from './languageDetector';

export const useRedirect = (to?: string): JSX.Element => {
  const router = useRouter();
  to = to || router.asPath;

  // language detection
  useEffect(() => {
    const detectedLng = languageDetector.detect();
    if (to?.startsWith('/' + detectedLng) && router.route === '/404') { // prevent endless loop
      router.replace('/' + detectedLng + router.route);
      return;
    }

    if (detectedLng && languageDetector.cache) {
      languageDetector.cache(detectedLng);
    }
    router.replace('/' + detectedLng + to);
  });

  return (<></>);
};

export const Redirect = (): JSX.Element => {
  useRedirect();
  return (
    <></>
  );
};

// eslint-disable-next-line react/display-name
export const getRedirect = (to: string | undefined) => (): JSX.Element => {
  useRedirect(to);
  return (
    <></>
  );
};
