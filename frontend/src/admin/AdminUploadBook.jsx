import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import wall from "../assets/wall5.jpg";
import config from "../config";

const AdminUploadBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [ISBN, setISBN] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const navigate = useNavigate();
  // const token = localStorage.getItem("token");

  // useEffect(() => {
  //   axios.post(
  //     `${config.apiUrl}/UploadBook`,
  //     null,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       }
  //     }
  //   );
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${config.apiUrl}/AdminUploadBook`,
        {
          title,
          author,
          ISBN,
          isAvailable,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      navigate("/Admindashboard");
    } catch (err) {
      console.error("Book upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <img
        src={wall}
        className="absolute w-full h-full object-cover z-0"
        alt="Chat background"
      />
      <form
        onSubmit={handleSubmit}
        className="relative bg-transparent shadow-lg rounded-lg p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-200 text-center">Create Note</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
        <input
          type="text"
          placeholder="ISBN"
          value={ISBN}
          onChange={(e) => setISBN(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
          required
        />
        {/* <select
          value={isAvailable ? "true" : "false"}
          onChange={(e) => setIsAvailable(e.target.value === "true")}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>
        <input
          type="text"
          placeholder="Borrowed By (User ID)"
          value={borrowedID || ""}
          onChange={(e) => setBorrowedID(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
        /> */}

        <div className="flex flex-col items-center justify-center gap-2">
          <button
            type="submit"
            className="bg-gray-300 text-black px-10 py-2 rounded hover:bg-gray-500 transition duration-300"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="bg-gray-300 text-black px-10 py-2 rounded hover:bg-gray-500 transition duration-300"
          >
            back
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUploadBook;