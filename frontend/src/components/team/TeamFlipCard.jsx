import { useState } from 'react';
import { ExternalLink, RotateCw } from 'lucide-react';
import { cn } from '@/utils/cn';

/**
 * Standard official LinkedIn SVG Icon
 */
function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

/**
 * Standard official GitHub SVG Icon
 */
function GitHubIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

/**
 * TeamFlipCard Component
 * 
 * Features:
 * - Front side: Avatar (Pravatar), Name, Designation, and bottom LinkedIn & GitHub profile links.
 * - Back side: Bio, skills badges, and profile links.
 * - Interaction: Flips strictly on click/cursor press (NO hover flip).
 * - Clicking social icons redirects directly without flipping the card.
 */
export function TeamFlipCard({ member }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    }
  };

  const isFaculty = Boolean(
    member.isFaculty ||
    member.role?.toLowerCase().includes('faculty') ||
    member.designation?.toLowerCase().includes('faculty')
  );
  const linkedinLink = member.linkedinUrl || member.social?.linkedin || '#';
  const githubLink = member.githubUrl || member.social?.github || '#';
  const designation = isFaculty ? 'Faculty Coordinator' : (member.designation || member.role || 'Core Team');

  return (
    <div
      className="flip-card group relative h-[380px] w-full cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-2xl"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${member.name}, ${designation}. Click to ${isFlipped ? 'flip back to photo' : 'view bio'}`}
      aria-expanded={isFlipped}
    >
      <div className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
        {/* ================= FRONT SIDE ================= */}
        <div className="flip-card-front rounded-2xl bg-card border border-border/70 shadow-md hover:shadow-gdg-glow hover:border-primary/40 transition-all duration-300 p-5 flex flex-col items-center justify-between overflow-hidden">
          {/* Top Google Colors Gradient Accent Strip */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-gdg" />

          {/* Center Content: Avatar, Name & Designation */}
          <div className="my-auto pt-2 flex flex-col items-center text-center w-full px-1">
            {/* Avatar frame with subtle GDGC gradient ring */}
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#4285F4] via-[#FBBC04] to-[#EA4335] shadow-md group-hover:scale-105 transition-transform duration-300">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover bg-muted border-2 border-background"
                loading="lazy"
              />
            </div>

            {/* Member Name */}
            <h3 className="text-base sm:text-lg font-bold text-foreground mt-3.5 tracking-tight group-hover:text-primary transition-colors w-full truncate px-1">
              {member.name}
            </h3>

            {/* Designation */}
            <p className="text-xs sm:text-sm font-semibold text-primary mt-1 line-clamp-1 w-full px-1">
              {designation}
            </p>
          </div>

          {/* Bottom Social Media Links: LinkedIn only for faculty; LinkedIn & GitHub for others */}
          <div className="w-full pt-3 border-t border-border/40 flex items-center justify-center gap-3">
            {linkedinLink && (
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl bg-muted/60 hover:bg-[#0A66C2] text-muted-foreground hover:text-white transition-all duration-200 border border-border/50 hover:border-[#0A66C2] shadow-sm hover:scale-110 active:scale-95 flex items-center justify-center gap-2",
                  isFaculty ? "px-4 py-2 text-xs font-semibold" : "p-2"
                )}
                aria-label={`${member.name} on LinkedIn`}
                title="LinkedIn Profile"
              >
                <LinkedInIcon className="w-4 h-4 fill-current" />
                {isFaculty && <span>Connect on LinkedIn</span>}
              </a>
            )}
            {!isFaculty && githubLink && (
              <a
                href={githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl bg-muted/60 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black text-muted-foreground transition-all duration-200 border border-border/50 hover:border-foreground/30 shadow-sm hover:scale-110 active:scale-95"
                aria-label={`${member.name} on GitHub`}
                title="GitHub Profile"
              >
                <GitHubIcon className="w-4 h-4 fill-current" />
              </a>
            )}
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div className="flip-card-back rounded-2xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl p-5 flex flex-col justify-between overflow-hidden text-left">
          {/* Top Google Colors Gradient Accent Strip */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-gdg" />

          {/* Header Row with Name & Manual Flip-Back Button */}
          <div className="flex items-start justify-between gap-2 pt-1">
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-foreground text-sm sm:text-base truncate">
                {member.name}
              </h4>
              <p className="text-xs font-semibold text-primary truncate">
                {designation}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(false);
              }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
              aria-label="Flip back to front"
              title="Flip back"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Middle: Faculty Information OR Quote from TY Student */}
          {isFaculty ? (
            <div className="my-auto space-y-2.5 py-1 flex-1 flex flex-col justify-center">
              {member.subheading && (
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                  <p className="text-xs font-semibold text-primary leading-snug">
                    {member.subheading}
                  </p>
                </div>
              )}
              <div className="overflow-y-auto max-h-[180px] pr-1">
                <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </div>
          ) : (
            <div className="my-auto flex flex-col justify-center items-center text-center px-3 py-6">
              <blockquote className="text-sm sm:text-base text-foreground/90 italic font-medium leading-relaxed">
                "{member.quote || ' - '}"
              </blockquote>
              <p className="text-xs text-muted-foreground font-semibold mt-3">
                - {member.name || 'TY Student'}
              </p>
            </div>
          )}

          {isFaculty && linkedinLink && (
            <div className="pt-2.5 border-t border-border/40">
              <a
                href={linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-medium text-xs transition-all duration-200 shadow-sm active:scale-95"
                aria-label={`${member.name} on LinkedIn`}
              >
                <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          )}

          {/* <!-- About section - temporarily commented out per request --> */}
          {/*
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              About
            </span>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/50 pl-2.5 line-clamp-4">
              "{member.bio || 'Passionate student developer contributing to tech innovation and community workshops at GDGC.'}"
            </p>
          </div>
          */}

          {/* <!-- Tech stack display - temporarily commented out per request --> */}
          {/*
          {member.skills && member.skills.length > 0 && (
            <div className="pt-0.5">
              <div className="flex flex-wrap gap-1">
                {member.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
          */}

          {/* <!-- LinkedIn and GitHub links on back - temporarily commented out per request --> */}
          {/*
          <div className="pt-2.5 border-t border-border/40">
            <div className="flex items-center gap-2">
              {linkedinLink && (
                <a
                  href={linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white font-medium text-xs transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  aria-label={`${member.name} on LinkedIn`}
                >
                  <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              )}
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-muted hover:bg-foreground hover:text-background text-foreground transition-all duration-200 border border-border/60 shadow-sm active:scale-95"
                  aria-label={`${member.name} on GitHub`}
                  title="GitHub Profile"
                >
                  <GitHubIcon className="w-3.5 h-3.5 fill-current" />
                </a>
              )}
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  );
}
