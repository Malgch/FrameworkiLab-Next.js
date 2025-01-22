'use client';
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";

function LogoutForm() {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleLogout = async () => {
    setError("");
    setLoading(true);

    try {
      await signOut(auth);
      console.log("user logged out");
      router.push("/user/login");
    }
    catch(err) {
      console.log("Error logging out", err.message);
      setError("An error occurred while logging out. Please try again");
    }
    finally {
      setLoading(false);
    }
  }


    return (

      <section className="bg-white min-h-screen">
        <div className="mx-auto  px-4 py-16 sm:px-6 lg:px-8 max-w-2xl">

    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Do you want to log out from website?</h1>
    {error && <p className="error-message">{error}</p>}

    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Obcaecati sunt dolores deleniti
      inventore quaerat mollitia?
    </p>

      <div className="py-8">
    <button
        type="button"
        onClick={handleLogout}
        disabled = {loading}
        className="block w-full rounded-lg bg-indigo-600 px- py-3 text-sm font-medium text-white" >
        {loading ? "Logging out..." : "Logout"}
      </button>
      </div>
</div>
</section>
    )
}
export default LogoutForm