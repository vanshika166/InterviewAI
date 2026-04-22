import React, { useEffect, useState } from 'react';
import { IoReturnDownBackOutline } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';



const Plan = () => {
    const navigate = useNavigate()
    const [selectedPlan, setselectedPlan] = useState("pro")
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
    }, [])


    console.log(selectedPlan)

    let plans = [
        {
            "id": "Basic",
            "name": "Starter",
            "price": 99,
            "credits": 10,
            "tag": "basic",
            "description": "Ideal for new users starting out",
            "features": [
                "10 Interview sessions",
                "Basic Feedback",
                "Limited Questions"
            ],
            "buttonText": "Start Basic",
            "type": "basic"
        },
        {
            "id": "pro",
            "name": "Professional",
            "price": 299,
            "credits": 40,
            "tag": "Most Popular",
            "description": "For consistent interview practice",
            "features": [
                "40 Interview sessions",
                "Detailed Reports",
                "AI Feedback",
                "Performance Analytics"
            ],
            "buttonText": "Buy Now",
            "type": "highlight"
        },
        {
            "id": "premium",
            "name": "Genius",
            "price": 599,
            "credits": 100,
            "tag": "Advanced",
            "description": "Advanced level preparation",
            "features": [
                "100 Interview sessions",
                "Advanced Insights",
                "Priority Support",
                "Deep Analytics"
            ],
            "buttonText": "Go Premium",
            "type": "premium"
        }
    ]


    return (
        <div className="min-h-screen flex flex-col items-center px-4 py-16">

            {/* HEADER */}
            <div className="text-center relative ma w-full x-w-2xl mx-auto">

                <h1 className="text-3xl font-Montserrat sm:text-4xl font-semibold text-gray-800 leading-tight">
                    Choose the <span className="text-[#2EBDDB]">perfect plan</span> for your
                    <br /> interview preparation
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                    Start free and upgrade as you improve your skills
                </p>

            </div>

            {/* BIG CONTAINER */}
            <div className="mt-12 w-full max-w-5xl bg-[#2EBDDB]/10 rounded-[28px] p-6 sm:p-8">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {plans.map((plan, index) => {
                        const isPro = plan.id === "pro"; // ✅ BEST PRACTICE

                        return (
                            <div
                                onClick={() => setselectedPlan(plan.id)}
                                key={index}
                                className={`
  ${isPro ? "bg-[#2EBDDB]" : "bg-white"}
  ${selectedPlan === plan.id ? "scale-105 ring-1 ring-[#2EBDDB]" : "hover:scale-105"}
  transition-all duration-300 rounded-2xl p-6 flex flex-col justify-between border border-[#2EBDDB]/10 shadow-sm hover:shadow-md
`}
                            >
                                <div>
                                    <h3
                                        className={`text-sm font-medium ${isPro ? "text-white/90" : "text-gray-700"
                                            }`}
                                    >
                                        {plan.name}
                                    </h3>

                                    <div className="mt-4 flex items-end gap-1">
                                        <span
                                            className={`text-3xl font-semibold ${isPro ? "text-white" : "text-gray-900"
                                                }`}
                                        >
                                            ₹{plan.price}
                                        </span>
                                        <span
                                            className={`text-sm ${isPro ? "text-white/80" : "text-gray-500"
                                                }`}
                                        >
                                            /{plan.tag}
                                        </span>
                                    </div>

                                    <p
                                        className={`text-xs mt-2 ${isPro ? "text-white/80" : "text-gray-500"
                                            }`}
                                    >
                                        {plan.description}
                                    </p>

                                    <ul
                                        className={`mt-5 space-y-3 text-sm ${isPro ? "text-white/90" : "text-gray-600"
                                            }`}
                                    >
                                        {plan.features.map((f, i) => (
                                            <li key={i}>✔ {f}</li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => navigate("/pricing/pay",{state:{name:plan.id,amount:plan.price}})}
                                    className={`mt-6 py-2.5 rounded-lg text-sm font-medium transition ${isPro
                                        ? "bg-white text-[#2EBDDB]"
                                        : "border border-[#2EBDDB]/30 text-[#2EBDDB] bg-[#2EBDDB]/5 hover:bg-[#2EBDDB]/10"
                                        }`}
                                >
                                    {plan.buttonText} →
                                </button>
                            </div>
                        );
                    })}

                </div>
            </div>

            {/* FOOTNOTE */}
            <p className="text-xs text-gray-400 mt-6">
                50 Credit = 1 Interview Session
            </p>

        </div >
    );
};

export default Plan;