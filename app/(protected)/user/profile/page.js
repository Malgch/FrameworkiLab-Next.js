'use client'
import { useEffect, useState } from "react"
import {auth} from "@/app/lib/firebase"
import {db} from "@/app/lib/firebase"
import { collection, addDoc, setDoc, getDoc, doc } from 'firebase/firestore'

function UserPage() {

  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    city: "",
    street: "",
    zipCode: "",
    username: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user)
      {
        setUserEmail(user.email);

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            username: data.username || "",
            city: data.address?.city || "",
            street: data.address?.street || "",
            zipCode: data.address?.zipCode || "",
          });
        } else {
          console.log("no document found");
          await setDoc(docRef, {
            username: "",
            city: "",
            street: "",
            zipCode: "",
          })
        }

      }
      setLoading(false);
    };
    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          username: userData.username,
          address: {
            city: userData.city,
            street: userData.street,
            zipCode: userData.zipCode,
          },
        },
        { merge: true }
      );
        console.log("Profile updated successfully!");
      }
    } catch (e) {
      console.error("Error updating profile: ", e);
    }
    setSaving(false);
  };

    return (

  <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    
  <div className="mx-auto max-w-lg">
    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Welcome to your user profile</h1>

    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
      {userEmail ? `Logged in as: ${userEmail}` : "No user logged in."}
    </p>

    <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userData.username}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              />

            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={userData.city}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
              <input
                type="text"
                id="street"
                name="street"
                value={userData.street}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={userData.zipCode}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-200 p-4 text-sm shadow-sm"
              />
            </div>

            

            <button
              type="submit"
              className="block w-full rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>

  </div>
</div>

    )
}
export default UserPage