import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ color: "red", fontSize: "30px" }}>
          CLERK REMOVED TEST
        </div>
        {children}
      </body>
    </html>
  );
}