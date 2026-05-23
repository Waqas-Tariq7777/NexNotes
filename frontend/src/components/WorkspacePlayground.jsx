import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Lock, Share2, Folder, FileText, Check, Copy, 
  Fingerprint, Eye, EyeOff, ShieldAlert, Cpu, Heart, CheckCircle2 
} from 'lucide-react';
import GlassCard from './GlassCard';
import { useIsMobile } from '../hooks/useIsMobile';

const mockData = {
  work: {
    name: 'Work & Projects',
    icon: '💼',
    notes: [
      {
        id: 'note-1',
        title: 'NexNote Launch Roadmap',
        excerpt: 'Beta testing, final bug-squashing, and the big glassmorphism landing page deployment plan.',
        content: `<h3>🚀 Launch Roadmap & Deliverables</h3>
<p>Here is the roadmap for the upcoming big release of NexNotes. All teams should align on these items:</p>
<ul>
  <li><strong>Phase 1:</strong> Private Beta testing with 500 hand-picked digital creators. (Status: Completed)</li>
  <li><strong>Phase 2:</strong> Finalize UI responsive layouts and polish glassmorphic styling filters. (Status: In Progress)</li>
  <li><strong>Phase 3:</strong> Deploy serverless edge database synchronization clusters. (Status: In Progress)</li>
  <li><strong>Phase 4:</strong> Launch product on ProductHunt, HackerNews, and social feeds.</li>
</ul>
<p>Let's make this the most visually stunning, ultra-fast note-taking app on the market!</p>`,
        tags: ['roadmap', 'startup', 'v1.0'],
        lastUpdated: '12 mins ago'
      },
      {
        id: 'note-2',
        title: 'Marketing Slogans & Copy',
        excerpt: 'Brainstorming slogans and hero sections for our new launch campaign.',
        content: `<h3>✨ Marketing Copy Ideas</h3>
<p>Goal: Convey extreme speed, premium futuristic style, and effortless user flow.</p>
<p><strong>Primary Slogan:</strong> Capture Ideas at the Speed of Thought.</p>
<p><strong>Secondary Hooks:</strong></p>
<ul>
  <li>Organize your life with glass-pure clarity and zero latency.</li>
  <li>AI-enhanced note-taking built for digital nomads and developers.</li>
  <li>Your mind, amplified. Encrypted end-to-end.</li>
</ul>`,
        tags: ['ideas', 'marketing', 'growth'],
        lastUpdated: '2 hours ago'
      }
    ]
  },
  creative: {
    name: 'Creative Writing',
    icon: '🎨',
    notes: [
      {
        id: 'note-3',
        title: 'Sci-Fi Novel Concept',
        excerpt: 'Story concept about a future where ideas are stored in floating anti-gravity databases.',
        content: `<h3>🪐 Project Antigravity: Outline</h3>
<p>In a distant star cluster powered by stellar light cells, human thoughts are digitized and cataloged in enormous orbital glass rings. The main protagonist discovers a forgotten note sector containing forbidden zero-knowledge archives...</p>
<p><strong>Themes:</strong> Privacy, collective intelligence, antigravity architecture, glowing cyber-cities.</p>`,
        tags: ['novel', 'sci-fi', 'drafts'],
        lastUpdated: 'Yesterday'
      }
    ]
  },
  journal: {
    name: 'Daily Journal',
    icon: '📔',
    notes: [
      {
        id: 'note-4',
        title: 'Morning Reflections',
        excerpt: 'Thoughts on workspace clarity, morning routines, and mental energy levels.',
        content: `<h3>☕ May 22: Clarity of Mind</h3>
<p>Woke up at 6:15 AM. The sky outside had an amazing deep violet and orange horizon. It feels like an incredibly creative morning.</p>
<p>Realized that a cluttered physical and digital workspace leads directly to a cluttered mind. Developing NexNotes to have a sleek, minimal, glass-morphic feel is absolutely the right direction. When your tool looks premium and feels fast, you write with more freedom.</p>`,
        tags: ['personal', 'mindset', 'life'],
        lastUpdated: 'May 22'
      }
    ]
  },
  vault: {
    name: 'Personal Vault',
    icon: '🔒',
    isLocked: true,
    notes: [
      {
        id: 'note-5',
        title: 'Private API Credentials',
        excerpt: 'Development secrets, access keys, and secure wallet backup phrases.',
        content: `<h3>🔑 Development & Wallet Secrets</h3>
<p><strong>ALERT:</strong> Highly confidential. Encrypted client-side prior to sync database distribution.</p>
<p><strong>Production Database Key:</strong> <code>db_edge_live_sec_ff007a7000ff00f2ff</code></p>
<p><strong>Wallet Recovery Phrase (NexWallet):</strong> <code>glass pure spark thought latency speed sync edge crypt vault biometric secure</code></p>`,
        tags: ['secrets', 'admin', 'keys'],
        lastUpdated: 'May 10'
      }
    ]
  }
};

