import { env } from "@/config/env";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

export type Address = {
  Street:string;
  CP:string;
  City:string;
}

interface MondialRelayWidgetProps {
  initialCountry:string;
  onAddressSelected: (mondialRelayId:string, address: Address) => void;
}

export default function MondialRelayWidget({initialCountry, onAddressSelected} : MondialRelayWidgetProps) {
  const [widgetHeight, setWidgetHeight] = useState("400px");
  const [country, _] = useState(initialCountry)
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    // Function to update widget height and map visibility based on screen size
    const updateWidgetSettings = () => {
      const isMobile = window.innerWidth < 768;
      const height = isMobile ? "300px" : "400px";
      // const shouldShowMap = !isMobile;
      const shouldShowMap = false;
      
      setWidgetHeight(height);
      setShowMap(shouldShowMap);

      // Update widget if it exists
      if (window.$ && window.$("#Zone_Widget").data("MR_ParcelShopPicker")) {
        window.$("#Zone_Widget").MR_ParcelShopPicker("destroy");
        initWidget(height, shouldShowMap);
      }
    };

    // Initial setup
    updateWidgetSettings();

    // Add resize listener
    window.addEventListener('resize', updateWidgetSettings);

    let isInitialized = false;

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

    async function initWidget(height: string, showMap: boolean) {
      try {
        // Clean up any existing widget
        if (window.$ && window.$("#Zone_Widget").data("MR_ParcelShopPicker")) {
          window.$("#Zone_Widget").MR_ParcelShopPicker("destroy");
        }

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

        console.log("RELAY BRAND" + env.mondial_relay.CLIENT_CODE)
        console.log()
        // Initialize the widget
        window.$("#Zone_Widget").MR_ParcelShopPicker({
          Target: "#Target_Widget",
          // Brand: "BDTEST  ",
          // Brand: "CC233ETC",
          Brand: env.mondial_relay.CLIENT_CODE || "CC233ETC",
          // Country: "BE",
          // PostCode: "1640",
          Country: country,          
          ColLivMod: "24R",
          NbResults: "7",
          Responsive: true,
          // ShowResultsOnMap: showMap,
          ShowResultsOnMap: false,
          Height: height,          
          Width: "100%",
          OnParcelShopSelected: function (parcelShop: any) {
            // const fullAddress = `${parcelShop.Adresse1}\n${parcelShop.CP} ${parcelShop.Ville}`;  
            const address : Address = {
              "Street":parcelShop.Adresse1,
              "CP":parcelShop.CP,
              "City":parcelShop.Ville
            }            
            onAddressSelected(parcelShop.Nom,address)
              // console.log("Selected parcel shop:", parcelShop);
            }});

        isInitialized = true;
      } catch (error) {
        console.error(error);
      }
    }

    // Initialize the widget with current settings
    initWidget(widgetHeight, showMap);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', updateWidgetSettings);
      if (window.$ && window.$("#Zone_Widget").data("MR_ParcelShopPicker")) {
        window.$("#Zone_Widget").MR_ParcelShopPicker("destroy");
      }
      // Remove the widget's scripts
      const scripts = document.querySelectorAll('script[src*="mondialrelay"], script[src*="leaflet"], script[src*="jquery"]');
      scripts.forEach(script => script.remove());
      // Remove the widget's styles
      const styles = document.querySelectorAll('link[href*="leaflet"]');
      styles.forEach(style => style.remove());
    };
  }, []); // Empty dependency array since we want to reinitialize on mount/unmount


  return (
    <>
      <div className="flex justify-center items-center w-full max-h-[300px] md:max-h-[400px]" id="Zone_Widget"></div>
      <input type="hidden" id="Target_Widget" />
    </>
  );
}