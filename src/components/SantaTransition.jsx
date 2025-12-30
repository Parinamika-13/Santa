import { motion, AnimatePresence } from "framer-motion";

export default function SantaTransition({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="cartoon-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "linear-gradient(to bottom, #001f3f, #0074D9)", // Cartoon Night Sky
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* STARS */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1.2 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
              style={{
                position: "absolute",
                top: `${Math.random() * 50}%`,
                left: `${Math.random() * 100}%`,
                fontSize: `${Math.random() * 20 + 10}px`,
                color: "#FFdc00"
              }}
            >
              ★
            </motion.div>
          ))}

          {/* MOON */}
          <div style={{
            position: "absolute",
            top: "10%",
            right: "10%",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: "#FFDC00",
            boxShadow: "0 0 0 10px rgba(255, 220, 0, 0.3)"
          }}></div>

          {/* TEXT */}
          <motion.h1
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            style={{
              fontFamily: "'Mountains of Christmas', cursive",
              fontSize: "5rem",
              color: "white",
              textShadow: "4px 4px 0px #FF4136",
              zIndex: 10,
              textAlign: "center"
            }}
          >
            Entering Room...
          </motion.h1>

          {/* CLOUDS */}
          <Cloud top="20%" left="-10%" duration={15} />
          <Cloud top="50%" left="-20%" duration={20} delay={2} />

          {/* CARTOON SANTA & REINDEER */}
          <div style={{
            position: "absolute",
            top: "50%",
            width: "100%",
            height: "300px",
            overflow: "hidden",
            zIndex: 5
          }}>
            <motion.div
              initial={{ x: "120vw", y: 20 }}
              animate={{ x: "-60vw", y: -20 }}
              transition={{ duration: 5, ease: "linear" }}
              style={{ width: "fit-content", display: "flex", alignItems: "flex-end" }}
            >
              <svg width="600" height="200" viewBox="0 0 600 200" fill="none" overflow="visible">

                {/* REINDEER 1 (Rudolph) */}
                <g transform="translate(0, 50)">
                  <CartoonReindeer color="#Deb887" nose="red" delay={0} />
                </g>

                {/* REINDEER 2 */}
                <g transform="translate(90, 50)">
                  <CartoonReindeer color="#D2691E" nose="black" delay={0.2} />
                </g>

                {/* REINS */}
                <path d="M70,80 L280,75" stroke="#8B4513" strokeWidth="3" />

                {/* SLEIGH */}
                <g transform="translate(280, 20)">
                  {/* Runner */}
                  <path d="M10,120 C10,120 100,130 140,110" stroke="#C0C0C0" strokeWidth="5" strokeLinecap="round" />
                  <path d="M110,115 L115,90" stroke="#C0C0C0" strokeWidth="4" />
                  <path d="M40,118 L45,90" stroke="#C0C0C0" strokeWidth="4" />

                  {/* Body */}
                  <path d="M20,90 C0,90 0,50 40,50 L120,50 C150,50 160,80 150,110 L30,110 Z" fill="#FF4136" stroke="#85144b" strokeWidth="3" />

                  {/* Trim */}
                  <path d="M40,50 L120,50" stroke="#FFDC00" strokeWidth="5" strokeLinecap="round" />

                  {/* SANTA */}
                  <g transform="translate(60, 10)">
                    {/* Body */}
                    <ellipse cx="40" cy="50" rx="30" ry="35" fill="#FF4136" />
                    {/* Belt */}
                    <rect x="15" y="50" width="50" height="10" fill="#111" />
                    <rect x="35" y="48" width="12" height="14" rx="2" stroke="#FFDC00" strokeWidth="2" fill="none" />

                    {/* Beard */}
                    <path d="M20,30 Q40,60 60,30 Z" fill="white" />
                    {/* Face */}
                    <circle cx="40" cy="25" r="15" fill="#FFDC00" /> {/* Skin toneish */}
                    {/* Eyes */}
                    <circle cx="35" cy="22" r="2" fill="black" />
                    <circle cx="45" cy="22" r="2" fill="black" />
                    {/* Hat */}
                    <path d="M20,15 Q40,-10 60,15 Z" fill="#FF4136" />
                    <circle cx="60" cy="15" r="5" fill="white" />
                  </g>

                  {/* GIFT BAG */}
                  <g transform="translate(90, 20)">
                    <path d="M10,50 Q40,10 60,50 Z" fill="#2ECC40" />
                    <rect x="20" y="30" width="10" height="10" fill="#0074D9" transform="rotate(15)" />
                  </g>
                </g>

              </svg>
            </motion.div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartoonReindeer({ color, nose, delay }) {
  return (
    <motion.g
      animate={{ y: [0, -15, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: delay }}
    >
      {/* Legs */}
      <line x1="20" y1="80" x2="15" y2="110" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <line x1="60" y1="80" x2="65" y2="110" stroke={color} strokeWidth="5" strokeLinecap="round" />

      <line x1="20" y1="80" x2="30" y2="105" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <line x1="60" y1="80" x2="50" y2="105" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.8" />

      {/* Body */}
      <ellipse cx="45" cy="70" rx="30" ry="15" fill={color} />
      {/* Tail */}
      <path d="M15,65 L5,60 L15,75 Z" fill="white" />

      {/* Neck & Head */}
      <path d="M65,70 L75,40 L95,60 L70,80 Z" fill={color} />

      {/* Eye */}
      <circle cx="82" cy="55" r="3" fill="white" />
      <circle cx="83" cy="55" r="1.5" fill="black" />

      {/* Nose */}
      <circle cx="95" cy="62" r="5" fill={nose} />

      {/* Antlers */}
      <path d="M78,42 L80,20 M80,30 L85,25" stroke="#5D4037" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
  )
}

function Cloud({ top, left, duration, delay = 0 }) {
  return (
    <motion.div
      initial={{ x: "100vw" }}
      animate={{ x: "-100vw" }}
      transition={{ duration, repeat: Infinity, ease: "linear", delay }}
      style={{
        position: "absolute",
        top,
        left,
        fontSize: "100px",
        color: "rgba(255,255,255,0.8)",
      }}
    >
      ☁️
    </motion.div>
  )
}
