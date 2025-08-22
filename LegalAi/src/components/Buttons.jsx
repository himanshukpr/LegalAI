import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaGavel, 
  FaHome, 
  FaFileContract, 
  FaHeartBroken, 
  FaBriefcase, 
  FaBuilding, 
  FaUserInjured, 
  FaCar,
  FaArrowRight,
  FaBalanceScale,
  FaUserMd,
  FaUniversity,
  FaHandshake
} from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md"; // Family icon
import { RiGovernmentLine } from "react-icons/ri"; // Civil Rights icon

const legalServices = [
  { 
    title: "Criminal Law", 
    desc: "Get expert guidance on criminal charges, defense strategies, and your rights in criminal proceedings.", 
    icon: FaGavel // Gavel icon for criminal law
  },
  { 
    title: "Family Law", 
    desc: "Navigate family matters including custody, support, adoption, and domestic relations with legal clarity.", 
    icon: MdFamilyRestroom // Family icon
  },
  { 
    title: "Estate Planning", 
    desc: "Protect your legacy with comprehensive estate planning, wills, trusts, and inheritance strategies.", 
    icon: FaFileContract 
  },
  { 
    title: "Divorce", 
    desc: "Understand divorce procedures, asset division, alimony, and child custody arrangements.", 
    icon: FaHeartBroken 
  },
  { 
    title: "Employment Law", 
    desc: "Know your workplace rights, discrimination issues, wrongful termination, and employment contracts.", 
    icon: FaBriefcase 
  },
  { 
    title: "Landlord & Tenant Law", 
    desc: "Resolve rental disputes, lease agreements, evictions, and tenant rights issues effectively.", 
    icon: FaBuilding 
  },
  { 
    title: "Personal Injury", 
    desc: "Seek compensation for injuries caused by negligence, accidents, and medical malpractice.", 
    icon: FaUserInjured 
  },
  { 
    title: "Car Accident", 
    desc: "Handle auto accident claims, insurance disputes, and liability issues with expert legal advice.", 
    icon: FaCar 
  },
  { 
    title: "Medical Malpractice", 
    desc: "Get legal support for medical errors, patient rights, and healthcare provider negligence.", 
    icon: FaUserMd // Medical doctor icon
  },
  { 
    title: "Civil Rights", 
    desc: "Safeguard your civil liberties against discrimination, police misconduct, and constitutional violations.", 
    icon: RiGovernmentLine // Government/rights icon
  },
  { 
    title: "Business Law", 
    desc: "Expert guidance on business formation, contracts, compliance, and commercial disputes.", 
    icon: FaHandshake // Handshake icon for business
  },
  { 
    title: "Educational Law", 
    desc: "Resolve school-related legal issues, including student rights, discipline, and special education matters.", 
    icon: FaUniversity // University icon
  },
];

const Card = ({ title, desc, mousePos, Icon }) => {
  const divRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [relativePos, setRelativePos] = useState({ x: -9999, y: -9999 });
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate()

  const handleClick = () => {
    console.log(desc)
    navigate("/askai",{state:{description:desc}})
  }

  useEffect(() => {
    if (!divRef.current || mousePos.x === -1) return;
    const rect = divRef.current.getBoundingClientRect();
    const inside =
      mousePos.x >= rect.left &&
      mousePos.x <= rect.right &&
      mousePos.y >= rect.top &&
      mousePos.y <= rect.bottom;

    if (inside) {
      setOpacity(1);
    } else {
      // Even if not inside, allow neighbors to glow faintly
      const margin = 80; // distance in px to trigger neighbor glow
      const nearX = mousePos.x >= rect.left - margin && mousePos.x <= rect.right + margin;
      const nearY = mousePos.y >= rect.top - margin && mousePos.y <= rect.bottom + margin;
      setOpacity(nearX && nearY ? 0.4 : 0); // dimmer glow for neighbors
    }

    setRelativePos({
      x: mousePos.x - rect.left,
      y: mousePos.y - rect.top,
    });
  }, [mousePos]);

  return (
    <div
      ref={divRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative border border-gray-700 bg-gray-800 p-6 flex flex-col justify-between 
                 cursor-pointer select-none transition-all duration-500 ease-in-out hover:bg-gray-700 
                 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:border-gray-600 rounded-xl
                 transform-gpu h-auto align-middle"
    >
      {/* Spotlight border overlay */}
      <div
        style={{
          border: "1px solid rgba(59, 130, 246, 0.8)",
          opacity,
          WebkitMaskImage: `radial-gradient(120px 120px at ${relativePos.x}px ${relativePos.y}px, black 60%, transparent)`,
          maskImage: `radial-gradient(120px 120px at ${relativePos.x}px ${relativePos.y}px, black 60%, transparent)`,
          transition: "opacity 0.3s ease-out",
        }}
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full border bg-transparent rounded-xl"
      />

      <div className=" flex items-center">
        <h2 className="text-xl flex items-center gap-2 font-semibold text-white transition-all duration-300 ease-in-out">
          <Icon /> {title}
        </h2>
        
        
      </div>
    </div>
  );
};

export default function LegalServicesGrid() {
  const [mousePos, setMousePos] = useState({ x: -1, y: -1 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="bg-gray-900 text-white p-6 m-16">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Legal AI Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered legal tools designed to enhance your practice
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {legalServices.map((item, index) => (
            <Card key={index} {...item} mousePos={mousePos} Icon={item.icon} />
          ))}
        </div>
      </div>
    </div>
  );
}
