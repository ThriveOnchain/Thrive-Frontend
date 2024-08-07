"use client";

import { FC, ReactNode } from "react";
import { Web3Provider } from "./web3-provider";
import { State } from "wagmi";
export const RootProvider = ({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) => {
  return <Web3Provider initialState={initialState}>{children}</Web3Provider>;
};
