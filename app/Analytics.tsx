export default function Analytics() {
  return (
    <>
      <script
        defer
        data-domain="notabridge.app"
        src="https://plausible.shipsolo.io/js/script.js"
      />
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-BZSDL4T0KB" />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BZSDL4T0KB');
          `,
        }}
      />
    </>
  );
}
