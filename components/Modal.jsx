import React from "react";

const Modal = ({ dataResponse, setShowModal }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative w-full max-w-4xl h-[80vh] rounded-xl bg-[#1a1a1a] border border-purple-500/20 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-purple-500/20">
          <h3 className="text-xl font-semibold text-white">Your Resume Analysis</h3>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto h-[calc(80vh-80px)]">
          <SkillsSection skills={dataResponse?.Skills} />

          <MissingSkillsSection missingSkills={dataResponse?.Missing_Skills} />

          <CareerRoadmapSection careerRoadmap={dataResponse?.Career_Roadmap} />

          <IndustryTrendsSection industryTrends={dataResponse?.Industry_Trends} />
        </div>
      </div>
    </div>
  );
};

const SkillsSection = ({ skills }) => (
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-purple-400 mb-4">Skills</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SkillCategory title="Technical Skills" skills={skills?.Technical} />
      <SkillCategory title="Soft Skills" skills={skills?.Soft} />
    </div>
  </div>
);

const SkillCategory = ({ title, skills }) => (
  <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
    <h5 className="text-white font-medium mb-3">{title}</h5>
    <div className="grid grid-cols-2 gap-2">
      {skills?.map((skill, index) => (
        <div key={index} className="text-gray-300">
          • {skill}
        </div>
      ))}
    </div>
  </div>
);

const MissingSkillsSection = ({ missingSkills }) => (
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-red-400 mb-4">Missing Skills</h4>
    <div className="space-y-3">
      {missingSkills?.map((missingSkill, index) => (
        <div key={index} className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <h5 className="text-white font-medium">{missingSkill.Skill}</h5>
          <p className="text-gray-300 text-sm">{missingSkill.Why_It_Matters}</p>
        </div>
      ))}
    </div>
  </div>
);

const CareerRoadmapSection = ({ careerRoadmap }) => (
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-green-400 mb-4">Career Roadmap</h4>
    <div className="space-y-6">
      {careerRoadmap?.map((role, index) => (
        <div key={index} className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
          <h5 className="text-white font-medium mb-3">{role.Role}</h5>
          <div className="space-y-3 mb-4">
            <h6 className="text-green-400">Learning Path</h6>
            <div className="pl-4 space-y-2">
              {role?.Learning_Path?.map((stage, stageIndex) => (
                <div key={stageIndex} className="text-gray-300">
                  • <span className="font-semibold">{stage.Stage}:</span> {stage.Focus}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h6 className="text-green-400 mb-2">Recommended Projects</h6>
            <div className="pl-4">
              {role?.Recommended_Projects?.map((project, projIndex) => (
                <div key={projIndex} className="text-gray-300">
                  • {project}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const IndustryTrendsSection = ({ industryTrends }) => (
  <div>
    <h4 className="text-lg font-semibold text-blue-400 mb-4">Industry Trends</h4>
    <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
      <ul className="space-y-3 list-disc list-inside text-gray-300">
        {industryTrends?.map((trend, index) => (
          <li key={index}>{trend}</li>
        ))}
      </ul>
    </div>
  </div>
);

export default Modal;