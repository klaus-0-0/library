import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config";

const MyBooks = () => {
  const [myBooks, setMyBooks] = useState([]);

  const fetchMyBooks = async () => {
    try {
      const res = await axios.get(`${config.apiUrl}/mybooks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMyBooks(res.data.books || []);
    } catch (err) {
      console.error("Error fetching my books:", err);
    }
  };

  useEffect(() => {
    fetchMyBooks();
  }, []);

  const handleReturn = async (bookId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${config.apiUrl}/returnbook`, { bookId }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh list after return
      fetchMyBooks();
    } catch (err) {
      console.error("Error returning book:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📖 Your Purchased Books</h2>
      {myBooks.length === 0 ? (
        <p className="text-center text-gray-500">You haven't bought any books yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBooks.map((book) => (
            <div key={book.id} className="bg-white rounded-lg shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition duration-300">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
                <p className="text-sm text-gray-600">Author: {book.author}</p>
                <p className="text-sm text-gray-600">ISBN: {book.ISBN}</p>
                <p className="text-sm text-green-600 font-semibold mt-2">Status: Your book</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleReturn(book.id)}
                  className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 transition cursor-pointer"
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooks;