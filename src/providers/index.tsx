"use client";

import { FC, ReactNode } from "react";
import { Web3Provider } from "./web3-provider";
import { State } from "wagmi";
import { ThemeProvider } from "./theme-provider";
export const RootProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) => {
  return (
    <Web3Provider initialState={initialState}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        // disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </Web3Provider>
  );
};
