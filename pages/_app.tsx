import { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import "@vercel/examples-ui/globals.css";

function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default App;
