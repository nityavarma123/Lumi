import React, { useEffect } from 'react';
import { useTheme } from '../layout/theme-toggle';

const SunIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" /><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
);

const MoonIcon = (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
);

const LogoIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 30 30" fill="none" stroke="#EAC996" strokeWidth="1.5">
        <circle cx="15" cy="15" r="5" />
        <path d="M15 2v3M15 25v3M2 15h3M25 15h3M6 6l2 2M22 22l2 2M24 6l-2 2M8 22l-2 2" strokeLinecap="round" />
    </svg>
);

const FeatureRow = ({ number, title, description, tags, delay }) => (
    <div
        className="reveal border-t border-current/10 py-8 grid grid-cols-[40px_1fr] gap-x-4 items-start group hover:bg-current/[0.02] px-2 transition-all"
        style={{ transitionDelay: `${delay}ms` }}
    >
        <span className="font-outfit text-[10px] opacity-20 mt-1.5">{number}</span>
        <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-playfair text-2xl italic opacity-90 tracking-tight">{title}</h3>
                <div className="hidden sm:flex gap-1.5">
                    {tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-full border border-current/10 text-[8px] uppercase tracking-widest opacity-30">{tag}</span>
                    ))}
                </div>
            </div>
            <p className="text-[14px] opacity-40 leading-snug font-light max-w-[95%] font-outfit">{description}</p>
        </div>
    </div>
);

