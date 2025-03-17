import React, { useState } from "react";
import LibOpen from "../../../assets/icons/User/Common/LibClose";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex flex-col space-y-4 h-screen bg-[#040404] p-4 basis-1/3">
      {/* section 1 */}
      <div className={`flex items-center space-x-4 ${isOpen ? "justify-between" : "justify-center"}`}>
        <div className="group flex items-center space-x-2">
          <LibOpen />
          <span className=" group-hover:text-white text-slate-300 transition-all duration-200 font-semibold">Thư viện</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
