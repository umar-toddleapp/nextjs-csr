import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
} from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://countries.trevorblades.com/",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

// Ensure client is ready
if (typeof window !== "undefined") {
  // We're on the client
}

// GraphQL queries
export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
      languages {
        code
        name
      }
      continent {
        name
      }
    }
  }
`;

export const GET_COUNTRY = gql`
  query GetCountry($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
      phone
      capital
      currency
      languages {
        code
        name
      }
      continent {
        name
        code
      }
      states {
        name
        code
      }
    }
  }
`;

export default client;
