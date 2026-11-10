'use client';

import Link from 'next/link';
import { FiArrowUpRight, FiHexagon, FiShield } from 'react-icons/fi';

const AuthShell = ({
  children,
  eyebrow,
  title,
  description,
  storyTitle,
  storyDescription,
  footer,
}) => (
  <main className="relative min-h-screen overflow-hidden w-full bg-[#f5f7fb] px-4 py-6 text-slate-900 sm:px-6 lg:px-10 lg:py-10">
    <div className="pointer-events-none absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-indigo-200/50 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-48 left-1/3 h-[30rem] w-[30rem] rounded-full bg-sky-100/70 blur-3xl" />

    <div className="relative mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_32px_100px_-44px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/[0.06] lg:min-h-[min(820px,calc(100vh-5rem))] lg:grid-cols-[1.02fr_0.98fr]">
      <section className="relative hidden overflow-hidden bg-[#101735] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(129,140,248,0.34),transparent_30%),radial-gradient(circle_at_14%_86%,rgba(56,189,248,0.18),transparent_30%)]" />
        <div className="pointer-events-none absolute -right-36 top-1/4 h-[28rem] w-[28rem] rounded-full border border-white/[0.08]" />
        <div className="pointer-events-none absolute -right-16 top-[34%] h-[20rem] w-[20rem] rounded-full border border-white/[0.09]" />
        <div className="pointer-events-none absolute right-8 top-[44%] h-28 w-28 rounded-full border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-indigo-700 shadow-lg shadow-black/10">
              <FiHexagon size={22} strokeWidth={2.4} />
            </span>
            <span className="text-xl font-bold tracking-tight">Zociel</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-xl py-14">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-2 text-xs font-medium tracking-wide text-indigo-100">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            A space for your people
          </div>
          <h1 className="max-w-lg text-5xl font-semibold leading-[1.08] tracking-[-0.045em] xl:text-6xl">
            {storyTitle}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-slate-300">
            {storyDescription}
          </p>

          <div className="mt-12 flex items-center gap-4 border-t border-white/10 pt-6">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-indigo-100">
              <FiShield size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Your account, your space</p>
              <p className="mt-1 text-xs text-slate-400">Built for meaningful connections.</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs text-slate-400">
          Connect with intention. Share what matters.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-[430px]">
          <div className="mb-10 flex items-center justify-between lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <FiHexagon size={18} strokeWidth={2.4} />
              </span>
              <span className="text-lg font-bold tracking-tight">Zociel</span>
            </Link>
            <Link href="/" aria-label="Go to home" className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
              <FiArrowUpRight size={19} />
            </Link>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
              {eyebrow}
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.15rem]">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </div>

          {children}
          {footer}
        </div>
      </section>
    </div>
  </main>
);

export default AuthShell;
