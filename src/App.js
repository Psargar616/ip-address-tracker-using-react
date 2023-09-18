import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import MarkerPosition from "./MarkerPosition";
import { useState, useEffect } from "react";
import {} from "react-leaflet";
import "./App.css";
import arrowIcon from "./images/icon-arrow.svg";
import background from "./images/pattern-bg-desktop.png";

const APIKey = "at_52TJuiVrdKEBy7wa0ML4OjMHATLYg";
function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;
  const checkDomain =
    /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${APIKey}&ipAddress=8.8.8.8`
        );
        const data = await res.json();
        setAddress(data);
      };

      getInitialData();
    } catch (error) {
      console.trace(error);
    }
  }, []);

  const getEnteredData = async () => {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${APIKey}&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getEnteredData();
    // setIpAddress("");
  };

  return (
    <>
      <section className=" relative max-h-max h-full flex flex-col gap-0 overflow-x-hidden ">
        <div className="absolute -z-12 w-full ">
          <img src={background} className="w-full  h-150 object-cover "></img>
        </div>
        {/* title and form */}
        <div className=" p-8 z-30">
          <h1 className="text-4xl font-bold text-white text-center mb-6">
            IP Address Tracker
          </h1>

          <form
            className="h-12 flex items-center justify-center max-w-3xl mx-auto"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <input
              type="search"
              id="ipAddress"
              name="ipAddress"
              placeholder="Search for any IP address or domain IP Address"
              className="py-3 px-6 rounded-l-lg h-full w-full"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            ></input>

            <button
              type="submit"
              className="py-4 px-6 rounded-r-lg bg-black h-full hover:opacity-60"
            >
              <img src={arrowIcon} alt="arrow" className="bg-black"></img>
            </button>
          </form>
        </div>
        {/* output  z=30*/}
        {address && (
          <>
            <div
              className="p-8 bg-white rounded-lg shadow gap-4 max-w-6xl mx-auto grid grid-cols-1  relative mt-8 md:grid-cols-2 lg:grid-cols-4 text-center md:text-left -mb-24"
              style={{ zIndex: 1000 }}
            >
              {/* IP */}
              <div className="lg:border-r-2 lg:border-slate-400 pr-5  p-4">
                <h2 className="font-bold uppercase text-sm text-slate-500 tracking-wide mb-3">
                  IP Address
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-xl ">
                  {address.ip}
                </p>
              </div>
              {/*  */}
              {/* location */}
              <div className="lg:border-r-2 lg:border-slate-400 pr-5 p-4">
                <h2 className="font-bold uppercase text-sm text-slate-500 tracking-wide mb-3">
                  location
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-xl ">
                  {address.location.city}, <br></br>
                  {address.location.region}
                </p>
              </div>
              {/* Timezone */}
              <div className="lg:border-r-2 lg:border-slate-400 pr-5 p-4">
                <h2 className="font-bold uppercase text-sm text-slate-500 tracking-wide mb-3">
                  Timezone
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-xl ">
                  UTC {address.location.timezone}
                </p>
              </div>
              {/* ISP */}
              <div className="p-4">
                <h2 className="font-bold uppercase text-sm text-slate-500 tracking-wide mb-3">
                  ISP
                </h2>
                <p className="font-semibold text-slate-900 text-lg md:text-xl xl:text-xl ">
                  {address.isp}
                </p>
              </div>
            </div>
            {/* map  z=>10*/}

            <MapContainer
              center={[address.location.lat, address.location.lng]}
              zoom={13}
              scrollWheelZoom={true}
              style={{ height: "700px", width: "100vw", zIndex: "100" }}
              className="-z-5"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MarkerPosition address={address} />
            </MapContainer>
          </>
        )}
      </section>
    </>
  );
}

export default App;
