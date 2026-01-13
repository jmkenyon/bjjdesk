import PanelItem from "./PanelItem";
import { PiStudent } from "react-icons/pi";
import { MdOutlinePayments } from "react-icons/md";

import { BsQrCode } from "react-icons/bs";
import { CiCreditCard1 } from "react-icons/ci";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";

interface AdminSidebarProps {
  gymSlug: string;
}

const AdminSidebar = ({ gymSlug }: AdminSidebarProps) => {
  return (
    <ul className="flex flex-col">
      <PanelItem title="Students" icon={PiStudent} gymSlug={gymSlug} type="admin" />
      <PanelItem
        title="Memberships"
        icon={MdOutlinePayments}
        gymSlug={gymSlug}
        type="admin"
      />
      <PanelItem
        title="Waiver"
        icon={IoDocumentTextOutline}
        gymSlug={gymSlug}
        type="admin"
      />
      <PanelItem
        title="QR drop-in"
        icon={BsQrCode}
        URLOveride="qr-code"
        gymSlug={gymSlug}
        type="admin"
      />
      <PanelItem
        title="Timetable"
        icon={FaRegCalendarAlt}
        gymSlug={gymSlug}
        type="admin"
      />

      <PanelItem
        title="Subscription"
        icon={CiCreditCard1}
        gymSlug={gymSlug}
        type="admin"
      />
      <PanelItem
        title="Gym info"
        URLOveride="information"
        icon={IoMdInformationCircleOutline}
        gymSlug={gymSlug}
        type="admin"
      />
    </ul>
  );
};

export default AdminSidebar;
