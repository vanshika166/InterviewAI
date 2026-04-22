import { Route, Routes } from 'react-router-dom'
import { Toaster } from "sonner";
import Mainlayout from './layouts/Mainlayout.jsx'
import Home from './features/home/pages/Home.jsx'
import Authentication from './components/UI/Authentication.jsx'
import Dashboard from './features/dashboard/pages/Dashboard.jsx'
import History from './features/history/pages/History.jsx'
import InterviewLayout from './layouts/InterviewLayout.jsx'
import SelectInterview from './features/interview/pages/SelectInterview.jsx'
import StartInterview from './features/interview/pages/StartInterview.jsx'
import { useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData, setLoading, setUserCredits } from './redux/userSlice.js'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import InterviewDetail from './features/InterviewDetail/page/InterviewDetail.jsx';
import { setInterviewList, setInterviewStats } from './redux/interviewSlice.js';
import PricingLayout from './layouts/PricingLayout.jsx';
import Plan from './features/pricing/pages/Plan.jsx';
import Payment from './features/pricing/pages/Payment.jsx';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./utils/firebase.js";

export const serverURL = "https://interviewai-server-jxpe.onrender.com"

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(setUserData(null));
        dispatch(setUserCredits(null));
        dispatch(setLoading(false));
        return;
      }

      dispatch(setUserData({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      }));

      await getCurrentUser();

      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  //  BACKEND USER DATA
  const getCurrentUser = async () => {
    try {
      const response = await axios.get(
        serverURL + '/api/user/current-user',
        { withCredentials: true }
      );

      if (response.data.success) {
        dispatch(setUserCredits(response.data.user.credits));

        await getInterviewStats();
        await getUsersInterviewList();

      } else {
        dispatch(setUserCredits(null));
        dispatch(setUserData(null));

      }

    } catch (error) {
      console.log("getCurrentUser error:", error);

      dispatch(setUserCredits(null));
    }
  };

  // 📊 INTERVIEW STATS
  const getInterviewStats = async () => {
    try {
      const result = await axios.post(
        serverURL + '/api/interview/user-interview-stats',
        {},
        { withCredentials: true }
      );

      if (result.data.success) {
        dispatch(setInterviewStats(result.data.stats));
      }
    } catch (error) {
      console.log("stats error:", error);
      dispatch(setInterviewStats(null));
    }
  };

  // 📋 INTERVIEW LIST
  const getUsersInterviewList = async () => {
    try {
      const result = await axios.post(
        serverURL + '/api/interview/user-interview-list',
        {},
        { withCredentials: true }
      );

      if (result.data.success) {
        dispatch(setInterviewList(result.data.interviews));
      }
    } catch (error) {
      console.log("list error:", error);
      dispatch(setInterviewList(null));
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: "#2EBDDB",
            color: "#fff",
            borderRadius: "12px",
            padding: "14px 16px",
          },
        }}
      />

      <Routes>
        <Route path='/' element={<Mainlayout />}>
          <Route index element={<Home />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/history' element={<History />} />
          <Route path='/details/:id' element={<InterviewDetail />} />
        </Route>

        <Route path="/interview/:type" element={
          <ProtectedRoute>
            <InterviewLayout />
          </ProtectedRoute>
        }>
          <Route index element={<SelectInterview />} />
          <Route path='start-practice' element={<StartInterview />} />
        </Route>

        <Route path='/pricing' element={<PricingLayout />}>
          <Route index element={<Plan />} />
          <Route path='pay' element={<Payment />} />
        </Route>

        <Route path='/auth' element={<Authentication />} />
      </Routes>
    </>
  )
}

export default App;