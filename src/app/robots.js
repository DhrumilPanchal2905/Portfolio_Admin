export default function robots() {
  const rulesObj =
    process.env.NEXT_APP_ENVIRONMENT === "production"
      ? {
          userAgent: "*",
          allow: "/",
        }
      : {
          userAgent: "*",
        };

  return {
    rules: rulesObj,
    sitemap: `${process.env.NEXT_APP_BASE_URL}/sitemap.xml`,
  };
}
