import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authSlice";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import logo from "../../../assets/images/logo.jpg"; 

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(form));
  };

  /* ===== ROLE REDIRECT ===== */
  useEffect(() => {
    if (!user) return;

    if (user.role === "superadmin") navigate("/admin");
    else if (user.role === "franchise") navigate("/franchise");
    else if (user.role === "staff") navigate("/staff");
  }, [user, navigate]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#0B1A3A]">

      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 bg-gradient-to-br
        from-[#08122b]
        via-[#0B1A3A]
        to-[#020617]" />

      {/* Brand Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        w-[800px] h-[800px]
        bg-[#F59E0B]/20 blur-[160px] rounded-full" />

      {/* Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      {/* ===== CENTER CONTENT ===== */}
    <div className="relative min-h-screen flex items-center justify-center px-4 py-6">

        {/* LOGIN CARD */}
       <div className="
  w-full max-w-md
  p-6 sm:p-10
  rounded-3xl
  bg-white/5
  backdrop-blur-2xl
  border border-white/10
  shadow-[0_30px_80px_rgba(0,0,0,0.6)]
">

  {/* Logo */}
  <div className="flex justify-center mb-4 sm:mb-6">
    <img
      src={logo}
      alt="Egg ATM"
      className="h-10 sm:h-14 object-contain"
    />
  </div>

  {/* Title */}
  <h2 className="text-2xl sm:text-3xl font-semibold text-white text-center">
    Welcome Back
  </h2>

  <p className="text-gray-400 text-center mt-1 sm:mt-2 mb-6 sm:mb-8 text-sm sm:text-base">
    Sign in to continue
  </p>

  {/* FORM */}
  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

    <Input
      label="Email Address"
      name="email"
      onChange={handleChange}
    />

    <Input
      label="Password"
      type="password"
      name="password"
      onChange={handleChange}
    />

    <Button loading={loading}>
      Sign In
    </Button>

  </form>
</div>
      </div>
    </div>
  );
}
