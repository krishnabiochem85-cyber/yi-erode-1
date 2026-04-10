import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import ProfileCompletionModal from "@/components/ProfileCompletionModal";

export const metadata = {
  title: "Mission ON - Smart Choices — YI Erode Chapter",
  description: "Substance Abuse Awareness Management Platform by Young Indians Erode Chapter. Manage school assessments, module deployment, mentor allocation, and program feedback.",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
          <ProfileCompletionModal />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  );
}
