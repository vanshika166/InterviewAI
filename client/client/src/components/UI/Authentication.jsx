import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { TiMicrophoneOutline } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../../utils/firebase.js";
import { serverURL } from "../../App.jsx";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/userSlice.js";

const Authentication = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // GOGGLE AUTHENTICATION:
  const handleGoogleAuth = async () => {
    try {
      const res = await signInWithPopup(auth, provider)
      console.log(res)
      const user = res.user
      let name = user.displayName;
      let email = user.email;
      const result = await axios.post(serverURL + '/api/auth/google-auth', { name, email }, { withCredentials: true })
      
      if (result.data) {
        dispatch(setUserData(result.data))
        navigate('/')
      }
    } catch (error) {
      console.log(error)
      alert('Authentication failed. Please try again.')
    }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#FBFDFD] rounded-3xl shadow-2xl overflow-hidden">

        {/* Subtle Top Accent */}
        <div className="h-1 bg-gradient-to-r from-[#1EBDD8] to-teal-500"></div>

        <div className="p-9 md:p-10">
          {/* Close Button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center 
                       text-gray-400 hover:text-black hover:bg-gray-100 
                       transition-all rounded-xl text-xl leading-none"
            aria-label="Close"
          >
            ✕
          </button>

          {/* Logo / Brand */}
          <div className="flex items-center justify-center gap-2.5 mb-8">
            <div className="w-10 h-10 hover:rotate-360 transition-all duration-500 ease-in-out rounded-xl bg-gradient-to-r  from-[#2BB6B6] via-[#1EBDD8] to-[#1EBDD8]/50 flex items-center justify-center transition-all duration-300 hover:scale-105">
              <span className="text-white text-lg"><TiMicrophoneOutline size={22} /></span>
            </div>
            <span className="text-2xl font-Montserrat font-semibold text-black tracking-tighter">
              InterviewAI
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-semibold text-black text-center tracking-normal">
            Continue with Smart Interview AI
          </h2>
          <p className="text-gray-400 text-center mt-3 text-[15px] leading-relaxed">
            Master your interview skills with AI-powered practice
          </p>

          {/* Google Sign-in Button */}
          <button
            onClick={handleGoogleAuth}
            className="mt-10 w-full flex items-center justify-center gap-3 
                       bg-white hover:bg-gray-50 active:bg-gray-100 
                       transition-all duration-200
                       text-black font-medium py-3.5 rounded-2xl 
                       shadow-md shadow-black/20 hover:shadow-lg 
                       active:scale-[0.985]"
          >
            <FcGoogle size={22} />
            <span>Continue with Google</span>
          </button>

          {/* Trust signals */}
          <div className="flex items-center justify-center gap-4 mt-7 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>🔒</span>
              <span>Secure</span>
            </div>
            <div className="text-gray-300">•</div>
            <div>Fast login</div>
            <div className="text-gray-300">•</div>
            <div>No password needed</div>
          </div>

          {/* Terms */}
          <p className="text-center text-[13px] text-gray-500 mt-9 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-[#1EBDD8] hover:underline cursor-pointer transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#1EBDD8] hover:underline cursor-pointer transition-colors">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Authentication;