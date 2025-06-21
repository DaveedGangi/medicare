import { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.post("/api/auth/signup", form);
      alert("Signup successful!");
      navigate("/signin");
    } catch (err: any) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="Name" onChange={handleChange} className="w-full p-2 border" />
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full p-2 border" />
        <select name="role" onChange={handleChange} className="w-full p-2 border">
          <option value="patient">Patient</option>
          <option value="caretaker">Caretaker</option>
        </select>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white">Sign Up</button>
      </form>
      <p className="text-sm text-center">
  Already have an account?{" "}
  <a href="/signin" className="text-blue-600 underline">
    Sign in here
  </a>
</p>

    </div>
  );
}
