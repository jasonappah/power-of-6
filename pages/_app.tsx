import "../node_modules/water.css/out/dark.min.css";
import "../styles/nprogress.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
