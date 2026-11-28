'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Layout ────────────────────────────────────────────────────────────────

export function PageShell({ children, className = '' }) {
  return (
    <div className={`relative z-10 mx-auto min-h-screen max-w-7xl px-5 pb-28 pt-36 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, children }) {
  return (
    <header className="mb-14 max-w-3xl sm:mb-16">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
          {description}
        </p>
      )}
      {children}
    </header>
  );
}

export function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-10 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-white/55 sm:text-base">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          {action.label}
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

// ─── States ────────────────────────────────────────────────────────────────

export function LoadingState({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-24 text-sm text-white/50" role="status">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/15 border-t-white/70" />
      {label}
    </div>
  );
}

export function ErrorState({ title, message }) {
  return (
    <div className="card mx-auto max-w-lg px-6 py-10 text-center">
      <p className="font-medium text-white">{title}</p>
      {message && <p className="mt-1 text-sm text-white/50">{message}</p>}
    </div>
  );
}

export function EmptyState({ children }) {
  return <p className="card mx-auto max-w-lg px-6 py-10 text-center text-sm text-white/50">{children}</p>;
}

// ─── Cards ─────────────────────────────────────────────────────────────────

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function PersonPhoto({ name, image }) {
  const [failed, setFailed] = useState(false);

  if (image && !failed) {
    return (
      <img
        src={image}
        alt={name ? `Photo of ${name}` : ''}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  // No photo uploaded yet, or it failed to load.
  return (
    <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(160deg,#16161f,#0d0d13)]">
      <span className="font-[family-name:var(--font-display)] text-4xl font-medium text-white/30">{initials(name)}</span>
    </div>
  );
}

/** Profile card used for the Team and Cabinet pages. */
export function PersonCard({ name, role, image, email, phone, linkedin, instagram }) {
  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="aspect-[4/5] w-full overflow-hidden border-b border-white/[0.06]">
        <PersonPhoto name={name} image={image} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        {name && <h2 className="text-lg font-semibold leading-snug text-white">{name}</h2>}
        {role && <p className="mt-1 text-sm text-white/55">{role}</p>}

        {(email || phone || linkedin || instagram) && (
          <div className="mt-auto flex items-center gap-2 pt-5">
            {email && (
              <a href={`mailto:${email}`} className="icon-btn" aria-label={`Email ${name}`} title={email}>
                <MailIcon className="h-4 w-4" />
              </a>
            )}
            {phone && (
              <a href={`tel:${phone}`} className="icon-btn" aria-label={`Call ${name}`} title={phone}>
                <PhoneIcon className="h-4 w-4" />
              </a>
            )}
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`${name} on LinkedIn`}>
                <LinkedInIcon className="h-4 w-4" />
              </a>
            )}
            {instagram && (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label={`${name} on Instagram`}>
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

/** Card for a club or tech team. Links out when the body has a website/social link. */
export function BodyCard({ body, link }) {
  const Tag = link ? 'a' : 'div';
  return (
    <Tag
      {...(link ? { href: link, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`card group flex flex-col p-6 ${link ? 'card-link' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
          {body.logo && (
            <img src={body.logo} alt="" loading="lazy" className="h-full w-full object-cover" />
          )}
        </div>
        <h3 className="text-lg font-semibold leading-snug text-white">{body.name}</h3>
      </div>

      {body.short_description && (
        <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-white/55">{body.short_description}</p>
      )}

      <div className="mt-auto pt-6">
        {link ? (
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/75 transition-colors group-hover:text-white">
            Visit website
            <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="text-sm text-white/30">Link coming soon</span>
        )}
      </div>
    </Tag>
  );
}

export function formatDate(iso, options = { month: 'long', day: 'numeric', year: 'numeric' }) {
  if (!iso) return '';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString('en-IN', options);
}

/** Achievement entry: body logo, title, description, date and body name. */
export function AchievementCard({ achievement }) {
  const { title, description, date, body } = achievement;
  return (
    <article className="card flex flex-col p-6">
      <div className="flex items-start gap-4">
        {body?.logo && (
          <img
            src={body.logo}
            alt=""
            loading="lazy"
            className="h-11 w-11 shrink-0 rounded-lg border border-white/10 object-cover"
          />
        )}
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-snug text-white sm:text-lg">{title}</h3>
          {description && <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>}
        </div>
      </div>
      {(date || body?.name) && (
        <p className="mt-auto pt-5 text-xs text-white/40">
          {[formatDate(date), body?.name].filter(Boolean).join('  ·  ')}
        </p>
      )}
    </article>
  );
}

const MEDALS = [
  { key: 'gold', label: 'Gold', color: '#E3BE5B' },
  { key: 'silver', label: 'Silver', color: '#C5CBD3' },
  { key: 'bronze', label: 'Bronze', color: '#C48A5A' },
];

/** Inter-IIT Tech Meet summary: header, medal tally, description and results table. */
export function InterIITCard({ meet }) {
  const d = meet;
  return (
    <article className="card overflow-hidden">
      <div className="grid lg:grid-cols-2">
        <div className="flex flex-col gap-8 border-b border-white/[0.08] p-6 sm:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-5">
            {d.logo && (
              <img src={d.logo} alt="" className="h-16 w-16 shrink-0 rounded-xl border border-white/10 object-cover sm:h-20 sm:w-20" />
            )}
            <div>
              <h3 className="text-2xl font-semibold leading-tight text-white sm:text-3xl">{d.title}</h3>
              {d.subtitle && <p className="mt-1 text-sm text-white/55 sm:text-base">{d.subtitle}</p>}
            </div>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-white/[0.08] rounded-xl border border-white/[0.08]">
            {MEDALS.map((medal) => (
              <div key={medal.key} className="px-4 py-5 text-center">
                <dd className="text-3xl font-semibold tabular-nums text-white sm:text-4xl">{d[medal.key] ?? 0}</dd>
                <dt className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-white/50">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: medal.color }} />
                  {medal.label}
                </dt>
              </div>
            ))}
          </dl>

          {d.description && <p className="text-sm leading-relaxed text-white/60 sm:text-base">{d.description}</p>}
        </div>

        <div className="p-6 sm:p-8">
          {d.problemstatements?.length > 0 ? (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-white/40">
                  <th className="pb-3 font-medium">Problem statement</th>
                  <th className="pb-3 text-right font-medium">Position</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {d.problemstatements.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-4 text-white/80">{p.title}</td>
                    <td className="py-3 text-right font-medium text-white">{p.position}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-white/40">Results will be added soon.</p>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Icons ─────────────────────────────────────────────────────────────────

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.75, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function ArrowRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
