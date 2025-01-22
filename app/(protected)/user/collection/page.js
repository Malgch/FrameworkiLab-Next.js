'use client'

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { auth, db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';

const placeholderImage = '/img/default_painting.jpg';

export default function CollectionPage() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const fetchPaintings = async () => {
      setLoading(true);
      setError(null);
      try {
        const user = auth.currentUser;
        if (user) {
          const userCollectionRef = collection(db, 'paintings');
          const q = query(userCollectionRef, where('user', '==', `/users/${user.uid}`));
          const querySnapshot = await getDocs(q);
          const paintingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPaintings(paintingsData);
        }
      } catch (err) {
        setError('Failed to fetch paintings. Please try again.');
        console.error('Error fetching paintings:', err);
      }
      setLoading(false);
    };

    fetchPaintings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'paintings', id));
      setPaintings((prev) => prev.filter((painting) => painting.id !== id));
      console.log('Painting deleted successfully');
    } catch (error) {
      console.error('Error deleting painting:', error);
    }
  };

  const handleEdit = (id) => {
    const paintingToEdit = paintings.find((painting) => painting.id === id);
    if (paintingToEdit) {
      setEditingId(id);
      reset({
        authorName: paintingToEdit.authorName,
        authorSurname: paintingToEdit.authorSurname,
        title: paintingToEdit.title,
        technique: paintingToEdit.technique,
        imageURL: paintingToEdit.imageURL,
        year: paintingToEdit.date,
      });
    }
  };

  const onSubmit = async (data) => {
    setError(null);
    try {
      const user = auth.currentUser;
      if (user) {
        const selectedYear = Number(data.year);
        if (isNaN(selectedYear)) {
          throw new Error('Invalid year input');
        }

        if (editingId) {
          // Update existing painting
          await updateDoc(doc(db, 'paintings', editingId), {
            authorName: data.authorName,
            authorSurname: data.authorSurname,
            title: data.title,
            technique: data.technique,
            imageURL: data.imageURL,
            date: selectedYear,
          });
          setPaintings((prev) =>
            prev.map((painting) =>
              painting.id === editingId ? { ...painting, ...data, date: selectedYear } : painting
            )
          );
          setEditingId(null);
          reset({
            authorName: '',
            authorSurname: '',
            title: '',
            technique: '',
            imageURL: '',
            year: '',
          });
        } else {
          // Add new painting
          await addDoc(collection(db, 'paintings'), {
            authorName: data.authorName,
            authorSurname: data.authorSurname,
            title: data.title,
            technique: data.technique,
            imageURL: data.imageURL,
            date: selectedYear,
            user: `/users/${user.uid}`,
          });
          setPaintings((prev) => [...prev, { ...data, date: selectedYear, imageURL: data.imageURL }]);
        }
        reset();
      }
    }

     catch (err) {
      setError('Failed to add painting. Please try again.');
      console.error('Error adding painting:', err);
    }

    

  };

  return (
    <section className="bg-white text-gray-900 min-h-screen">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-center text-2xl font-bold text-indigo-600 sm:text-3xl ">My Favourite Paintings</h1>
        <br></br>
        


      {loading && <p className="text-center text-gray-600">Loading paintings...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto bg-gray-100 p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add or Edit Painting</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 ">Author Name</label>
          <input
            {...register('authorName', { required: 'Author name is required', pattern: { value: /^[a-zA-Z\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C\u0179\s]+$/, message: "Only letters allowed." } })}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          />
          {errors.authorName && <p className="text-red-500 text-sm">{errors.authorName.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Author Surname</label>
          <input
            {...register('authorSurname')}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          />
          {errors.authorSurname && <p className="text-red-500 text-sm">{errors.authorSurname.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Technique</label>
          <input
            {...register('technique', { required: 'Technique is required', pattern: { value: /^[a-zA-Z\s]+$/, message: "Only letters allowed." } })}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          />
          {errors.technique && <p className="text-red-500 text-sm">{errors.technique.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Year painted</label>
          <input
            type="number"
            {...register("year", { 
                required: 'Year is required', 
                min: {value:500, message: 'Year must be at least 500'},
                max: {value: new Date().getFullYear(), message: 'Year cannot be in the future'}  
            })}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            {...register('imageURL', {required: 'Image is required.', pattern: { value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/, message: 'Enter a valid image URL' } })}
            className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          />
          {errors.imageURL && <p className="text-red-500 text-sm">{errors.imageURL.message}</p>}
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white p-3 rounded-lg">Submit</button>
      </form>



      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {paintings.length > 0 ? (
          paintings.map((painting) => (
            <div key={painting.id} className="card bg-base-100 shadow-xl bg-white ">
              <figure className="relative">
                <img
                  src={painting.imageURL || null}
                  alt={painting.title}
                />

              </figure>
              <div className="card-body ">
                  <div className="mt-auto "> 
                    <h2 className="card-title text-indigo-600 ">{painting.title}</h2>
                    <p className="text-gray-600">{painting.authorName} {painting.authorSurname}</p>
                    <p className="text-sm text-gray-500">Technique: {painting.technique}</p>
                    <p className="text-sm text-gray-500 ">Year: {painting.date}</p>
                    <div className="flex gap-2 mt-2">
                  <button onClick={() => handleEdit(painting.id)} className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm">Edit</button>
                  <button onClick={() => handleDelete(painting.id)} className="bg-red-700 text-white px-3 py-1 rounded-lg text-sm">Delete</button>
                </div>
                  </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No paintings found in your collection.</p>
        )}
      </div>
      </div>
    </section>
  );
}
