
import React from 'react';
import { Link } from 'react-router-dom';

const Rules: React.FC = () => {
  const ruleCategories = [
    {
      title: "General Platform Rules",
      icon: "fa-shield-halved",
      color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400",
      rules: [
        "Players must join the lobby at least 10 minutes before the match start time.",
        "Room codes will be visible in the 'Matches' tab 5 minutes before the start.",
        "Any form of cheating or using third-party software will result in a permanent ban.",
        "Sharing your account or room code with non-participants is strictly prohibited."
      ]
    },
    {
      title: "Ludo King Gameplay",
      icon: "fa-dice",
      color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400",
      rules: [
        "Matches are played on the 'Ludo King' mobile application.",
        "Ensure you have the latest version of Ludo King installed.",
        "In 1vs1 matches, the first player to reach home wins.",
        "In 4-player matches, rankings are determined by the order players reach home."
      ]
    },
    {
      title: "Winning & Proofs",
      icon: "fa-crown",
      color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400",
      rules: [
        "Winners must take a clear screenshot of the final winning screen.",
        "The screenshot must clearly show the room code and winner's name.",
        "Submit the result proof within 15 minutes of match completion.",
        "Fake results or false proof submission will lead to account suspension."
      ]
    }
  ];

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-5 mb-10 px-2">
        <Link to="/" className="w-12 h-12 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-slate-800 dark:text-white shadow-md border border-slate-100 dark:border-slate-800 active:scale-90 transition-all">
          <i className="fa-solid fa-arrow-left text-lg"></i>
        </Link>
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Arena Rules</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em]">Fair Play & Guidelines</p>
        </div>
      </div>

      <div className="space-y-8">
        {ruleCategories.map((cat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-md border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white dark:border-slate-700 ${cat.color}`}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <h3 className="font-black text-slate-800 dark:text-white uppercase text-sm tracking-widest">{cat.title}</h3>
            </div>
            <ul className="space-y-4">
              {cat.rules.map((rule, rIdx) => (
                <li key={rIdx} className="flex gap-4 items-start">
                  <span className="text-amber-400 font-black text-xl leading-none mt-1">•</span>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{rule}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-slate-900 dark:bg-slate-900 rounded-[3rem] p-10 text-center shadow-2xl border border-amber-500/10">
        <p className="text-amber-400 font-black text-xs uppercase tracking-[0.3em] mb-3">Need help?</p>
        <p className="text-white text-sm font-bold leading-relaxed mb-8 opacity-80">Our support team is available 24/7 for any disputes or match issues.</p>
        <button className="bg-white dark:bg-slate-100 text-slate-900 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Rules;
