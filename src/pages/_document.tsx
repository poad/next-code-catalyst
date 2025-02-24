import React, { JSX } from 'react';
import createEmotionServer from '@emotion/server/create-instance';
import theme from '../styles/theme';
import createCache from '@emotion/cache';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { i18n } from '../../next-i18next.config';
import { GetStaticProps } from 'next';

export default class NextDocument extends Document {
  static getStaticProps: GetStaticProps;

  static getInitialProps: (
    ctx: DocumentContext,
  ) => Promise<DocumentInitialProps>;

  render(): JSX.Element {
    const currentLocale = this.props.__NEXT_DATA__.locale || i18n.defaultLocale;
    return (
      <Html lang={currentLocale}>
        <Head>
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

NextDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;

  const cache = createCache({ key: 'css' });
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enhanceApp: (App: any) => (props) => (
        <App emotionCache={cache} {...props} />
      ),
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map(
    (style: {
      key: React.Key | null | undefined;
      ids: unknown[];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      css: any;
    }) => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ),
  );

  return {
    ...initialProps,
    styles: [
      ...React.Children.toArray(initialProps.styles),
      ...emotionStyleTags,
    ],
  };
};
