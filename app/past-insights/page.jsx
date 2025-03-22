"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "../_components/Modal";
import { motion } from "framer-motion";
import { FiClock, FiFileText, FiArrowRight } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PastInsights() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [dataResponse, setDataResponse] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [fileurl, setFileurl] = useState();
  const [date, setDate] = useState();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) router.push("/auth/login");
  }, []);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get("/api/past-insights");
        console.log("Response:", response.data);

        const responseArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setDataResponse(responseArray);
        console.log(responseArray);
        
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen p-8 pt-20">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-7xl mx-auto"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          Past Resume Insights
        </h1>
        <p className="text-gray-300 text-lg">
          View your previous resume analysis and track your progress
        </p>
      </motion.div>
  
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {dataResponse.length > 0 ? (
          dataResponse.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{ scale: 1.02, translateY: -5 }}
              className="bg-black/40 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden hover:border-purple-500/40 transition-all duration-300 cursor-pointer"
              onClick={() => {
                setSelectedInsight(insight.insights);
                console.log(insight.insights);
                setShowModal(true);
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-purple-500/20 p-3 rounded-lg">
                    <FiFileText className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <FiClock className="w-4 h-4 mr-2" />
                    <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
  
                <h3 className="text-xl font-semibold text-white">
                  Analysis #{index + 1}
                </h3>
  
                {/* Skills Preview */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {insight?.insights?.Skills?.Technical?.slice(0, 3).map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-500/10 rounded-full text-purple-400 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                  {insight?.insights?.Skills?.Technical?.length > 3 && (
                    <span className="px-3 py-1 bg-purple-500/10 rounded-full text-purple-400 text-sm">
                      +{insight?.insights?.Skills?.Technical?.length - 3} more
                    </span>
                  )}
                </div>
  
                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href={insight.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg transition-all duration-300 hover:bg-purple-500/30 hover:text-white border border-purple-400/30 hover:border-purple-400 shadow-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiFileText className="w-5 h-5 mr-2" />
                    <span>View Your File</span>
                  </a>
  
                  <div className="flex items-center justify-start text-purple-400 group cursor-pointer">
                    <span className="text-sm transition-colors duration-300 group-hover:text-white">
                      View Details
                    </span>
                    <FiArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-20"
          >
            <div className="bg-purple-500/10 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <FiFileText className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Past Insights Yet
            </h3>
            <p className="text-gray-400">
              Upload your resume to get your first analysis
            </p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  
    {showModal && <Modal setShowModal={setShowModal} dataResponse={selectedInsight} />}
  </div>
  
  );
}
