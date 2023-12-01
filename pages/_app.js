import { BagContextProvider } from "@/components/BagContext";
import PlannerContextProvider from "@/components/PlannerContext";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css'
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
    <>
      <SessionProvider>
        <DndProvider backend={HTML5Backend}>
          <BagContextProvider>
            <PlannerContextProvider>
              <Component {...pageProps} />
            </PlannerContextProvider>
          </BagContextProvider>
        </DndProvider>
      </SessionProvider>
    </>
  );
}
