import { BagContextProvider } from "@/components/BagContext";
import PlannerContextProvider from "@/components/PlannerContext";
import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap');

  body {
    background: #F0F2F5;
    padding:0;
    margin:0;
    font-family: 'Poppins', sans-serif;
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <GlobalStyles />
      <BagContextProvider>
        <PlannerContextProvider>
          <Component {...pageProps} />
        </PlannerContextProvider>
      </BagContextProvider>
    </>
  );
}

