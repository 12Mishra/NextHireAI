"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { getSignedURL } from "@/actions/upload/upload";
import { toast } from "react-toastify";
import { pdfParser } from "@/actions/parsing/pdfparser";

export default function CVInsight() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showButton, setShowButton] = useState(false);


  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/login");
    }
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
      setShowButton(true);
    } finally {
      setLoading(false);
    }
  }

  async function handleParsing(){
    const pdfResponse=await pdfParser();
    console.log(pdfResponse);
    
  }

  return (
    <div className="min-h-screen bg-black p-8 mt-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black/60 p-8 rounded-lg shadow-lg border border-purple-500/20 backdrop-blur-md">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            CV Insight Analysis
          </h1>

          <form onSubmit={handleFileUpload} className="space-y-6">
            <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-8 text-center">
              <input
                type="file"
                id="cv-file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
              <label htmlFor="cv-file" className="cursor-pointer block">
                <div className="space-y-4">
                  <div className="text-purple-200">
                    {file ? (
                      <span>Selected: {file.name}</span>
                    ) : (
                      <>
                        <p className="text-lg">
                          Drop your CV here or click to upload
                        </p>
                        <p className="text-sm text-purple-300">
                          Supports only PDF files
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full py-3 rounded-lg transition-colors duration-200 
                ${
                  loading || !file
                    ? "bg-purple-600/50 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } 
                text-white`}
            >
              {loading ? "Analyzing..." : "Upload CV"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {response && (
            <div className="mt-8 p-6 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">
                Analysis Result
              </h2>
              <div className="text-purple-200 whitespace-pre-wrap">
                {response}
              </div>
            </div>
          )}
          {showButton && (
              <button onClick={handleParsing} className="mt-2 rounded-md bg-purple-600 hover:bg-purple-700 px-2 py-2">Start Analysis</button>
          )}
        </div>
      </div>
    </div>
  );
}
