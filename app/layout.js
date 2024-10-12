import Layout from "../components/Layout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
