import { useState } from "react";
import reactLogo from "../assets/react.svg";
import { GoPerson } from "react-icons/go";
import { SlMagnifier } from "react-icons/sl";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import OpenRaise from "../assets/OpenRaise.png";
import { Link } from "react-router-dom";
import { useAccount } from "wagmi";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const account = useAccount();

  const onToggleMenu = () => {};

  return (
    <header>
      <nav className="flex justify-between items-center w-[92%] mx-auto py-5 z-10">
        <div>
          {/* <span className="text-black font-semibold text-3xl">Crowdfunding</span> */}
          <img className="h-12 w-auto" src={OpenRaise} alt="logo" />
        </div>
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/90 z-10 md:hidden">
            <div className="flex justify-end p-5" onClick={onToggleMenu}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-10 text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
        )}
        <div
          className={`
        nav-links 
        duration-500 
        md:static 
        absolute 
        md:min-h-fit 
        min-h-[60vh] 
        left-0 
        ${isMenuOpen ? "top-[9%]" : "top-[-100%]"} 
        md:w-auto 
        w-full 
        flex 
        items-center 
        px-5
        z-5
      `}
        >
          <ul className="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 font-poppins">
            <li>
              <Link key={"howItWorks"} to={`/how-it-works`}>
                <a class="text-gray-700 hover:text-gray-500" href="#">
                  How it works
                </a>
              </Link>
            </li>
            <li>
              <Link key={"howItWorks"} to={`/user-fundings/${account.address}`}>
                <a class="text-gray-700 hover:text-gray-500" href="#">
                  Your Funds
                </a>
              </Link>
            </li>
            <li>
              <Link key={"howItWorks"} to={`/user-campaigns/${account.address}`}>
                <a class="text-gray-700 hover:text-gray-500" href="#">
                  Your Campaigns
                </a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-6">
          {/* <div className="flex flex-row justify-between items-center gap-2">
            <button className="rounded-full border-2 p-2 shadow-md transition-transform border-black hover:bg-purple-500 hover:text-white hover:scale-[1.02] duration-200">
              <GoPerson size={20} />
            </button>
            <button className="rounded-full border-2 p-2 shadow-md transition-transform border-black hover:bg-purple-500 hover:text-white hover:scale-[1.02] duration-200">
              <SlMagnifier size={20} />
            </button>
          </div> */}
          <ConnectButton />
          <div
            onClick={onToggleMenu}
            name="menu"
            className="text-3xl cursor-pointr md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6 text-white"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
