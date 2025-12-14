import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddSweet() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/sweets", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          quantity: Number(quantity),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add sweet");
        return;
      }

      setSuccess("Sweet added successfully!");

      setTimeout(() => navigate("/"), 1000);

    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h1 className="text-2xl font-bold mb-6">Add Sweet</h1>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-3">{success}</p>}

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Sweet Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded mb-3"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded mb-3"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          className="w-full border p-2 rounded mb-6"
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Sweet
        </button>
      </form>
    </div>
  );
}
