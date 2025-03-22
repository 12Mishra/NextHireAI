"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getSignedURL } from "@/actions/upload/upload";
import { toast } from "react-toastify";
import { pdfParser } from "@/actions/parsing/pdfparser";
import Modal from "../_components/Modal";
import { motion } from "framer-motion";
import { FiUploadCloud, FiFileText, FiCheck } from "react-icons/fi";

export default function CVInsight() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [startButton, setStartButton] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [viewAnalysis, setViewAnalysis] = useState(false);
  const [dataResponse, setDataResponse] = useState([]);
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) router.push("/auth/login");
  }, []);

  const computeSHA256 = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return hashHex;
  };

  async function handleFileUpload(e) {
    e.preventDefault();
    setLoading(true);

    if (!file) {
      toast.error("Please select a file first!");
      setLoading(false);
      return;
    }
    console.log(file);

    try {
      await toast.promise(
        (async () => {
          try {
            const checksum = await computeSHA256(file);
            const response = await getSignedURL(
              file.type,
              file.size,
              checksum,
              file.name
            );
            console.log(response);

            if (response.failure !== undefined) {
              throw new Error("Could not upload file");
            }

            const { url, id } = response.success;

            const uploadRes = await axios.put(url, file, {
              headers: { "Content-Type": file.type },
            });

            if (uploadRes.status !== 200) {
              throw new Error("Upload failed");
            }

            setEnable(true);
            console.log("File uploaded successfully!");

            return "File uploaded successfully!";
          } catch (error) {
            console.error("Upload failed", error);
            throw new Error("Upload failed. Please try again.");
          }
        })(),
        {
          pending: "Uploading file...",
          success: "File uploaded successfully!",
          error: "Upload failed. Please try again.",
        }
      );
      setStartButton(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleParsing() {
    toast.loading("Processing your resume... ⏳");

    try {
      const pdfResponse = await pdfParser();

      if (pdfResponse.success === 200) {
        toast.dismiss();
        toast.success("Analysis completed!");

        // const data = pdfResponse.body;
        // setDataResponse(data);
        console.log(pdfResponse.geminiResponse.body);
        setDataResponse(pdfResponse.geminiResponse.body);

        setViewAnalysis(true);
        setStartButton(false);
      } else {
        throw new Error("Failed to analyze resume");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Something went wrong! ❌");
      console.error("Error in handleParsing:", error);
    }
  }

  function handleShowModal() {
    setShowModal(true);
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900/20 p-8 pt-20">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-black/40 p-8 rounded-2xl shadow-2xl border border-purple-500/20 backdrop-blur-md"
          variants={fadeInUp}
        >
          <motion.h1
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            CV Insight Analysis
          </motion.h1>

          <form onSubmit={handleFileUpload} className="space-y-6">
            <motion.div
              className="border-2 border-dashed border-purple-500/30 rounded-2xl p-12 text-center transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-500/5"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <input
                type="file"
                id="cv-file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
              <label htmlFor="cv-file" className="cursor-pointer block">
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {file ? (
                    <div className="flex flex-col items-center space-y-4">
                      <FiFileText className="w-12 h-12 text-purple-400" />
                      <span className="text-purple-200 text-lg">
                        Selected: {file.name}
                      </span>
                      <FiCheck className="w-6 h-6 text-green-400" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4">
                      <FiUploadCloud className="w-16 h-16 text-purple-400" />
                      <p className="text-xl text-purple-200">
                        Drop your CV here or click to upload
                      </p>
                      <p className="text-sm text-purple-300/70">
                        Supports only PDF files
                      </p>
                    </div>
                  )}
                </motion.div>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={enable || !file || loading}
              className={`w-full py-4 rounded-xl transition-all duration-300 
                ${
                  loading || !file
                    ? "bg-purple-600/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90"
                } 
                text-white font-semibold text-lg shadow-lg`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <motion.div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <span>Processing...</span>
                </div>
              ) : (
                "Upload CV"
              )}
            </motion.button>
          </form>

          {error && (
            <motion.div
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {response && (
            <motion.div
              className="mt-8 p-6 bg-purple-500/10 border border-purple-500/20 rounded-xl"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                Analysis Result
              </h2>
              <div className="text-purple-200 whitespace-pre-wrap">
                {response}
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 mt-6">
            {startButton && (
              <motion.button
                onClick={handleParsing}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Analysis
              </motion.button>
            )}

            {viewAnalysis && (
              <motion.button
                onClick={handleShowModal}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Analysis
              </motion.button>
            )}
          </div>
          <button
            className="flex-1 rounded-xl bg-purple-500 text-white font-semibold hover:opacity-90 transition-all duration-300 shadow-lg px-2 py-2 "
            onClick={() => {
              router.push("/past-insights");
            }}
          >
            View your past analysis
          </button>
        </motion.div>

        {showModal && (
          <Modal setShowModal={setShowModal} dataResponse={dataResponse} />
        )}
      </motion.div>
    </div>
  );
}
