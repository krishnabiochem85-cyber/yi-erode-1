import "./globals.css";

export const metadata = {
  title: "Project Shield — YI Erode Chapter",
  description: "Substance Abuse Awareness Management Platform by Young Indians Erode Chapter. Manage school assessments, module deployment, mentor allocation, and program feedback.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
