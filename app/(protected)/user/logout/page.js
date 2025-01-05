'use client';
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";

function LogoutForm() {

  const [error, setError] = useState("");
  const router = useRouter();
  
  useEffect(() => {
    const logout = async () => {
      try {
        await signOut(auth);
        console.log("user logged out");
        router.push("/user/login");
      }
      catch(err) {
        console.error("Error logging out", err.message);
        setError("An error occurred while logging out. Please try again");
      }
    };

    logout();
  }, [router]);

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">

    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Logging out...</h1>
    {error && <p className="error-message">{error}</p>}

    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati sunt dolores deleniti
      inventore quaerat mollitia?
    </p>



</div>
    )
}
export default LogoutForm