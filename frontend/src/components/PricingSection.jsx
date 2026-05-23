import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import GlassCard from './GlassCard';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for capturing quick thoughts and personal brainstorming.',
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      'Up to 10 active notebook logs',
      'Local-only client-side AES-256 database',
      'Standard tag groupings and organization',
      'Manual JSON export backup backups',
      'Single device client active session'
    ],
    cta: 'Get Started Free',
    isPro: false,
    accent: 'var(--color-primary)'
  },
  {
    name: 'Pro',
    description: 'Our most popular plan. For advanced creators demanding ultimate speed.',
    priceMonthly: 8,
    priceYearly: 6.40,
    features: [
      'Unlimited notes & smart folder nests',
      'Instant cloud Edge Sync to all devices',
      'Zero-Knowledge Biometric Vault lockers',
      '✨ AI Spark Summarizer (Unlimited requests)',
      'Shared collaborative nodes & 5 live members',
      'Priority offline backup synchronization'
    ],
    cta: 'Upgrade to Pro',
    isPro: true,
    accent: 'var(--color-secondary)'
  },
  {
    name: 'Enterprise',
    description: 'Custom security controls, audit logs, and scale for larger teams.',
    priceMonthly: 29,
    priceYearly: 23.20,
    features: [
      'Everything in Pro tier features',
      'SAML SSO & advanced identity federation',
      'Workspace audit logs & compliance tools',
      'Dedicated Customer Success Architect',
      'Infinite team members & global collaboration',
      'Custom API endpoints & webhooks'
    ],
    cta: 'Contact Sales',
    isPro: false,
    accent: 'var(--color-accent)'
  }
];

const faqs = [
  {
    question: 'How does client-side zero-knowledge encryption work?',
    answer: 'Before your notes leave your browser, they are encrypted with a private key derived from your passphrase. Our servers only receive and store unreadable cipher text. We never have access to your key or your original data—meaning your privacy is structurally absolute.'
  },
  {
    question: 'Can I access my notes offline on multiple devices?',
    answer: 'Absolutely. NexNotes utilizes offline-first service cache engines. You can create, edit, and organize notes without an active internet connection. As soon as you go online, our lightning-fast global edge sync resolves differences and merges updates seamlessly.'
  },
  {
    question: 'What is the "AI Spark Summarizer" and is it safe to use?',
    answer: 'The AI Spark Summarizer is our local-and-cloud intelligence co-pilot. It instantly processes notes to build outlines, summaries, or smart tag assignments. For Pro members, we use custom private API endpoints that guarantee your processed note snippets are never used to train external LLMs.'
  },
  {
    question: 'Can I import notes from Evernote, Notion, or Obsidian?',
    answer: 'Yes! We support direct imports for standard Markdown (.md) folders, Rich Text Format, Evernote ENEX, and standard JSON bundles. You can migrate your entire workspace over with a single click in the settings dashboard.'
  }
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-soft-white mb-6"
          >
            Transparent Plans, <br />
            <span className="text-gradient">Infinite Possibility</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-gray text-lg max-w-2xl mx-auto mb-10"
          >
            Choose the workspace tier that fits your creative pace. Save 20% by purchasing yearly subscription terms.
          </motion.p>

          {/* Billing Sliding Switch Toggle */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-1 p-1 rounded-2xl bg-soft-white/5 border border-soft-white/10"
          >
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly' ? 'text-black' : 'text-muted-gray hover:text-soft-white'
              }`}
            >
              {billingCycle === 'monthly' && (
                <motion.div 
                  layoutId="billingTogglePill"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span>Monthly</span>
            </button>

            <button
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-6 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'text-black' : 'text-muted-gray hover:text-soft-white'
              }`}
            >
              {billingCycle === 'yearly' && (
                <motion.div 
                  layoutId="billingTogglePill"
                  className="absolute inset-0 bg-primary rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}
              <span>Yearly</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/20 text-black font-extrabold uppercase tracking-wide">
                -20%
              </span>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-28">
          {plans.map((plan, index) => {
            const price = billingCycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;
            
            return (
              <GlassCard
                key={plan.name}
                delay={index * 0.1}
                hover={!plan.isPro} // Don't use normal glasscard hover if using our specialized RGB hover
                className={`flex flex-col relative h-full transition-all duration-500 overflow-hidden ${
                  plan.isPro 
                    ? 'rgb-border p-[30px] rounded-3xl scale-[1.03] lg:scale-[1.05] z-10 shadow-[0_0_40px_rgba(112,0,255,0.15)]' 
                    : 'bg-black/10'
                }`}
              >
                {/* Pro Spotlight Badge */}
                {plan.isPro && (
                  <div className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-soft-white text-[9px] font-black uppercase tracking-wider shadow-lg shadow-secondary/20">
                    <Sparkles size={10} className="animate-pulse" />
                    <span>RECOMMENDED</span>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-soft-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-muted-gray leading-relaxed min-h-[40px]">{plan.description}</p>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-1.5 mb-8 border-b border-soft-white/5 pb-8">
                  <span className="text-5xl font-black text-soft-white leading-none">
                    ${price.toFixed(2).split('.')[0]}
                  </span>
                  <span className="text-xl font-bold text-soft-white">
                    .{price.toFixed(2).split('.')[1]}
                  </span>
                  <span className="text-xs font-semibold text-muted-gray ml-1">
                    / member / month
                  </span>
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-4 mb-10 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className="p-0.5 rounded-full bg-soft-white/10 shrink-0 mt-0.5 border border-soft-white/10">
                        <Check size={12} style={{ color: plan.accent }} className="stroke-[3]" />
                      </div>
                      <span className="text-theme-secondary leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Action Button */}
                <button
                  className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                    plan.isPro
                      ? 'btn-primary text-black hover:shadow-[0_0_35px_rgba(0,242,255,0.4)]'
                      : 'bg-soft-white/10 hover:bg-soft-white/20 text-soft-white border border-soft-white/10 hover:border-soft-white/25'
                  }`}
                >
                  <span>{plan.cta}</span>
                </button>
              </GlassCard>
            );
          })}
        </div>

        {/* FAQs Sub-Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2.5 mb-12">
            <HelpCircle className="text-primary shrink-0" size={24} />
            <h3 className="text-3xl font-extrabold text-soft-white text-center">Frequently Asked Questions</h3>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index}
                  className="rounded-2xl bg-soft-white/3 border border-soft-white/10 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left font-bold text-sm md:text-base text-soft-white hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="text-muted-gray shrink-0 ml-4"
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 pb-6 pt-1 text-xs md:text-sm text-muted-gray leading-relaxed border-t border-soft-white/5 bg-black/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default PricingSection;
