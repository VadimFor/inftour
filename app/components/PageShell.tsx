import { getCalpSeaTemperature } from "@/lib/sea-temperature";
import { getCalpWeather } from "@/lib/weather";
import Footer from "./Footer";
import Nav from "./Nav";
import { ScrollHeaderProvider } from "./ScrollHeaderContext";
import TopBar from "./TopBar/TopBar";

export default async function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [seaTemp, weather] = await Promise.all([
    getCalpSeaTemperature(),
    getCalpWeather(),
  ]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <ScrollHeaderProvider>
        <TopBar weather={weather} seaTemp={seaTemp} />
        <div className="pt-10">
          <Nav />
          {children}
          <Footer />
        </div>
      </ScrollHeaderProvider>
    </div>
  );
}
