import {
    Home,
    Shield,
    Heart,
    Users,
    Globe,
    MessageCircle,
    CheckCircle,
    ArrowRightIcon,
} from "lucide-react";

import { Link } from "react-router-dom";
import heroImage from "../assets/img/hero_meditation.webp";

const LandingPage = () => {
    const features = [
        {
            icon: <Shield color="#4A90E2" size={48} />,
            title: "Confidential Support",
            description:
                "Your privacy is our top priority. All interactions are completely confidential and secured with advanced encryption protocols.",
        },
        {
            icon: <Heart color="#FF6B6B" size={48} />,
            title: "Personalized Care",
            description:
                "Tailored mental health resources and support matching your unique emotional landscape and personal journey.",
        },
        {
            icon: <Users color="#4ECDC4" size={48} />,
            title: "Community Connection",
            description:
                "Connect with supportive peers who understand your experiences, creating a safe and empathetic network.",
        },
        {
            icon: <Globe color="#9C27B0" size={48} />,
            title: "Global Accessibility",
            description:
                "Professional mental health support available 24/7 from anywhere in the world, breaking geographical barriers.",
        },
        {
            icon: <MessageCircle color="#FFC107" size={48} />,
            title: "Expert Counseling",
            description:
                "Access licensed therapists and counselors specializing in various mental health domains and therapeutic approaches.",
        },
        {
            icon: <CheckCircle color="#2ECC71" size={48} />,
            title: "Holistic Wellness",
            description:
                "Comprehensive approach integrating mental, emotional, and psychological well-being through innovative digital solutions.",
        },
    ];

    const teamMembers = [
        {
            name: "Haroon Nisar",
            usn: "4NI22CS024",
            image: "/",
        },
    ];

    return (
        <div className="apoyo-landing-page">
            <section className="hero-section">
                <div className="hero-image">
                    <img src={heroImage} />
                </div>
                <div className="hero-content">
                    <h1 className="gradient-text">
                        Apoyo
                        <br />
                        <small>For Every Mind; Every Moment</small>
                    </h1>
                    <p className="hero-subtitle">
                        Transforming mental health support through
                        compassionate, innovative, and accessible digital
                        solutions.
                    </p>
                    <Link to={"/dashboard"}>
                        <button className="cta-button">
                            Start Your Journey <ArrowRightIcon />
                        </button>
                    </Link>
                </div>
            </section>

            <section className="why-us-section">
                <div className="why-us-grid">
                    <div className="why-us-item">
                        <Home className="icon blue" />
                        <h3>Safe Space</h3>
                        <p>
                            Create a judgment-free environment for emotional
                            exploration and healing.
                        </p>
                    </div>
                    <div className="why-us-item">
                        <Shield className="icon green" />
                        <h3>Privacy First</h3>
                        <p>
                            Rigorous data protection ensuring your personal
                            information remains completely confidential.
                        </p>
                    </div>
                    <div className="why-us-item">
                        <Heart className="icon red" />
                        <h3>Compassionate Care</h3>
                        <p>
                            Empathetic support tailored to individual emotional
                            needs and personal growth journeys.
                        </p>
                    </div>
                </div>
            </section>

            <section className="features-section">
                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="feature-icon">{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="team-section">
                <br />
                <h2 className="section-title gradient-text">The Team</h2>

                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-member">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="team-image"
                            />
                            <h3>{member.name}</h3>
                            <p>USN: {member.usn}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
