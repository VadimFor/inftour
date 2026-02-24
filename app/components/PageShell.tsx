import { getCalpSeaTemperature } from "@/lib/sea-temperature";
import { getCalpWeather } from "@/lib/weather";
import Footer from "./Footer";
import Nav from "./Nav";
import TopBar from "./TopBar";

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
      <TopBar weather={weather} seaTemp={seaTemp} />
      <Nav />
      {children}
      <Footer />
    </div>
  );
}