export default function Landing() {
    const { isDark, toggle } = useTheme();

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div className="relative z-10">
            {/* Navigation */}
            <nav className="relative z-50 flex justify-between items-center px-8 md:px-16 py-8">
                <div className="flex items-center gap-3 cursor-pointer">
                    <LogoIcon />
                    <span className="font-playfair text-2xl italic text-[#EAC996] tracking-tight">lumi</span>
                </div>
                <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.25em] opacity-30">
                    <a href="#features" className="hover:opacity-100 transition-colors">Features</a>
                    <a href="#about" className="hover:opacity-100 transition-colors">Philosophy</a>
                    <a href="#" className="hover:opacity-100 transition-colors">Students</a>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={toggle} className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-all ${isDark ? "border-white/10 text-white/40 hover:text-white" : "border-black/10 text-black/40 hover:text-black"
                        }`}>
                        {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
                    </button>
                    <button className="text-[11px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-colors">Log in</button>
                    <button className={`px-7 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-[#EAC996] text-black shadow-lg shadow-[#EAC996]/10' : 'bg-black text-white shadow-xl shadow-black/10'
                        }`}>
                        Get started
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="reveal active relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-40">
                <p className="text-[10px] tracking-[0.4em] uppercase opacity-30 mb-10">
                    A wellness companion for college life
                </p>
                <h1 className="font-playfair text-6xl md:text-[100px] leading-[0.95] tracking-tighter max-w-5xl">
                    the friend who <br /> keeps you <span className="italic text-[#EAC996] font-normal">together.</span>
                </h1>
                <p className="mt-12 text-base md:text-lg opacity-30 max-w-xl font-light leading-relaxed font-outfit">
                    Sleep, study, eat, move — Lumi tracks everything quietly <br className="hidden md:block" />
                    and checks in like a friend who actually pays attention.
                </p>
                <div className="mt-12 flex items-center gap-5">
                    <button className={`px-10 py-4 rounded-full font-bold text-sm tracking-widest transition-all ${isDark ? 'bg-[#EAC996] text-black shadow-lg' : 'bg-black text-white'
                        }`}>
                        Start free →
                    </button>
                    <button className="px-10 py-4 rounded-full text-sm font-medium border border-current/10 opacity-40 hover:opacity-100 transition-all">
                        How it works
                    </button>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="relative z-10 px-8 md:px-24 py-24 border-t border-current/5">
                <div className="reveal flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <h2 className="font-playfair text-5xl md:text-7xl leading-[0.85] tracking-tighter">
                        six things <br />
                        <span className="italic text-[#EAC996] tracking-tight">lumi</span> does.
                    </h2>
                    <p className="text-[11px] opacity-30 max-w-[240px] leading-relaxed font-light italic font-outfit">
                        "Most apps track you. Lumi thinks about you."
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-2">
                    <FeatureRow delay={100} number="01" title="Study tracking" description="Pomodoro sessions and focus analytics that notice when you're in flow." tags={['Focus']} />
                    <FeatureRow delay={200} number="02" title="Sleep insights" description="Bedtimes that actually fit your lecture schedule. No wearables required." tags={['Recovery']} />
                    <FeatureRow delay={300} number="03" title="Nutrition log" description="Macro awareness without obsession. Gentle hydration reminders." tags={['Meals']} />
                    <FeatureRow delay={400} number="04" title="Activity goals" description="Personalized movement built around your life. A campus walk counts." tags={['Movement']} />
                    <FeatureRow delay={500} number="05" title="Smart schedule" description="Lumi sees the gaps in your classes and fills them with what you need." tags={['Planner']} />
                    <FeatureRow delay={600} number="06" title="Lumi AI" description="A friend who reads your data and sends one useful thing at the right time." tags={['Insights']} />
                </div>
            </section>

            {/* Philosophy Section */}
            <section id="about" className="relative z-10 px-8 md:px-24 py-32 grid grid-cols-1 md:grid-cols-2 gap-24 items-center border-t border-current/5">
                <div className="reveal">
                    <span className="text-[10px] tracking-[0.4em] uppercase opacity-20 mb-8 block font-outfit">The Philosophy</span>
                    <h2 className="font-playfair text-5xl md:text-6xl leading-[0.95] mb-10 tracking-tight">
                        like a friend, <br /> not an <br /> <span className="italic text-[#EAC996] font-normal">algorithm.</span>
                    </h2>
                    <p className="text-[16px] opacity-40 font-light leading-relaxed max-w-sm font-outfit">
                        Lumi never says "your metrics are suboptimal." She says "hey, you haven't eaten since noon — maybe grab something?"
                    </p>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Morning', text: '"Morning. You slept 6h — a bit short. You\'ve got DSA at 9. Maybe grab breakfast?"' },
                        { label: 'Motivation', text: '"You\'ve hit 1 of 3 goals this week. That\'s okay — let\'s just do 30 minutes tonight."' },
                        { label: 'Progress', text: '"10 days of logging sleep in a row. You\'re doing it!"' }
                    ].map((item, i) => (
                        <div key={i} className="reveal border border-current/10 p-6 rounded-xl hover:bg-current/[0.02] transition-all" style={{ transitionDelay: `${i * 150}ms` }}>
                            <span className="text-[8px] uppercase tracking-widest text-[#EAC996] opacity-60 mb-2 block font-bold font-outfit">{item.label}</span>
                            <p className="text-[14px] italic opacity-60 leading-relaxed font-outfit">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-32 flex flex-col items-center text-center">
                <div className="reveal">
                    <h2 className="font-playfair text-5xl md:text-6xl leading-none mb-12 tracking-tighter">
                        ready to meet your <span className="italic text-[#EAC996] font-normal">lumi?</span>
                    </h2>

                    <div className="flex flex-col md:flex-row gap-5 mb-32 justify-center">
                        <button className={`px-14 py-4 rounded-full font-bold text-sm tracking-widest uppercase transition-all ${isDark ? 'bg-[#EAC996] text-black shadow-lg shadow-[#EAC996]/10' : 'bg-black text-white shadow-xl'
                            }`}>
                            Get started free
                        </button>
                        <button className="px-14 py-4 rounded-full text-sm font-medium tracking-widest uppercase border border-current/10 opacity-30 hover:opacity-100 transition-all">
                            Log in
                        </button>
                    </div>

                    <div className="flex flex-col items-center pt-20 border-t border-current/5 w-screen max-w-4xl opacity-50">
                        <h3 className="font-playfair text-2xl italic text-[#EAC996]/40 mb-10">lumi</h3>
                        <div className="flex gap-10 text-[9px] uppercase tracking-[0.4em] opacity-20 mb-10">
                            <a href="#" className="hover:opacity-100 transition-colors">Instagram</a>
                            <a href="#" className="hover:opacity-100 transition-colors">Privacy</a>
                            <a href="#" className="hover:opacity-100 transition-colors">Terms</a>
                        </div>
                        <p className="text-[9px] uppercase tracking-[0.2em] opacity-10 font-outfit">© 2026 Lumi. Built for students.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}