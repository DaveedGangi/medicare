import { useState,useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();


   useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/"); // Or /patient-dashboard or /caretaker-dashboard
    }
  }, []);


  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border" />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} className="w-full p-2 border" />
        <button type="submit" className="w-full p-2 bg-green-600 text-white">Sign In</button>
      </form>
      <p className="text-sm text-center">
  Don't have an account?{" "}
  <a href="/signup" className="text-blue-600 underline">
    Sign up here
  </a>
</p>

    </div>
  );
}
