import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-RMSCHQPTV5";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID?.trim() ?? "AW-880590315";
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();

function buildGtagInit() {
  const configs: string[] = ["gtag('js', new Date());"];
  if (GA_ID) configs.push(`gtag('config', '${GA_ID}');`);
  if (GOOGLE_ADS_ID) configs.push(`gtag('config', '${GOOGLE_ADS_ID}');`);
  return `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
${configs.join("\n")}`;
}

export function Analytics() {
  const gtagLoaderId = GA_ID || GOOGLE_ADS_ID;

  return (
    <>
      {gtagLoaderId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagLoaderId}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {buildGtagInit()}
          </Script>
        </>
      ) : null}

      {META_PIXEL_ID ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}
