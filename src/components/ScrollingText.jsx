import { motion } from "motion/react";

export function ScrollingText() {
    const text = "AI CORE MATCHING • CAREER TRAJECTORY ANALYSIS • SKILL GAP OPTIMIZATION • ";

    return (
        <div style={{
            background: 'var(--accent)',
            padding: '10px 0',
            overflow: 'hidden',
            borderTop: '1px solid rgba(0,0,0,0.1)',
            borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
            <motion.div
                animate={{ x: [0, -1000] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ display: 'flex', whiteSpace: 'nowrap' }}
            >
                {[...Array(6)].map((_, i) => (
                    <span key={i} style={{
                        color: '#000',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '13px',
                        letterSpacing: '0.1em',
                        padding: '0 16px'
                    }}>
                        {text}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
