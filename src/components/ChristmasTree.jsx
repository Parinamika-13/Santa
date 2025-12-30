import React from 'react';
import { motion } from 'framer-motion';

export default function ChristmasTree() {
    return (
        <div className="vintage-tree-container" style={{ position: 'fixed', bottom: 0, right: '5%', zIndex: 0, pointerEvents: 'none' }}>
            <svg width="300" height="400" viewBox="0 0 200 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Shadow */}
                <ellipse cx="100" cy="280" rx="60" ry="10" fill="rgba(0,0,0,0.5)" filter="blur(5px)" />

                {/* Trunk */}
                <rect x="90" y="250" width="20" height="40" fill="#3e2723" />

                {/* Leaves - Layered for depth */}
                {/* Bottom Layer */}
                <motion.path
                    d="M20,260 L100,160 L180,260 Q100,270 20,260 Z"
                    fill="#1b5e20"
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                />
                {/* Middle Layer */}
                <motion.path
                    d="M35,190 L100,100 L165,190 Q100,200 35,190 Z"
                    fill="#2e7d32"
                    initial={{ scale: 0.95 }} animate={{ scale: 1.05 }} transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse" }}
                />
                {/* Top Layer */}
                <motion.path
                    d="M50,120 L100,40 L150,120 Q100,130 50,120 Z"
                    fill="#4caf50"
                    initial={{ scale: 0.98 }} animate={{ scale: 1.02 }} transition={{ duration: 1.8, repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Star */}
                <motion.path
                    d="M100,20 L110,40 L135,40 L115,55 L125,80 L100,65 L75,80 L85,55 L65,40 L90,40 Z"
                    fill="#ffd700"
                    filter="drop-shadow(0 0 10px gold)"
                    animate={{ opacity: [0.8, 1, 0.8], scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Ornaments */}
                <circle cx="70" cy="240" r="6" fill="#c62828" />
                <circle cx="130" cy="230" r="6" fill="#fdd835" />
                <circle cx="100" cy="210" r="6" fill="#1565c0" />

                <circle cx="80" cy="170" r="5" fill="#fdd835" />
                <circle cx="120" cy="160" r="5" fill="#c62828" />

                <circle cx="100" cy="100" r="4" fill="#ff6f00" />
            </svg>
        </div>
    );
}
