import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/globals.css";
import { ThemeContextProvider } from "../context/ThemeContext";
import { NotificationContextProvider } from "../context/NotificationContext";
import { Layout } from "../components/Layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Campus Notifications Portal</title>
        <meta
          name="description"
          content="A real-time campus notification system featuring query pagination, message search, and a priority ranking inbox."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
      <ThemeContextProvider>
        <NotificationContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NotificationContextProvider>
      </ThemeContextProvider>
    </>
  );
}
