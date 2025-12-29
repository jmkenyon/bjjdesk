"use client"


import { PiStudent } from "react-icons/pi";
import { MdOutlinePayments } from "react-icons/md";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { BsQrCode } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import PanelItem from "./PanelItem";



const OptionsPanel = () => {
  return (
    <section className="w-75 border-r-2 border-black h-screen shadow-accent bg-blue-400">
    <ul className="flex flex-col">
    <PanelItem  title="Students" icon={PiStudent}/>
    <PanelItem  title="Payments" icon={MdOutlinePayments}/>
    <PanelItem title="Documents" icon={MdOutlineDocumentScanner}/>
    <PanelItem  title="QR drop-in" icon={BsQrCode} URLOveride="qr-code"/>
    <PanelItem title="Settings" icon={IoSettingsOutline}/>
    </ul>
  </section>
  )
}

export default OptionsPanel