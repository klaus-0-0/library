import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import wall from "../assets/wall14.png"
import config from "../config";

const Dashboard = () => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchbooks = async () => {
      try {
        const res = await axios.post(`${config.apiUrl}/fetchbooks`, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("data= ", res);

        setAvailableBooks(res.data.books || []);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } 
    };

    fetchbooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleBuyBook = async (book) => {
    if (!book.isAvailable) return;

    try {
      const token = localStorage.getItem("token");
      // Update book availability in backend
      await axios.put(`${config.apiUrl}/markAsSold`, { bookId: book.id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Navigate to MyBooks with book data
      navigate("/mybooks");
    } catch (err) {
      console.error("Error buying book:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <img
        src={wall}
        className="absolute w-full h-full object-cover z-0"
        alt="Chat background"
      />
      {/* Navbar */}
      <nav className="relative flex justify-between items-center bg-white shadow px-6 py-4">
        <h1 className="relative text-xl font-bold text-gray-800">📝 Books</h1>
        <div className="space-x-4 relative">
          <button
            onClick={()=>navigate("/MyBooks")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          >
            My books
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Available Books Section */}
      <div className="relative mt-10 px-4">
        <h2 className="text-xl font-bold mb-6 text-center text-black">📚 Available Books</h2>

        {availableBooks.length === 0 ? (
          <p className="text-center text-gray-500">No books currently available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableBooks.map((book) => (
              <div
                key={book.id}
                className="relative bg-white rounded-lg shadow-md p-4 w-full h-50 max-w-xs mx-auto flex flex-col justify-between hover:shadow-xl transition duration-300 cursor-pointer"
              >
                {/* Simulated spine */}
                <div className="absolute left-0 top-0  w-2 bg-gray-700 rounded-l-lg"></div>

                {/* Book content */}
                <div className="flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{book.title}</h3>
                  <p className="text-sm text-gray-600">Author: <span className="font-medium">{book.author}</span></p>
                  <p className="text-sm text-gray-600">ISBN: <span className="font-mono">{book.ISBN}</span></p>
                  <p className="text-sm mt-2">
                    Status: <span className={`font-semibold ${book.isAvailable ? "text-green-600" : "text-red-500"}`}>
                      {book.isAvailable ? "Available" : "sold out"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-4">date: ?</p>
                  <div className="flex flex-col items-end">
                    <button className="bg-cyan-600 hover:bg-cyan-700 p-2 rounded-xl cursor-pointer px-6" onClick={() => handleBuyBook(book)}>buy</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
