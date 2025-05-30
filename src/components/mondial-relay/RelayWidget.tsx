import { useEffect } from "react";

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export default function MondialRelayWidget() {
  useEffect(() => {
    function loadScript(src: string) {
      return new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
          existingScript.addEventListener("load", () => resolve());
          existingScript.addEventListener("error", () =>
            reject(new Error(`Failed to load script ${src}`))
          );
          return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script ${src}`));
        document.body.appendChild(script);
      });
    }

    async function initWidget() {
      try {
        // Load jQuery (use Google CDN as per doc)
        await loadScript("//ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js");
        if (!window.$) {
          console.error("jQuery failed to load properly");
          return;
        }

        // Load Leaflet JS and CSS for map (required by widget)
        await loadScript("//unpkg.com/leaflet/dist/leaflet.js");
        const leafletCss = document.createElement("link");
        leafletCss.rel = "stylesheet";
        leafletCss.href = "//unpkg.com/leaflet/dist/leaflet.css";
        document.head.appendChild(leafletCss);

        // Load Mondial Relay ParcelShopPicker plugin
        await loadScript(
          "https://widget.mondialrelay.com/parcelshop-picker/jquery.plugin.mondialrelay.parcelshoppicker.min.js"
        );
        if (!window.$ || !window.$.fn.MR_ParcelShopPicker) {
          console.error("MondialRelay plugin failed to load properly");
          return;
        }

        // Initialize the widget
        window.$("#Zone_Widget").MR_ParcelShopPicker({
          Target: "#Target_Widget",
          Brand: "BDTEST  ",
          Country: "BE",
          PostCode: "1640",
          ColLivMod: "24R",
          NbResults: "7",
          Responsive: true,
          ShowResultsOnMap: true,
        });
      } catch (error) {
        console.error(error);
      }
    }

    initWidget();
  }, []);

  return (
    <>
      <div className="w-300 h-300" id="Zone_Widget"></div>
      <input type="hidden" id="Target_Widget" />
    </>
  );
}
