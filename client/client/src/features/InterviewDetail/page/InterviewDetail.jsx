import QuestionCard from '../components/QuestionCard.jsx';
import PerformaceAnalytics from '../components/PerformaceAnalytics.jsx';
import OverAllPerformace from '../components/OverAllPerformace.jsx';
import MainHeaderCard from '../components/MainHeaderCard.jsx';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverURL } from '../../../App.jsx';
import { useParams } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";

const InterviewDetail = () => {
  const { id } = useParams();

  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    if (!id) return;
    const interviewReport = async () => {
      try {
        setLoading(true);

        const result = await axios.post(
          `${serverURL}/api/interview/interview-data`,
          { id },
          { withCredentials: true }
        );

        const data = result.data?.data || result.data;
        setInterviewData(data);
      } catch (error) {
        console.log("❌ interview report error:", error);
      } finally {
        setLoading(false);
      }
    };

    interviewReport();
  }, [id]);

  const headerData = {
    mode: interviewData?.mode,
    finalScore: interviewData?.finalScore,
    totalQuestions: interviewData?.questions?.length || 0
  };

  const getAvg = (key) => {
    if (!interviewData?.questions?.length) return 0;
    return Math.floor(
      (interviewData.questions.reduce((a, b) => a + b[key], 0) /
        interviewData.questions.length /
        10) *
      100
    );
  };

  const performaceAnalytics = {
    confidence: getAvg('confidence'),
    correctness: getAvg('correctness'),
    communication: getAvg('communication')
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // 📅 Date
    const today = new Date(interviewData?.createdAt);
    const formattedDate = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // 🟡 Title
    doc.setFontSize(20);
    doc.setTextColor(15, 15, 15);
    doc.text("AI Interview Report", 14, 20);

    // 📅 Date top right
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Date: ${formattedDate}`, 150, 20);

    // 🟢 Basic Info
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text(`Mode: ${interviewData?.mode || "-"}`, 14, 32);
    doc.text(`Final Score: ${interviewData?.finalScore || "-"}`, 14, 38);
    doc.text(
      `Total Questions: ${interviewData?.questions?.length || 0}`,
      14,
      44
    );

    // 🔵 Table data
    const tableData = interviewData?.questions?.map((q, index) => [
      index + 1,
      q.question,
      `${q.correctness}/10`,
      `${q.communication}/10`,
      `${q.confidence}/10`,
    ]);

    // 📊 Table
    autoTable(doc, {
      startY: 52,
      head: [["#", "Question", "Correctness", "Communication", "Confidence"]],
      body: tableData,
      styles: {
        fontSize: 8,
        cellPadding: 2,
        valign: "middle",
      },
      headStyles: {
        fillColor: [253, 199, 0],
        textColor: 0,
        halign: "center",
      },
      columnStyles: {
        1: { cellWidth: 80 }, // question column wider
      },
    });

    // 📍 Get last Y position (important)
    const finalY = doc.lastAutoTable.finalY + 10;

    // 🧠 Overall Performance Paragraph
    let performanceText = "";

    const score = interviewData?.finalScore || 0;

    if (score >= 80) {
      performanceText =
        "Excellent performance. You demonstrated strong technical knowledge, clear communication, and high confidence throughout the interview.";
    } else if (score >= 60) {
      performanceText =
        "Good performance overall. You have a solid understanding but there is room to improve clarity and consistency in your responses.";
    } else if (score >= 40) {
      performanceText =
        "Average performance. You need to work on strengthening your concepts and improving communication for better interview outcomes.";
    } else {
      performanceText =
        "Needs improvement. Focus on fundamentals, practice regularly, and work on structured communication to perform better in interviews.";
    }

    // 📝 Heading
    doc.setFontSize(14);
    doc.setTextColor(15);
    doc.text("Overall Performance", 14, finalY);

    // 📄 Paragraph (auto wrap)
    doc.setFontSize(10);
    doc.setTextColor(60);

    const splitText = doc.splitTextToSize(performanceText, 180);
    doc.text(splitText, 14, finalY + 6);

    // 📥 Save
    doc.save("interview-report.pdf");
  };

  return (
    <div className="min-h-screen w-full text-black p-4 flex justify-center">
      <div className="w-full space-y-8">

        {/* HEADER */}
        <div className="">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2EBDDB]">
                Interview Report
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Detailed performance analysis & insights
              </p>
            </div>

            {/* BUTTON (no logic) */}
            <button
              onClick={() => downloadPDF()}
              className="px-4 py-2 bg-[#FDC700] hover:bg-[#fdc806] rounded-xl font-semibold hover:opacity-90 transition">
              Download Report
            </button>
          </div>
        </div>

        <div className='space-y-6  p-4'>

          {/* 🔹 REPORT HEADER */}
          <div className="border-b border-[#2EBDDB]/20 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#2EBDDB]">
                AI Interview Performance Report
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Comprehensive evaluation of your interview session
              </p>
            </div>

            <div className="text-sm text-gray-500 bg-white/50 rounded-lg p-3 backdrop-blur-sm">
              <p><span className="font-semibold text-black">Date:</span> 17 April 2026</p>
              <p><span className="font-semibold text-black">Report Type:</span> Detailed Analysis</p>
            </div>

          </div>

          {/* HEADER CARD */}
          <div className="bg-white  p-6">
            <MainHeaderCard data={headerData} />
          </div>

          {/* ANALYTICS */}
          <div className="bg-white  p-6 ">

            <PerformaceAnalytics data={performaceAnalytics} />
          </div>

          {/* QUESTIONS */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 ">
            <h2 className="text-lg font-semibold mb-6 text-[#2EBDDB]">
              Questions Asked ({interviewData?.questions?.length || 0})
            </h2>

            {loading ? (
              <p className="text-gray-500">Loading questions...</p>
            ) : interviewData?.questions?.length > 0 ? (
              <div className="space-y-5">
                {interviewData.questions.map((question, index) => (
                  <div
                    key={question._id || index}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50/50"
                  >
                    <QuestionCard
                      question={question}
                      index={index + 1}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No questions found</p>
            )}
          </div>

          {/* OVERALL */}
          <OverAllPerformace data={interviewData?.finalScore} />
        </div>



      </div>
    </div>
  );
};

export default InterviewDetail;