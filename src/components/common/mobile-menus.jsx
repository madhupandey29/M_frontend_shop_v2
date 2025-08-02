import React,{useState} from "react";
import Image from "next/image";
import Link from "next/link";
import { mobile_menu } from "@/data/menu-data";

const MobileMenus = () => {
  const [isActiveMenu,setIsActiveMenu] = useState("")

  // handleOpenSubMenu
  const handleOpenSubMenu = (title) => {
    if(title === isActiveMenu){
      setIsActiveMenu("")
    }
    else {
      setIsActiveMenu(title)
    }
  }
  return (
    <>
      <nav className="tp-main-menu-content">
        {mobile_menu.map((menu, i) => (
          <ul key={i}>
            {menu.single_link ? (
              <li key={menu.id}>
                <Link href={menu.link}>{menu.title}</Link>
              </li>
            ) : menu.sub_menu ? (
              <li key={menu.id} className={`has-dropdown ${isActiveMenu === menu.title ? 'dropdown-opened':''}`}>
                <a className={`${isActiveMenu === menu.title ? 'expanded':''}`}>
                  {menu.title}
                  <button onClick={()=> handleOpenSubMenu(menu.title)} className={`dropdown-toggle-btn ${isActiveMenu === menu.title ? 'dropdown-opened':''}`}>
                    <i className="fa-regular fa-angle-right"></i>
                  </button>
                </a>
                <ul className={`tp-submenu ${isActiveMenu === menu.title ? 'active':''}`}>
                  {menu.sub_menus.map((b, i) => (
                    <li key={i}>
                      <Link href={b.link}>{b.title}</Link>
                    </li>
                  ))}
                </ul>
              </li>
            ) : null}
          </ul>
        ))}
      </nav>
    </>
  );
};

export default MobileMenus;