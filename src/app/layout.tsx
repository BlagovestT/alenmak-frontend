"use client";
import Drawer from "@/components/Layout/Drawer";
import ThemeRegistry from "@/theme/ThemeRegistry";
import { usePathname } from "next/navigation";

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  return (
    <html lang="bg">
      <ThemeRegistry>
        <body>
          {pathname !== "/auth/login" && pathname !== "/auth/register" ? (
            <Drawer>{children}</Drawer>
          ) : (
            children
          )}
        </body>
      </ThemeRegistry>
    </html>
  );
};

export default RootLayout;
