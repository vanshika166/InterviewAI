import React, { useState } from "react";
import axios from "axios";
import { serverURL } from "../../../App.jsx";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

const Payment = () => {
  const [method, setMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const dispatch = useDispatch();

  // Form states
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upi, setUpi] = useState("");

  const location = useLocation();
  const plan = location.state;

  // Safety check
  if (!plan) {
    return <div className="text-center mt-10">Invalid access</div>;
  }

  // Validation
  const isFormValid = () => {
    if (method === "card") {
      return (
        cardNumber.trim().length >= 12 &&
        expiry.trim().length >= 4 &&
        cvv.trim().length === 3
      );
    }
    if (method === "upi") {
      return upi.includes("@");
    }
    return false;
  };

  const handlePay = () => {
    if (!isFormValid()) return;
    processPayment();
  };

  const processPayment = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverURL}/api/payment/pay`,
        { amount: plan.amount },
        { withCredentials: true }
      );

      if (result.data.success) {
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.log(`process payment error: ${error}`);
      setStatus("failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FBFDFE] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border border-gray-100">

        {/* 🧾 Plan */}
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          Pay ₹{plan.amount}
        </h2>
        <p className="text-sm text-gray-500 mb-2">
          {plan.name} Plan
        </p>

        {/* ⚠️ Warning */}
        {!status && (
          <p className="text-xs text-orange-500 mb-6">
            ⚠️ This is a demo payment. Do not enter real card or UPI details.
          </p>
        )}

        {/* ✅ Success */}
        {status === "success" && (
          <div className="text-center">
            <h3 className="text-[#2EBDDB] text-xl font-bold mb-2">
              Payment Successful ✅
            </h3>
            <p className="text-sm text-gray-500">
              Plan Activated Successfully
            </p>
          </div>
        )}

        {/* ❌ Failed */}
        {status === "failed" && (
          <div className="text-center">
            <h3 className="text-red-500 text-xl font-bold mb-2">
              Payment Failed ❌
            </h3>
            <button
              onClick={() => setStatus(null)}
              className="mt-3 bg-[#2EBDDB] text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        )}

        {!status && (
          <>
            {/* 💳 Method */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setMethod("card")}
                className={`flex-1 py-2 rounded-lg font-medium border ${
                  method === "card"
                    ? "bg-[#2EBDDB] text-white border-[#2EBDDB]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                Card
              </button>
              <button
                onClick={() => setMethod("upi")}
                className={`flex-1 py-2 rounded-lg font-medium border ${
                  method === "upi"
                    ? "bg-[#2EBDDB] text-white border-[#2EBDDB]"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                UPI
              </button>
            </div>

            {/* 💳 Card Form */}
            {method === "card" && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number (dummy)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#2EBDDB] outline-none"
                />
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-1/2 p-2 rounded-lg border border-gray-200 focus:border-[#2EBDDB] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-1/2 p-2 rounded-lg border border-gray-200 focus:border-[#2EBDDB] outline-none"
                  />
                </div>
              </div>
            )}

            {/* 📱 UPI */}
            {method === "upi" && (
              <input
                type="text"
                placeholder="Enter UPI ID (dummy)"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-200 focus:border-[#2EBDDB] outline-none mb-3"
              />
            )}

            {/* 🚀 Pay Button */}
            <button
              onClick={handlePay}
              disabled={!isFormValid() || loading}
              className={`w-full mt-6 py-2 rounded-lg font-semibold ${
                isFormValid()
                  ? "bg-[#2EBDDB] text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : `Pay ₹${plan.amount}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;