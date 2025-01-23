'use client'
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import {auth} from "@/app/lib/firebase"
import {db} from "@/app/lib/firebase"
import { collection, addDoc, setDoc, getDoc, doc } from 'firebase/firestore'

function UserPage() {

  const [userEmail, setUserEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

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
          setValue("username", data.username || "");
          setValue("photoURL", data.photoURL || "");
          setValue("city", data.address?.city || "");
          setValue("street", data.address?.street || "");
          setValue("zipCode", data.address?.zipCode || "");
          setProfileImage(data.photoURL || "")

        } else {
          console.log("no document found");
          await setDoc(docRef, {
            username: "",
            photoURL: "",
            address: {city: "", street: "", zipCode: ""},
          })
        }

      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [setValue]);


  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          username: data.username,
          photoURL: data.photoURL,
          address: {
            city: data.city,
            street: data.street,
            zipCode: data.zipCode,
          },
        },
        { merge: true }
      );
        console.log("Profile updated successfully!");
        setProfileImage(data.photoURL)
      }
    } catch (e) {
      console.error("Error updating profile: ", e);
    }
    setSaving(false);
  };

    return (
  <section className="bg-white text-gray-900 min-h-screen">
  <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
    
  <div className="mx-auto max-w-lg">
    <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl">Welcome to your user profile</h1>
    <div className="flex justify-center mt-4">
            <img src={profileImage} alt="Profile" className="w-32 h-32 rounded-full border border-gray-300 shadow-md" />
          </div>
    <p className="mx-auto mt-4 max-w-md text-center text-gray-500">
      {userEmail ? `Logged as: ${userEmail}` : "No user logged in."}
    </p>

    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 rounded-lg p-4 shadow-lg sm:p-6 lg:p-8">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                {...register("username", { 
                  maxLength: { value: 12, message: "Username cannot be longer than 12 characters."},
                  minLength: {value: 2, message: "Username cannot be shorter than 2 characters."} })}
                className="w-full rounded-lg bg-white border-gray-200 p-4 text-sm shadow-sm"
              />
              {errors.username && <p style={{ color: "red" }}>{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                {...register("city", { pattern: { value: /^[a-zA-Z\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C\u0179\s]+$/, message: "Only letters allowed." } })}
                className="w-full rounded-lg bg-white border-gray-200 p-4 text-sm shadow-sm"
              />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Name</label>
              <input
                type="text"
                id="street"
                {...register("street", { pattern: { value: /^[a-zA-Z\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C\u0179\s]+$/, message: "Only letters allowed." } })}
                className="w-full rounded-lg bg-white border-gray-200 p-4 text-sm shadow-sm"
              />
              {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street.message}</p>}
            </div>

            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                {...register("zipCode", { pattern: { value: /^[0-9]{2}-[0-9]{3}$/, message: "Please provide zip code in correct format." } })}
                className="w-full rounded-lg bg-white border-gray-200 p-4 text-sm shadow-sm"
              />
              {errors.zipCode && <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>}
            </div>

            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700">Profile photo URL</label>
              <input
                type="text"
                id="photoURL"
                {...register("photoURL", { pattern: { value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/, message: "Enter a valid image URL (png, jpg, jpeg, gif, webp)" } })}
                className="w-full rounded-lg bg-white border-gray-200 p-4 text-sm shadow-sm"
              />
              {errors.photoURL && <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>}
            </div>

            

            <button
              type="submit"
              className="block w-full rounded-lg  bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
              disabled={saving}>
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>

  </div>
</div>
</section>
    )
}
export default UserPage