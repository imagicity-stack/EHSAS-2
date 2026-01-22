import "@/index.css";
import "@/App.css";
import { Toaster } from "@/components/ui/sonner";

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
