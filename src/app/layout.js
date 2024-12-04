export const metadata = {
  title: "IT-Department",
  description: "IT-Helpdesk Application",
};

import ClientLayout from "./ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div id="root">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}