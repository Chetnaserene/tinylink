export const metadata = {
  title: "TinyLink",
  description: "URL Shortener",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
