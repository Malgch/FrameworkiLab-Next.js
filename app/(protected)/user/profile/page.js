'use client'
import { useEffect, useState } from "react"
import {auth} from "@/app/lib/firebase"

function UserPage() {

  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
      const user = auth.currentUser;
      if (user)
      {
        setUserEmail(user.email);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

    return (

  <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    
  <div className="mx-auto max-w-lg">
    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Welcome to your user profile</h1>

    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
      {userEmail ? `Logged in as: ${userEmail}` : "No user logged in."}
    </p>


  </div>
</div>

    )
}
export default UserPage