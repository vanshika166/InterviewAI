import React from "react";
import { TiMicrophoneOutline } from "react-icons/ti";
import { FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { FiGithub } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#2EBDDB] mt-20 text-white">

      <div className="max-w-6xl mx-auto px-6 py-14">

        {/* Top */}
        <div className="flex flex-col md:flex-row justify-between gap-10">

          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <TiMicrophoneOutline className="text-[#2EBDDB] text-2xl" />
              </div>

              <h2 className="text-xl font-semibold tracking-tight">
                InterviewAI
              </h2>
            </div>

            <p className="text-sm text-white/90 leading-relaxed">
              Practice interviews with AI, get instant feedback, and improve
              your confidence with every session.
            </p>
          </div>

          {/* Minimal Info */}
          <div className="flex flex-col gap-3 text-sm text-white/80">
            <p>Built for students & developers</p>
            <p>Focused on real interview scenarios</p>
            <p>Continuous improvement with AI insights</p>
          </div>

          {/* Social */}
          <div className="flex gap-3 items-start md:items-center">
            {[{name:FaTwitter,src:"https://x.com/vanshika1344732"}, {name:FaLinkedinIn,src:"https://www.linkedin.com/in/vanshika-kashyap/"}, {name:FiGithub,src:"https://github.com/vanshika166"}].map((Icon, i) => (
              <a
              href={Icon.src}
              target="blank"
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-full 
                bg-white/20 text-white hover:bg-white hover:text-[#2EBDDB]
                transition-all duration-300 cursor-pointer"
              >
                <Icon.name />
              </a>
            ))}
          </div>

        </div>

        {/* Divider */}
        <div className="my-10 h-[1px] bg-white/30"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-white/70 gap-3">
          <p>© 2026 InterviewAI</p>

          <p className="text-center text-white/80">
            Designed to help you grow, not just practice.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;