import "./globals.css";
import ReduxProvider from "../components/ReduxProvider";
import ApolloWrapper from "../components/ApolloProvider";
import { PostMessageProvider } from "../components/PostMessageProvider";
import ClientLayout from "../components/ClientLayout";

export const metadata = {
  title: "CSR Next.js App",
  description: "Client-side rendered Next.js app with App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ApolloWrapper>
            <PostMessageProvider>
              <ClientLayout>{children}</ClientLayout>
            </PostMessageProvider>
          </ApolloWrapper>
        </ReduxProvider>
      </body>
    </html>
  );
}