const WorkspacePlayground = () => {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState('work');
  const [activeNoteId, setActiveNoteId] = useState('note-1');
  
  // Vault lock state
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultPasscode, setVaultPasscode] = useState('');
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState('idle'); // 'idle' | 'scanning' | 'success' | 'error'
  
  // AI summarizer state
  const [aiState, setAiState] = useState('idle'); // 'idle' | 'summarizing' | 'done'
  const [aiSummary, setAiSummary] = useState('');
  
  // Sharing mockup state
  const [isCopied, setIsCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Reset states when changing active notes
  useEffect(() => {
    setAiState('idle');
    setAiSummary('');
  }, [activeNoteId]);

  // Set the first note of a category as active when category changes,
  // unless it is the vault and it is locked
  useEffect(() => {
    const categoryNotes = mockData[activeCategory].notes;
    if (activeCategory === 'vault' && !vaultUnlocked) {
      // Keep activeNoteId or don't set to note-5 yet
    } else if (categoryNotes && categoryNotes.length > 0) {
      setActiveNoteId(categoryNotes[0].id);
    }
  }, [activeCategory, vaultUnlocked]);

  // Handle mock biometric scan
  const handleBiometricScan = () => {
    if (biometricScanning) return;
    setBiometricScanning(true);
    setBiometricStatus('scanning');
    
    setTimeout(() => {
      setBiometricStatus('success');
      setTimeout(() => {
        setVaultUnlocked(true);
        setActiveNoteId('note-5');
        setBiometricScanning(false);
        setBiometricStatus('idle');
      }, 800);
    }, 1800);
  };

  // Handle passcode submit
  const handlePasscodeSubmit = (e) => {
    e.preventDefault();
    if (vaultPasscode === '1337' || vaultPasscode === '1234') {
      setVaultUnlocked(true);
      setActiveNoteId('note-5');
      setVaultPasscode('');
    } else {
      setVaultPasscode('');
      setBiometricStatus('error');
      setTimeout(() => setBiometricStatus('idle'), 2000);
    }
  };

  // Simulating AI Spark Summarizer typewriter effect
  const handleAiSummarize = () => {
    if (aiState !== 'idle') return;
    setAiState('summarizing');
    setAiSummary('');

    const fullSummaryText = activeNoteId === 'note-1' 
      ? "AI Spark: The launch roadmap is currently in progress, focusing on completing responsive UI polishing, deploying synchronized serverless edge clusters, and preparing for a public Launch on major tech feeds after private beta wraps up."
      : activeNoteId === 'note-2'
      ? "AI Spark: The brainstorming focuses on copy concepts that highlight three core pillars: extreme performance speeds, premium futuristic design aesthetics (glassmorphism), and zero-knowledge end-to-end security encryption."
      : activeNoteId === 'note-3'
      ? "AI Spark: A sci-fi concept centered on a collective orbital database layer where thoughts are saved into glowing rings, focusing on themes of high privacy, zero-knowledge archives, and anti-gravity city layouts."
      : activeNoteId === 'note-4'
      ? "AI Spark: Reflection on daily routines, outlining how a fast, responsive, and beautifully clean glassmorphic digital environment boosts user focus, creativity, and writing productivity."
      : "AI Spark: Decrypted production credential variables including database API endpoints and a 12-word seed backup key, secure client-side only.";

    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < fullSummaryText.length - 1) {
        setAiSummary((prev) => prev + fullSummaryText[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
        setAiState('done');
      }
    }, 15);
  };

  // Simulate copying link
  const handleCopyLink = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Retrieve currently active note object
  const getActiveNote = () => {
    if (activeCategory === 'vault' && !vaultUnlocked) {
      return null;
    }
    const allNotes = Object.values(mockData).flatMap(cat => cat.notes);
    return allNotes.find(note => note.id === activeNoteId) || mockData.work.notes[0];
  };

  const currentNote = getActiveNote();

  return (
    <section id="demo" className="py-24 relative overflow-hidden bg-background/30 border-y border-soft-white/5">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4"
          >
            <Cpu size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
            <span>INTERACTIVE WORKSPACE DEMO</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-soft-white mb-6"
          >
            Experience the Future of <br />
            <span className="text-gradient">Idea Management</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-gray text-lg max-w-2xl mx-auto"
          >
            Click, explore, and interact with this live mock-workspace to see how NexNotes simplifies your productive workflow.
          </motion.p>
        </div>

        {/* Dashboard Shell Wrapper */}
        <motion.div 
          initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 40 }}
          whileInView={isMobile ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={isMobile ? { duration: 0.4 } : { duration: 0.8, type: "spring", stiffness: 50 }}
          className="glass-card p-0 md:p-1 overflow-hidden border border-soft-white/10 shadow-2xl shadow-black/60 rounded-3xl"
        >
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-soft-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-500/80" />
              <div className="w-3.5 h-3.5 rounded-full bg-green-500/80" />
            </div>
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold px-4 py-1.5 rounded-xl bg-soft-white/5 border border-soft-white/10 text-muted-gray">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Workspace: NexNotes Cloud Sync (Live)</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <Share2 size={13} />
                <span>Share</span>
              </button>
            </div>
          </div>

          {/* Main 3-Column Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
            
            {/* COLUMN 1: Categories Sidebar (3 Cols) */}
            <div className="lg:col-span-3 border-r border-soft-white/5 bg-black/10 p-5 flex flex-col gap-2">
              <span className="text-[11px] font-bold tracking-wider text-muted-gray mb-3 px-3">CATEGORIES</span>
              
              <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
                {Object.entries(mockData).map(([key, value]) => {
                  const isActive = activeCategory === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`relative flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-left text-sm font-semibold transition-all whitespace-nowrap cursor-pointer z-10 ${
                        isActive ? 'text-primary' : 'text-muted-gray hover:text-soft-white hover:bg-soft-white/5'
                      }`}
                    >
                      {isActive && (
                        <motion.div 
                          {...(!isMobile ? { layoutId: "activeCategoryPill" } : {})}
                          className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-2xl -z-10"
                          transition={isMobile ? { duration: 0.1 } : { type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <span className="text-lg leading-none">{value.icon}</span>
                      <span>{value.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Secure Status Badge */}
              <div className="mt-auto hidden lg:flex flex-col gap-3 p-4 rounded-2xl bg-soft-white/5 border border-soft-white/5">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="text-primary" size={16} />
                  <span className="text-xs font-bold text-soft-white">Client Encrypted</span>
                </div>
                <p className="text-[10px] text-muted-gray leading-normal">
                  All data is locked in sandbox storage using secure local AES-256 protocols before cloud sync occurs.
                </p>
              </div>
            </div>

            {/* COLUMN 2: Notes List (3 Cols) */}
            <div className="lg:col-span-3 border-r border-soft-white/5 bg-black/5 p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold tracking-wider text-muted-gray">NOTES</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-soft-white/5 border border-soft-white/5 text-muted-gray">
                  {mockData[activeCategory].notes.length} items
                </span>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] lg:max-h-[500px]">
                {activeCategory === 'vault' && !vaultUnlocked ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-soft-white/10 rounded-2xl bg-black/10">
                    <Lock className="text-muted-gray mb-2 animate-bounce" size={24} />
                    <p className="text-xs font-bold text-soft-white mb-1">Locked Folder</p>
                    <p className="text-[10px] text-muted-gray">Unlock Personal Vault in editor</p>
                  </div>
                ) : (
                  mockData[activeCategory].notes.map((note) => {
                    const isActive = activeNoteId === note.id;
                    return (
                      <button
                        key={note.id}
                        onClick={() => setActiveNoteId(note.id)}
                        className={`flex flex-col gap-2 p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-soft-white/10 border-primary/30 shadow-[0_0_20px_rgba(0,242,255,0.05)]' 
                            : 'bg-black/20 hover:bg-black/35 border-soft-white/5'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-sm font-bold truncate pr-2 ${isActive ? 'text-primary' : 'text-soft-white'}`}>
                            {note.title}
                          </span>
                          <span className="text-[9px] text-muted-gray shrink-0 font-medium">
                            {note.lastUpdated}
                          </span>
                        </div>
                        <p className="text-xs text-muted-gray line-clamp-2 leading-relaxed">
                          {note.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {note.tags.map(tag => (
                            <span key={tag} className="text-[9px] font-semibold text-primary/75 px-1.5 py-0.5 rounded bg-primary/5 border border-primary/10">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 3: Rich Editor Viewport (6 Cols) */}
            <div className="lg:col-span-6 p-6 flex flex-col relative bg-black/2">
              
              {/* Conditional Vault Security Lock Screen */}
              {activeCategory === 'vault' && !vaultUnlocked ? (
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-8">
                  <div className="max-w-sm w-full flex flex-col items-center">
                    {/* Ring Animated Lock Emblem */}
                    <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border border-primary/20 border-dashed rounded-full"
                      />
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-2 bg-primary/5 rounded-full border border-primary/30 flex items-center justify-center shadow-[0_0_30px_rgba(0,242,255,0.15)]"
                      />
                      <Lock className="text-primary relative z-10" size={32} />
                    </div>

                    <h3 className="text-2xl font-extrabold text-soft-white mb-2">Zero-Knowledge Vault</h3>
                    <p className="text-xs text-muted-gray text-center mb-8 leading-relaxed">
                      This directory is encrypted locally. Authenticate using your device biometric scan or security PIN to decrypt these nodes.
                    </p>

                    {/* Biometric Sim Fingerprint Trigger */}
                    <button
                      onClick={handleBiometricScan}
                      disabled={biometricScanning}
                      className={`relative flex items-center gap-3 px-6 py-3.5 rounded-2xl w-full justify-center font-bold text-sm border shadow-lg cursor-pointer transition-all duration-300 ${
                        biometricStatus === 'scanning'
                          ? 'bg-primary/5 border-primary/30 text-primary'
                          : biometricStatus === 'success'
                          ? 'bg-green-500/20 border-green-500/40 text-green-400'
                          : 'bg-soft-white/5 border-soft-white/10 hover:bg-soft-white/10 text-soft-white'
                      }`}
                    >
                      {biometricScanning && (
                        <motion.div 
                          className="absolute left-0 right-0 top-0 h-0.5 bg-primary/60 shadow-[0_0_8px_rgba(0,242,255,1)]"
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      )}
                      
                      {biometricStatus === 'scanning' ? (
                        <>
                          <Fingerprint className="animate-pulse" size={18} />
                          <span>Scanning Biometrics...</span>
                        </>
                      ) : biometricStatus === 'success' ? (
                        <>
                          <Check className="scale-125" size={18} />
                          <span>Decrypted Successfully!</span>
                        </>
                      ) : (
                        <>
                          <Fingerprint className="text-primary shrink-0" size={18} />
                          <span>Simulate Biometric Scan</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3 w-full my-4">
                      <div className="h-[1px] bg-soft-white/15 flex-1" />
                      <span className="text-[10px] font-bold text-muted-gray">OR ENTER PIN</span>
                      <div className="h-[1px] bg-soft-white/15 flex-1" />
                    </div>

                    {/* Pin Input Form */}
                    <form onSubmit={handlePasscodeSubmit} className="flex gap-2 w-full">
                      <input 
                        type="password"
                        placeholder="Try entering '1337'..."
                        value={vaultPasscode}
                        onChange={(e) => setVaultPasscode(e.target.value)}
                        maxLength={6}
                        className="flex-grow px-4 py-3 bg-black/40 border border-soft-white/10 focus:border-primary/40 rounded-xl text-center text-sm font-bold text-soft-white tracking-widest"
                      />
                      <button 
                        type="submit" 
                        className="px-4 py-3 bg-primary hover:bg-primary/95 text-black font-extrabold text-xs rounded-xl transition-all cursor-pointer active:scale-95 shrink-0"
                      >
                        Unlock
                      </button>
                    </form>

                    {biometricStatus === 'error' && (
                      <p className="text-[11px] text-red-400 font-semibold mt-3 text-center flex items-center gap-1.5">
                        <ShieldAlert size={14} />
                        <span>Invalid passcode pattern. Try '1337'.</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Editor Workspace Content */}
              {currentNote && (
                <div className="flex flex-col h-full z-10">
                  {/* Floating Action Bar */}
                  <div className="flex items-center justify-between pb-4 border-b border-soft-white/5 mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="text-primary" size={16} />
                      <span className="text-xs font-bold text-soft-white truncate max-w-[200px]">
                        {currentNote.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Spark Summarizer */}
                      <button 
                        onClick={handleAiSummarize}
                        disabled={aiState === 'summarizing'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all duration-300 cursor-pointer ${
                          aiState === 'summarizing'
                            ? 'bg-secondary/20 border-secondary/40 text-secondary'
                            : aiState === 'done'
                            ? 'bg-green-500/10 border-green-500/30 text-green-400'
                            : 'bg-secondary/15 border-secondary/20 hover:bg-secondary/25 hover:border-secondary/40 text-secondary'
                        }`}
                      >
                        <Sparkles size={12} className={aiState === 'summarizing' ? 'animate-spin' : ''} />
                        <span>{aiState === 'summarizing' ? 'Analyzing...' : aiState === 'done' ? 'AI Refined' : 'AI Summary'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Core Editor Simulator Content */}
                  <div className="flex-grow overflow-y-auto mb-6 text-soft-white leading-relaxed text-sm select-text">
                    <div 
                      dangerouslySetInnerHTML={{ __html: currentNote.content }}
                      className="prose prose-invert max-w-none text-theme-secondary prose-sm prose-ul:list-disc prose-li:my-1"
                    />
                  </div>

                  {/* AI Spark Summary Box Output Panel */}
                  <AnimatePresence>
                    {aiState !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.98 }}
                        className="p-5 rounded-2xl bg-secondary/10 border border-secondary/20 backdrop-blur-md relative overflow-hidden shadow-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-secondary">
                            <Sparkles className="animate-bounce" size={13} />
                            <span>COGNITIVE SPARK SUMMARY</span>
                          </div>
                          
                          {aiState === 'summarizing' && (
                            <span className="inline-flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-gray leading-relaxed font-mono">
                          {aiSummary}
                          {aiState === 'summarizing' && (
                            <motion.span 
                              animate={{ opacity: [1, 0, 1] }} 
                              transition={{ repeat: Infinity, duration: 0.8 }}
                              className="inline-block w-1.5 h-3.5 bg-secondary ml-0.5 align-middle"
                            />
                          )}
                        </p>
                        
                        {/* Background subtle neon glow */}
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-secondary/15 rounded-full blur-2xl pointer-events-none" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sharing Mock Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-card max-w-md w-full border border-soft-white/10 p-8 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-extrabold text-soft-white mb-2">Share & Collaborate</h3>
              <p className="text-xs text-muted-gray mb-6 leading-relaxed">
                Generate a live encrypted link to work on <span className="text-primary">"{currentNote?.title}"</span> simultaneously with other creators.
              </p>

              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  readOnly 
                  value={`https://nexnotes.app/share/enc-${currentNote?.id}`}
                  className="flex-grow px-3 py-3 bg-black/40 border border-soft-white/10 rounded-xl text-xs text-muted-gray focus:outline-none"
                />
                
                <button 
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-primary hover:bg-primary/95 text-black font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-muted-gray uppercase tracking-wider">Active Collaborators</span>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-background" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <img className="w-8 h-8 rounded-full border-2 border-background" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="avatar" />
                    <div className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center text-[10px] font-bold text-soft-white">
                      +3
                    </div>
                  </div>
                  <span className="text-xs text-muted-gray font-medium">5 team members currently sync-connected</span>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 text-muted-gray hover:text-soft-white text-xl font-bold cursor-pointer transition-colors"
              >
                &times;
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default WorkspacePlayground;
