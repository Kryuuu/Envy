"use client";

import { motion } from "framer-motion";

const skills = [
  { 
    name: "After Effects", 
    type: "adobe",
    symbol: "Ae", 
    brandColor: "#D291FF",
    textColor: "text-[#D291FF]", 
    borderColor: "group-hover:border-[#D291FF]", 
    bgColor: "bg-[#00005B]" 
  },
  { 
    name: "Photoshop", 
    type: "adobe",
    symbol: "Ps", 
    brandColor: "#31A8FF",
    textColor: "text-[#31A8FF]", 
    borderColor: "group-hover:border-[#31A8FF]", 
    bgColor: "bg-[#001E36]" 
  },
  { 
    name: "CapCut", 
    type: "capcut",
    brandColor: "#FFFFFF",
    textColor: "text-white",
  },
  { 
    name: "Canva", 
    type: "canva",
    brandColor: "#00C4CC",
    textColor: "text-[#00C4CC]",
  },
  { 
    name: "Next.js", 
    type: "next",
    brandColor: "#ffffff",
    textColor: "text-white",
  },
  { 
    name: "React", 
    type: "react",
    brandColor: "#61DAFB",
    textColor: "text-[#61DAFB]",
  },
  { 
    name: "PHP", 
    type: "php",
    brandColor: "#777BB4",
    textColor: "text-[#777BB4]",
  },
  { 
    name: "HTML", 
    type: "html",
    brandColor: "#E34F26",
    textColor: "text-[#E34F26]",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-background relative overflow-hidden">
       {/* Decorative background with pulse */}
       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-pulse" />
       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] animate-pulse delay-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Software Proficiency</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Powered by industry-standard tools.</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 justify-center">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col items-center justify-center p-4 transition-all duration-500 hover:-translate-y-2"
              style={{
                '--brand-color': skill.brandColor,
              } as React.CSSProperties} 
            >
              
              <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500">
                  {/* Glow Behind Logo */}
                  <div 
                    className="absolute inset-0 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500 bg-[var(--brand-color)] -z-10 scale-150" 
                  />

                  {skill.type === "adobe" ? (
                    <div className={`w-24 h-24 flex items-center justify-center rounded-2xl shadow-lg ${skill.bgColor}`}>
                      <span className={`text-4xl font-bold ${skill.textColor}`}>{skill.symbol}</span>
                    </div>
                  ) : skill.type === "capcut" ? (
                     <div className="w-24 h-24 rounded-2xl bg-black flex items-center justify-center relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 to-purple-500 opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <svg viewBox="0 0 48 48" className="w-14 h-14 text-white fill-current z-10">
                           <path d="M14 14L22 24L14 34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                           <path d="M34 14L26 24L34 34" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                           <path d="M22 10H26" stroke="white" strokeWidth="4" strokeLinecap="round" />
                           <path d="M22 38H26" stroke="white" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                     </div>
                  ) : skill.type === "canva" ? (
                     <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#00C4CC] to-[#7D2AE8] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(0,196,204,0.4)] transition-shadow">
                        <svg viewBox="0 0 24 24" className="w-14 h-14 text-white fill-current">
                           <path d="M16.1 14.8c-1.3 0-2.4-.6-3-1.7-.5-1-1.3-1.7-2.3-1.7-.9 0-1.6.6-1.9 1.5-.4 1.2-1.6 2-2.9 2-2.1 0-3.6-1.8-3-4 .5-1.9 2.5-3.1 4.5-2.7 1.2.2 2.1 1.1 2.4 2.3.2.9.9 1.5 1.8 1.5 1 0 1.8-.7 2-1.7.3-1.6 1.8-2.7 3.4-2.4 1.6.3 2.7 1.8 2.4 3.4-.3 1.9-2.2 3.5-3.4 3.5zM7.5 11.5c-.6 0-1 .5-1.1 1.1-.1.4.1.9.5 1.1.4.2.8.2 1.2.1.6-.2 1-.7 1.1-1.3.1-.6-.2-1-.7-1zm8.5 0c-.6 0-1 .5-1.1 1.1-.1.6.3 1.1.9 1.2.6.1 1.1-.3 1.2-.9.1-.6-.4-1.1-1-1.4z" />
                           <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" opacity="0.5"/>
                        </svg>
                     </div>
                  ) : skill.type === "next" ? (
                    <div className="w-24 h-24 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg group-hover:shadow-white/20 transition-shadow">
                       <svg viewBox="0 0 180 180" className="w-14 h-14 fill-white">
                         <mask height="180" id="mask0_408_134" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
                           <circle cx="90" cy="90" fill="#000" r="90"></circle>
                         </mask>
                         <g mask="url(#mask0_408_134)">
                           <circle cx="90" cy="90" data-circle="true" fill="#000" r="90"></circle>
                           <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="url(#paint0_linear_408_134)"></path>
                           <rect fill="url(#paint1_linear_408_134)" height="72" width="12" x="115" y="54"></rect>
                         </g>
                         <defs>
                           <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_408_134" x1="109" x2="144.5" y1="116.5" y2="160.5">
                             <stop stopColor="#fff"></stop>
                             <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                           </linearGradient>
                           <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_408_134" x1="121" x2="120.799" y1="54" y2="106.875">
                             <stop stopColor="#fff"></stop>
                             <stop offset="1" stopColor="#fff" stopOpacity="0"></stop>
                           </linearGradient>
                         </defs>
                       </svg>
                    </div>
                  ) : skill.type === "react" ? (
                     <div className="group-hover:animate-spin-slow transition-all">
                        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(97,218,251,0.5)]">
                          <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
                          <g stroke="#61dafb" strokeWidth="1" fill="none">
                            <ellipse rx="11" ry="4.2"/>
                            <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                            <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
                          </g>
                        </svg>
                     </div>
                  ) : skill.type === "php" ? (
                      <div className="w-24 h-24 flex items-center justify-center bg-[#777BB4] rounded-full shadow-lg group-hover:shadow-[0_0_20px_rgba(119,123,180,0.5)] transition-shadow">
                        <span className="text-white font-bold text-3xl">php</span>
                      </div>
                  ) : skill.type === "html" ? (
                     <div className="filter drop-shadow-[0_0_10px_rgba(227,79,38,0.3)] group-hover:drop-shadow-[0_0_20px_rgba(227,79,38,0.6)] transition-all">
                       <svg viewBox="0 0 512 512" className="w-24 h-24 text-[#E34F26] fill-current">
                         <path d="M71,460L30,0h452l-41,460L256,512L71,460z" fill="currentColor"/>
                         <path d="M256,472l149-41L435,31H77l30,400L256,472z" fill="#EBEBEB"/>
                         <path d="M256,211h94l-5,55h-89v52h83l-8,90l-75,21l-75-21l-5-57h46l2,21l32,9l32-9l3-33H166l-9-106H256z" fill="#E34F26"/>
                       </svg>
                     </div>
                  ) : null}
              </div>
              
              <h3 className="mt-6 text-lg font-semibold text-gray-300 group-hover:text-white transition-colors">{skill.name}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
