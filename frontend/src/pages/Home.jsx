
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Menu,
  X,
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  ShieldCheck,
  Search,
  FileText,
  Target,
  Sparkles,
  Check,
  ChevronRight,
  Zap,
  BarChart3,
  CircleDollarSign,
} from "lucide-react";

import "./Home.css";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    {
      icon: Wallet,
      title: "Effortless Expense Tracking",
      description:
        "Record your daily income and expenses in seconds. Keep every transaction organized in one place.",
      color: "purple",
    },
    {
      icon: Target,
      title: "Smart Budget Planning",
      description:
        "Set monthly budgets for different categories and keep an eye on your spending limits.",
      color: "lime",
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description:
        "Understand your financial habits through interactive charts and easy-to-read insights.",
      color: "blue",
    },
    {
      icon: FileText,
      title: "Detailed Reports",
      description:
        "View monthly and yearly financial reports to understand where your money goes.",
      color: "pink",
    },
    {
      icon: Search,
      title: "Quick Search & Filters",
      description:
        "Find any transaction quickly using keywords, categories, dates, and transaction types.",
      color: "orange",
    },
    {
      icon: ShieldCheck,
      title: "Secure Account",
      description:
        "Your account is protected with password encryption and secure authentication.",
      color: "green",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create your account",
      description:
        "Sign up for free and get your personal financial dashboard.",
    },
    {
      number: "02",
      title: "Track your money",
      description:
        "Add income, expenses, and budgets to organize your finances.",
    },
    {
      number: "03",
      title: "Understand & improve",
      description:
        "Use reports and analytics to make smarter financial decisions.",
    },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="home-page">
      {/* NAVBAR */}
      <nav className="home-navbar">
        <div className="nav-container">
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <span className="brand-icon">
              <Wallet size={21} />
            </span>
            <span>Fin<span className="brand-highlight">Track</span></span>
          </Link>

          <div className="desktop-nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#about">About</a>
          </div>

          {/* Always show Login and Register */}
          <div className="desktop-nav-actions">
            <Link to="/login" className="nav-login">
              Log in
            </Link>

            <Link to="/register" className="nav-signup">
              Get Started <ArrowUpRight size={16} />
            </Link>
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-nav-menu">
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#about" onClick={closeMenu}>About</a>

            <div className="mobile-nav-actions">
              <Link to="/login" className="nav-login" onClick={closeMenu}>
                Log in
              </Link>

              <Link to="/register" className="nav-signup" onClick={closeMenu}>
                Get Started <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-glow hero-glow-one"></div>
        <div className="hero-glow hero-glow-two"></div>

        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={15} />
              <span>YOUR MONEY, YOUR CONTROL</span>
            </div>

            <h1>
              Money moves.
              <br />
              <span>You stay in control.</span>
            </h1>

            <p className="hero-description">
              Take control of your finances with a smarter way to track
              expenses, manage budgets, and understand your spending habits.
              Less money stress. More main-character energy.
            </p>

            <div className="hero-buttons">
              <Link to="/register" className="primary-cta">
                Start for free <ArrowUpRight size={19} />
              </Link>

              <a href="#features" className="secondary-cta">
                Explore features <ArrowRight size={17} />
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-icon">
                <ShieldCheck size={17} />
              </div>
              <span>Simple. Secure. Built for better money habits.</span>
            </div>
          </div>

          {/* DASHBOARD PREVIEW - DEMO ONLY */}
          <div className="hero-visual">
            <div className="floating-label floating-label-top">
              <span className="floating-label-icon">
                <TrendingUp size={17} />
              </span>
              <div>
                <strong>You're doing great!</strong>
                <small>Keep saving consistently</small>
              </div>
            </div>

            <div className="dashboard-preview">
              <div className="preview-header">
                <div>
                  <span className="preview-eyebrow">OVERVIEW</span>
                  <h3>Your finances</h3>
                </div>
                <div className="preview-avatar">FT</div>
              </div>

              <div className="preview-balance">
                <span>Total balance</span>
                <h2>₹48,250.00</h2>
                <div className="preview-positive">
                  <TrendingUp size={14} />
                  <span>You're building good habits</span>
                </div>
              </div>

              <div className="preview-stats">
                <div className="preview-stat">
                  <div className="stat-icon income-icon">
                    <TrendingUp size={17} />
                  </div>
                  <span>Income</span>
                  <strong>₹65,000</strong>
                </div>

                <div className="preview-stat">
                  <div className="stat-icon expense-icon">
                    <TrendingDown size={17} />
                  </div>
                  <span>Expenses</span>
                  <strong>₹16,750</strong>
                </div>
              </div>

              <div className="preview-chart">
                <div className="preview-chart-heading">
                  <strong>Spending overview</strong>
                  <span>Last 6 months</span>
                </div>

                <div className="preview-bars">
                  {[42, 65, 48, 82, 58, 72].map((height, index) => (
                    <div className="preview-bar-column" key={index}>
                      <div className="preview-bar-track">
                        <div
                          className={`preview-bar ${
                            index === 3 ? "active-bar" : ""
                          }`}
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>
                      <small>
                        {["May", "Jun", "Jul", "Aug", "Sep", "Oct"][index]}
                      </small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="preview-budget">
                <div className="budget-preview-heading">
                  <span>Monthly budget</span>
                  <strong>68%</strong>
                </div>
                <div className="budget-preview-track">
                  <div className="budget-preview-fill"></div>
                </div>
                <small>You're on track. Keep it up!</small>
              </div>
            </div>

            <div className="floating-label floating-label-bottom">
              <span className="floating-label-icon lime-icon">
                <Target size={17} />
              </span>
              <div>
                <strong>Budget on track</strong>
                <small>68% of your budget used</small>
              </div>
              <Check size={17} className="floating-check" />
            </div>
          </div>
        </div>

        <div className="hero-bottom-text">
          <span>TRACK SMARTER</span>
          <span className="hero-bottom-line"></span>
          <span>SPEND BETTER</span>
          <span className="hero-bottom-line"></span>
          <span>LIVE FREELY</span>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="marquee-section">
        <div className="marquee-track">
          {Array.from({ length: 2 }).map((_, index) => (
            <div className="marquee-content" key={index}>
              <span>TRACK EVERY RUPEE</span>
              <Sparkles size={17} />
              <span>BUILD BETTER HABITS</span>
              <Sparkles size={17} />
              <span>MAKE MONEY MAKE SENSE</span>
              <Sparkles size={17} />
              <span>YOUR FINANCES, YOUR RULES</span>
              <Sparkles size={17} />
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-heading">
            <div className="section-eyebrow">
              <Zap size={15} /> WHAT YOU GET
            </div>

            <h2>
              Everything your money
              <br />
              <span>needs in one place.</span>
            </h2>

            <p>
              All the tools you need to stay organized, spend consciously,
              and make progress towards your financial goals.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  className={`feature-card feature-${feature.color}`}
                  key={feature.title}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="feature-icon">
                    <Icon size={23} />
                  </div>

                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>

                  <div className="feature-card-arrow">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABOUT / WHY FINTRACK */}
      <section className="about-section" id="about">
        <div className="about-container">
          <div className="about-visual">
            <div className="about-orbit orbit-one"></div>
            <div className="about-orbit orbit-two"></div>

            <div className="about-center-icon">
              <CircleDollarSign size={55} />
            </div>

            <div className="about-float-card about-card-one">
              <TrendingUp size={19} />
              <div>
                <strong>Spend smarter</strong>
                <small>Know where it goes</small>
              </div>
            </div>

            <div className="about-float-card about-card-two">
              <PieChart size={19} />
              <div>
                <strong>See the bigger picture</strong>
                <small>Understand your money</small>
              </div>
            </div>

            <div className="about-decoration">✳</div>
          </div>

          <div className="about-content">
            <div className="section-eyebrow">
              <Sparkles size={15} /> WHY FINTRACK?
            </div>

            <h2>
              Your money deserves
              <br />
              <span>better management.</span>
            </h2>

            <p>
              Managing money shouldn't feel complicated. FinTrack brings
              your financial activity together so you can make informed
              decisions without juggling spreadsheets or notes.
            </p>

            <ul className="about-points">
              <li>
                <span><Check size={15} /></span>
                A clear picture of your income and expenses
              </li>
              <li>
                <span><Check size={15} /></span>
                Budgets that help you stay within limits
              </li>
              <li>
                <span><Check size={15} /></span>
                Reports that make your spending easier to understand
              </li>
            </ul>

            <Link to="/register" className="about-cta">
              Let's get started <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-container">
          <div className="section-heading">
            <div className="section-eyebrow">
              <Zap size={15} /> THREE SIMPLE STEPS
            </div>

            <h2>
              Getting started is
              <br />
              <span>easier than you think.</span>
            </h2>

            <p>
              No complicated setup. Just a simple way to take charge of
              your finances.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <div className="step-card" key={step.number}>
                <div className="step-number">{step.number}</div>

                <div className="step-connector">
                  {index !== steps.length - 1 && <ChevronRight size={20} />}
                </div>

                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="final-cta-section">
        <div className="final-cta-glow"></div>

        <div className="final-cta-content">
          <div className="section-eyebrow">
            <Sparkles size={15} /> YOUR FINANCIAL RESET STARTS HERE
          </div>

          <h2>
            Ready to make your
            <br />
            money <span>work for you?</span>
          </h2>

          <p>
            Start tracking today. Build better habits. Feel more confident
            about every financial decision.
          </p>

          <Link to="/register" className="final-cta-button">
            Create your free account <ArrowUpRight size={19} />
          </Link>

          <div className="final-cta-note">
            Already have an account?
            <Link to="/login"> Log in here</Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Link to="/" className="brand-logo">
              <span className="brand-icon">
                <Wallet size={21} />
              </span>
              <span>Fin<span className="brand-highlight">Track</span></span>
            </Link>

            <p>
              Take control of your money.
              <br />
              Make every rupee count.
            </p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Explore</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it works</a>
              <a href="#about">About</a>
            </div>

            <div className="footer-column">
              <h4>Account</h4>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} FinTrack. All rights reserved.</span>
          <span>Made for smarter money habits. ✳</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
