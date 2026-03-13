import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, Users } from 'lucide-react';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';

export default function LandingPage() {
  return (
    <HeroGeometric
      badge="Georgia Tech PIP Co"
      title1="NIL Athlete"
      title2="Lending Dashboard"
      subtitle="Connecting Georgia Tech athletes with mission-aligned capital through transparent, data-driven lending."
    >
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
      >
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105 hover:brightness-110"
          style={{ backgroundColor: '#EAAA00', color: '#003057' }}
        >
          <BarChart3 className="h-4 w-4" />
          Internal Dashboard
        </Link>
        <Link
          to="/client/1"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold border border-white/20 text-white/80 hover:bg-white/5 transition-all duration-200 hover:scale-105"
        >
          <Users className="h-4 w-4" />
          Client Portal
        </Link>
      </motion.div>
    </HeroGeometric>
  );
}
