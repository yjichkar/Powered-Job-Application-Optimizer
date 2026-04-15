import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

// Unified accent color for all cards
const accentColors = [
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
    { main: "#BFFF0A", glow: "rgba(191,255,10,0.35)", tint: "rgba(191,255,10,0.12)" },
];

export function ServiceCard({ icon: Icon, title, description, index, link }) {
    const accent = accentColors[index % accentColors.length];

    return (
        <Link to={link} className="service-card-link" style={{ "--accent": accent.main, "--accent-glow": accent.glow, "--accent-tint": accent.tint, "--card-index": index }}>
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="service-card"
            >
                {/* Gradient border overlay */}
                <div className="service-card__border" />

                {/* Card inner content */}
                <div className="service-card__inner">
                    {/* Icon container */}
                    <div className="service-card__icon-wrap">
                        <div className="service-card__icon-glow" />
                        <Icon className="service-card__icon" style={{ color: accent.main }} strokeWidth={1.8} />
                    </div>

                    {/* Title */}
                    <h3 className="service-card__title">{title}</h3>

                    {/* Description */}
                    <p className="service-card__desc">{description}</p>

                    {/* Hover arrow CTA */}
                    <div className="service-card__arrow">
                        <span>Explore</span>
                        <ArrowRight size={16} />
                    </div>
                </div>

                {/* Bottom glow line */}
                <div className="service-card__bottom-glow" />
            </motion.div>
        </Link>
    );
}
