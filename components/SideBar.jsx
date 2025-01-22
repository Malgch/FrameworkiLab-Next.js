'use client'
import { useAuth } from "@/app/lib/AuthContext";
import Link from "next/link";
import {auth} from '@/app/lib/firebase';

function SideBar({ children }) {
  const {user} = useAuth();
  return (
    <div className="drawer lg:drawer-open ">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" defaultChecked={false} />
      <div className="drawer-content">
        {children}
        <label  htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden " >Open drawer </label>
      </div>
      <div className="drawer-side ">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay " 
        ></label>
        <ul className="menu min-h-full w-50 p-4 bg-gray-100 text-gray-800">
          {/* Sidebar content here */}
          <li> {user && <Link href="/user/profile">Profile</Link>} </li>
          <li> {user && <Link href="/user/collection">Collection</Link>} </li>
          <li> {user && <Link href="/user/logout">Logout</Link>} </li>
          <li>{!user && <Link href="/user/register">Register</Link>} </li>
          <li>{!user && <Link href="/user/login">Login</Link>} </li>
          
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
