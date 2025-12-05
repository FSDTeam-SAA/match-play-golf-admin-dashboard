import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      style={{
        backgroundImage: `url('/images/auth-banner.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundBlendMode: "overlay",
        backgroundAttachment: "fixed",
      }}
      className="min-h-screen flex items-center justify-center bg-[#00000098]"
    >
      {children}
    </div>
  );
};

export default Layout;