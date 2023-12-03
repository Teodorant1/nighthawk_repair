export { default } from "next-auth/middleware";
export const config = {
  matcher: ["/Seller/:path*", "/Buyer/:path*"],
};
