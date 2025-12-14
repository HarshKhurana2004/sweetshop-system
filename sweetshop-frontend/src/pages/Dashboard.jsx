import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


export default function Dashboard() {
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  let isAdmin = false;

if (token) {
  try {
    const decoded = jwtDecode(token);
    isAdmin = decoded.role === "admin";
  } catch (err) {
    isAdmin = false;
  }
}


  // Redirect if NOT logged in
  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  
  // Fetch sweets
  const fetchSweets = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/sweets${search ? "/search?name=" + search : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to fetch sweets");
        return;
      }

      setSweets(data);
    } catch (err) {
      setError("Server error");
    }
  };

  useEffect(() => {
    fetchSweets();
  }, [search]);

  // Purchase a sweet
  const handlePurchase = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/sweets/${id}/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Purchase failed");
        return;
      }

      alert("Purchase successful!");
      fetchSweets(); // refresh
    } catch (e) {
      alert("Server error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Sweet Shop</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Admin Only: Add Sweet Button */}
{isAdmin && (
  <button
    onClick={() => navigate("/add-sweet")}
    className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    + Add Sweet
  </button>
)}


      {/* Search bar */}
      <input
        type="text"
        placeholder="Search sweets..."
        className="p-2 border rounded w-full mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Sweets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
          <div key={sweet.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">{sweet.name}</h2>
            <p className="text-gray-700">{sweet.category}</p>
            <p className="text-gray-900 font-semibold">₹{sweet.price}</p>

            <p className="mt-2">
              Quantity:{" "}
              <span className={sweet.quantity > 0 ? "text-green-600" : "text-red-600"}>
                {sweet.quantity}
              </span>
            </p>

            <button
              onClick={() => handlePurchase(sweet.id)}
              disabled={sweet.quantity === 0}
              className={`mt-4 w-full py-2 rounded text-white ${
                sweet.quantity === 0 ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {sweet.quantity === 0 ? "Out of Stock" : "Purchase"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
