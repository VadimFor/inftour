import { Suspense } from "react";
import { getCalpSeaTemperature } from "@/lib/sea-temperature";
import { getCalpWeather } from "@/lib/weather";
import Footer from "./Footer";
import Nav from "./Nav";
import { ScrollHeaderProvider } from "./ScrollHeaderContext";
import TopBar from "./TopBar/TopBar";

async function TopBarData() {
  const [seaTemp, weather] = await Promise.all([
    getCalpSeaTemperature(),
    getCalpWeather(),
  ]);

  return <TopBar weather={weather} seaTemp={seaTemp} />;
}

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <ScrollHeaderProvider>
        <Suspense fallback={<TopBar weather={null} seaTemp={null} />}>
          <TopBarData />
        </Suspense>
        <Nav />
        {children}
        <Footer />
      </ScrollHeaderProvider>
    </div>
  );
}
