import { useTranslations } from "@/core/Translations/context";
import { useSettings } from "@/core/settings/context";
import { settings } from "@/core/settings/request";
import Link from "next/link";
import { useRouter } from "next/router";

export default function NotFound404() {
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();
  const setting = useSettings();

  return (
    <div
      className="container d-flex flex-column gap-5 align-items-center justify-content-center error-page"
      style={{
        minHeight: 600,
      }}
    >
      <h1>{translations?.page_not_found}</h1>
      {setting[settings?.disableLang]?.value === locale ? (
        <div
          className="apply-button"
          onClick={() => {
            router.push(`/en`, `en`, { locale: "en" });
          }}
        >
         {translations?.return_to_main ?? "Return to Home"}
        </div>
      ) : (
        <Link href="/" className="apply-button">
          {translations?.return_to_main ?? "Return to Home"}
        </Link>
      )}
    </div>
  );
}
