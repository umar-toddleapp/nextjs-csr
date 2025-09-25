"use client";

import { ApolloProvider } from "@apollo/client/react";
import client from "../lib/apollo";

export default function ApolloWrapper({ children }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
