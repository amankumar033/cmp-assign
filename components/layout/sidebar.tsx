"use client";

import { useState } from "react";
import Image from "next/image";
import { MdOutlineMenu } from "react-icons/md";
import { IoLogOutOutline, IoClose } from "react-icons/io5";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { useSidebar } from "@/contexts/sidebar-context";

const Sidebar = () => {
  const [openEcom, setOpenEcom] = useState(true);
  const [selected, setSelected] = useState("Product Listing");
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-gray-500 bg-opacity-30 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen w-64 border-r border-gray-100 bg-white flex flex-col justify-between shadow-sm z-40 transition-transform duration-300 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}>

      {/* SCROLLABLE MENU */}
      <div className="overflow-y-auto flex-1 scrollbar-hide">
        <div className="px-5 py-5 flex items-center bg-white z-10 gap-4 font-bold text-xl sticky top-0  border-b border-gray-100">
          <button
            onClick={closeMobileMenu}
            className="md:hidden"
          >
            <IoClose className="text-2xl" />
          </button>
          <span className="text-[#C9222D]">PARTNER APP</span>
        </div>

        <nav className="mt-3 flex flex-col gap-2">
          <SidebarItem
            icon="/icons/calender.png"
            label="Turf Booking"
            selected={selected}
            onClick={() => setSelected("Turf Booking")}
          />

          <SidebarItem
            icon="/icons/home.png"
            label="My Turf"
            selected={selected}
            onClick={() => setSelected("My Turf")}
          />

          <SidebarItem
            icon="/icons/reports.png"
            label="Reports"
            selected={selected}
            onClick={() => setSelected("Reports")}
          />

          <SidebarItem
            icon="/icons/feedback.png"
            label="My Feed"
            selected={selected}
            onClick={() => setSelected("My Feed")}
          />

          <SidebarItem
            icon="/icons/running.png"
            label="Coaching"
            selected={selected}
            onClick={() => setSelected("Coaching")}
          />

          {/* ECOMMERCE DROPDOWN */}
          <div className="mb-1">
            <button
              onClick={() => setOpenEcom(!openEcom)}
              className={`flex items-center justify-between w-full px-5 py-3 hover:bg-gray-50 rounded-lg transition cursor-pointer`}
            >
              <div className="flex items-center gap-3.5">
                <div className="relative w-5 h-5">
                  <Image 
                    src="/icons/ecommerce.png" 
                    alt="Ecommerce" 
                    fill
                    className="object-contain opacity-70"
                  />
                </div>
                <span className="text-[15px] font-medium text-gray-900">Ecommerce</span>
              </div>
              <span className="text-gray-500 text-sm">
                {openEcom ? <IoIosArrowUp size={20}/> : <IoIosArrowDown size={20}/>}
              </span>
            </button>

         {openEcom && (
  <div className="ml-9 flex flex-col gap-1.5 relative">
    {/* Vertical connecting line */}
    <div className="absolute left-[-8px] top-0 bottom-0 w-[2px] bg-gray-300"></div>
    
    <button
      onClick={() => setSelected("Product Listing")}
      className={`px-4 py-2.5 rounded-md text-left transition cursor-pointer relative`}
    >
      <span className={`font-medium py-2 px-3 w-full ${selected === "Product Listing"
          ? "bg-gray-200 rounded-md text-red-700 border border-gray-100"
          : "hover:bg-gray-100 text-gray-900"}`}>Product Listing</span>
    </button>

    <button
      onClick={() => setSelected("My Orders")}
      className={`px-4 pt-2.5 rounded-md text-left transition cursor-pointer relative`}
    >
       <span className={`font-medium py-2 px-3 w-full ${selected === "My Orders"
          ? "bg-gray-200 rounded-md text-red-700 border border-gray-100"
          : "hover:bg-gray-100 text-gray-900"}`}>My Orders</span>
    </button>
  </div>
)}
          </div>

          {/* Vertical line from Ecommerce to Events when dropdown is open */}
          {openEcom && (
            <div className="relative">
              <div className="absolute left-[-8px] top-0 bottom-0 w-[2px] bg-gray-300 "></div>
            </div>
          )}

          <SidebarItem
            icon="/icons/events.png"
            label="Events"
            selected={selected}
            onClick={() => setSelected("Events")}
          />

          <SidebarItem
            icon="/icons/contacts.png"
            label="My Contacts"
            selected={selected}
            onClick={() => setSelected("My Contacts")}
          />

          <SidebarItem
            icon="/icons/partnership.png"
            label="Partners"
            selected={selected}
            onClick={() => setSelected("Partners")}
          />

          <SidebarItem
            icon="/icons/security.png"
            label="Privacy Policy"
            selected={selected}
            onClick={() => setSelected("Privacy Policy")}
          />
        </nav>
      </div>

      {/* FIXED USER CARD */}
      <div className="px-5 py-5 border-t border-gray-100 bg-gray-50 sticky bottom-0 cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="relative w-10 h-10">
            <Image
              src="/user.png"
              alt="User"
              fill
              className="rounded-full object-cover"
            />
          </div>

          <div>
            <p className="font-600 text-[16px] text-black font-semibold">Fenil Shidore</p>
            <p className="text-[11px] text-gray-500">Venue Owner</p>
          </div>

          <IoLogOutOutline className="text-2xl text-gray-700" />
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;


// -------- REUSABLE COMPONENT --------
interface ItemProps {
  icon: string;
  label: string;
  selected: string;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, selected, onClick }: ItemProps) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3.5 px-5 py-3.5 rounded-lg w-full text-left transition
      ${selected === label 
        ? " cursor-pointer bg-gray-100 rounded-xl text-red-700 border border-gray-100" 
        : " cursor-pointer hover:bg-gray-100  "}`}
  >
    <div className="relative w-5 h-5">
      <Image 
        src={icon} 
        alt={label} 
        fill
        className="object-contain opacity-70"
      />
    </div>
    <span className="text-[15px] font-medium">{label}</span>
  </button>
);