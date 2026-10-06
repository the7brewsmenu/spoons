'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { CATEGORY_NAMES, CATEGORY_SLUGS } from '@/lib/types';
import type { CategorySlug, DietaryTag } from '@/lib/types';
import {
  APPLY_SEARCH_EVENT,
  FOCUS_SEARCH_EVENT,
  type ApplySearchDetail,
  type SearchItem,
} from '@/lib/search-index';

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

const MAX_RESULTS = 8;
const RECENT_KEY = 'spoonsmenu:recent-searches';
const MAX_RECENT = 5;

const PLACEHOLDERS = [
  'Search 99 dishes, drinks and deals',
  'Try "large breakfast"',
  'Try "vegan burger"',
  'Try "curry club"',
  'Try "under 600 kcal"',
  'Try "steak"',
];

const POPULAR_SEARCHES = ['Large breakfast', 'Burger', 'Curry', 'Steak', 'Pizza', 'Fish and chips'];

/** Common shorthand people type, mapped to words that appear in the menu. */
const SYNONYMS: Record<string, string[]> = {
  veggie: ['vegetarian'],
  brekkie: ['breakfast'],
  fry: ['breakfast'],
  fryup: ['breakfast'],
  fries: ['chips'],
  chips: ['fries'],
  pint: ['lager', 'ale', 'beer', 'cider'],
  beer: ['lager', 'ale', 'pint'],
  coffee: ['latte', 'cappuccino', 'americano'],
  kids: ['children', 'kid'],
  roast: ['sunday'],
  pud: ['pudding', 'dessert'],
  dessert: ['pudding', 'cake', 'brownie'],
  chicken: ['wings', 'katsu'],
};

type PriceCap = 5 | 8 | 12 | null;
type SortMode = 'relevance' | 'price' | 'kcal';

/* ------------------------------------------------------------------ */
/* Matching helpers                                                    */
/* ------------------------------------------------------------------ */

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9£.\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Bounded Levenshtein: returns true when distance <= 1. Cheap typo tolerance. */
function withinOneEdit(a: string, b: string) {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (la > lb) i++;
    else if (lb > la) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (la - i) + (lb - j) <= 1;
}

function scoreToken(token: string, item: SearchItem, nameLower: string, nameWords: string[]) {
  if (nameLower.startsWith(token)) return 12;
  if (nameWords.some((w) => w.startsWith(token))) return 8;
  if (nameLower.includes(token)) return 6;
  if (item.categoryName.toLowerCase().includes(token)) return 4;
  if (item.tags.some((t) => t.startsWith(token))) return 4;
  if (item.keywords.includes(token)) return 2;
  const alts = SYNONYMS[token];
  if (alts?.some((alt) => nameLower.includes(alt) || item.keywords.includes(alt))) return 3;
  if (token.length >= 4 && nameWords.some((w) => withinOneEdit(token, w))) return 3;
  return 0;
}

/** Pull "under 600 kcal" / "under £8" style intents out of the free text. */
function parseIntents(raw: string) {
  let text = normalise(raw);
  let kcalCap: number | null = null;
  let priceCap: number | null = null;

  const kcal = text.match(/(?:under|below|less than)?\s*(\d{2,4})\s*(?:kcal|cal|calories)/);
  if (kcal) {
    kcalCap = Number(kcal[1]);
    text = text.replace(kcal[0], ' ');
  }
  const price = text.match(/(?:under|below|less than)\s*£?\s*(\d{1,2}(?:\.\d{1,2})?)(?!\s*(?:kcal|cal))/);
  if (price) {
    priceCap = Number(price[1]);
    text = text.replace(price[0], ' ');
  }
  const tokens = text
    .split(' ')
    .filter((t) => t.length > 1 && !['the', 'and', 'with', 'a', 'of', 'under', 'kcal'].includes(t));

  return { tokens, kcalCap, priceCap };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        tokens.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="rounded-sm bg-mint/40 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function formatPrice(price: number | null) {
  return price === null ? 'Not verified' : `£${price.toFixed(2)}`;
}

function readRecent(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string').slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function HeroSearch({ items }: { items: SearchItem[] }) {
  const router = useRouter();
  const listboxId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [category, setCategory] = useState<CategorySlug | 'all'>('all');
  const [dietary, setDietary] = useState<DietaryTag | null>(null);
  const [priceCap, setPriceCap] = useState<PriceCap>(null);
  const [lighter, setLighter] = useState(false);
  const [sort, setSort] = useState<SortMode>('relevance');
  const [recent, setRecent] = useState<string[]>(readRecent);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  /* Rotating placeholder (paused while typing, off for reduced motion) */
  useEffect(() => {
    if (query || open) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 2800);
    return () => window.clearInterval(id);
  }, [query, open]);

  /* Keyboard shortcuts: "/" or Ctrl/Cmd+K focus the search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setOpen(true);
      }
    };
    const onFocusEvent = () => {
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      inputRef.current?.focus({ preventScroll: true });
      setOpen(true);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(FOCUS_SEARCH_EVENT, onFocusEvent);
    if (window.location.hash === '#hero-search') {
      window.setTimeout(onFocusEvent, 50);
    }
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(FOCUS_SEARCH_EVENT, onFocusEvent);
    };
  }, []);

  /* Close when clicking outside */
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    return () => document.removeEventListener('mousedown', onPointer);
  }, [open]);

  const intents = useMemo(() => parseIntents(query), [query]);
  const effectivePriceCap = priceCap ?? intents.priceCap;
  const effectiveKcalCap = lighter ? 600 : intents.kcalCap;

  const hasFilters = category !== 'all' || dietary !== null || priceCap !== null || lighter;
  const hasQuery = query.trim().length > 0;

  const results = useMemo(() => {
    if (!hasQuery && !hasFilters) return [];

    const scored: { item: SearchItem; score: number }[] = [];
    for (const item of items) {
      if (category !== 'all' && item.category !== category) continue;
      if (dietary === 'vegan' && !item.tags.includes('vegan')) continue;
      if (dietary === 'vegetarian' && !item.tags.some((t) => t === 'vegetarian' || t === 'vegan')) continue;
      if (effectivePriceCap !== null && (item.price === null || item.price > effectivePriceCap)) continue;
      if (effectiveKcalCap !== null && (item.kcal === null || item.kcal > effectiveKcalCap)) continue;

      let score = 1;
      if (intents.tokens.length > 0) {
        const nameLower = item.name.toLowerCase();
        const nameWords = nameLower.split(/\s+/);
        score = 0;
        let matchedAll = true;
        for (const token of intents.tokens) {
          const s = scoreToken(token, item, nameLower, nameWords);
          if (s === 0) {
            matchedAll = false;
            break;
          }
          score += s;
        }
        if (!matchedAll) continue;
      }
      scored.push({ item, score });
    }

    scored.sort((a, b) => {
      if (sort === 'price') return (a.item.price ?? Infinity) - (b.item.price ?? Infinity);
      if (sort === 'kcal') return (a.item.kcal ?? Infinity) - (b.item.kcal ?? Infinity);
      return b.score - a.score || a.item.name.localeCompare(b.item.name);
    });
    return scored.map((s) => s.item);
  }, [items, hasQuery, hasFilters, category, dietary, effectivePriceCap, effectiveKcalCap, intents.tokens, sort]);

  const visible = results.slice(0, MAX_RESULTS);
  const showPanel = open;

  const rememberSearch = useCallback((value: string) => {
    const clean = value.trim();
    if (!clean) return;
    setRecent((prev) => {
      const next = [clean, ...prev.filter((v) => v.toLowerCase() !== clean.toLowerCase())].slice(0, MAX_RECENT);
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable: keep in memory only */
      }
      return next;
    });
  }, []);

  const goToItem = useCallback(
    (item: SearchItem) => {
      rememberSearch(query || item.name);
      setOpen(false);
      router.push(`/${item.category}/${item.slug}`);
    },
    [query, rememberSearch, router]
  );

  const applyToFullMenu = useCallback(() => {
    rememberSearch(query);
    const detail: ApplySearchDetail = { query: intents.tokens.join(' '), category, dietary };
    window.dispatchEvent(new CustomEvent<ApplySearchDetail>(APPLY_SEARCH_EVENT, { detail }));
    setOpen(false);
    document.getElementById('main-menu')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [category, dietary, intents.tokens, query, rememberSearch]);

  const runQuickSearch = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    setOpen(true);
    inputRef.current?.focus();
  };

  const clearAll = () => {
    setQuery('');
    setCategory('all');
    setDietary(null);
    setPriceCap(null);
    setLighter(false);
    setSort('relevance');
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => (visible.length === 0 ? -1 : (i + 1) % visible.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (visible.length === 0 ? -1 : i <= 0 ? visible.length - 1 : i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && visible[activeIndex]) goToItem(visible[activeIndex]);
      else if (results.length > 0) applyToFullMenu();
    } else if (e.key === 'Escape') {
      if (query) setQuery('');
      else {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  const statusText = !hasQuery && !hasFilters
    ? ''
    : results.length === 0
      ? 'No matching items'
      : `${results.length} matching item${results.length === 1 ? '' : 's'}`;

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      active
        ? 'border-primary bg-primary text-white'
        : 'border-line bg-white text-ink/75 hover:border-primary/40 hover:text-primary'
    }`;

  return (
    <div ref={wrapperRef} id="hero-search" className="relative z-30 mx-auto w-full max-w-[860px] scroll-mt-28 text-left">
      {/* Search card */}
      <div className="rounded-[20px] bg-white p-2 shadow-[var(--shadow-float)]">
        <div className="relative flex items-center">

          <label htmlFor="hero-search-input" className="sr-only">
            Search the Wetherspoons menu
          </label>
          <input
            ref={inputRef}
            id="hero-search-input"
            type="search"
            role="combobox"
            autoComplete="off"
            spellCheck={false}
            aria-expanded={showPanel}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
            value={query}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(-1);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onInputKeyDown}
            className="h-14 w-full rounded-[16px] bg-transparent pl-6 pr-28 font-medium text-base text-ink placeholder:text-ink/45 focus:outline-none sm:h-16 sm:text-lg [&::-webkit-search-cancel-button]:hidden"
          />
          <div className="absolute right-3 flex items-center gap-2">
            {query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setActiveIndex(-1);
                  inputRef.current?.focus();
                }}
                className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink/60 hover:bg-cloud hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                Clear
              </button>
            ) : (
              <kbd className="hidden rounded-md border border-line bg-cloud px-2 py-1 font-body text-[11px] font-semibold text-muted sm:inline-block">
                Press /
              </kbd>
            )}
            <button
              type="button"
              onClick={() => (results.length > 0 ? applyToFullMenu() : inputRef.current?.focus())}
              className="hidden h-11 items-center rounded-[12px] bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:inline-flex"
            >
              Search
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-line/70 px-3 pb-1.5 pt-3 [scrollbar-width:none]">
          <label htmlFor="hero-search-category" className="sr-only">
            Category
          </label>
          <select
            id="hero-search-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as CategorySlug | 'all');
              setActiveIndex(-1);
              setOpen(true);
            }}
            className="shrink-0 cursor-pointer rounded-full border border-line bg-white py-1.5 pl-3 pr-8 text-xs font-semibold text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <option value="all">All categories</option>
            {CATEGORY_SLUGS.map((slug) => (
              <option key={slug} value={slug}>
                {CATEGORY_NAMES[slug]}
              </option>
            ))}
          </select>

          <span aria-hidden="true" className="h-5 w-px shrink-0 bg-line" />

          <button
            type="button"
            aria-pressed={dietary === 'vegetarian'}
            onClick={() => {
              setDietary((d) => (d === 'vegetarian' ? null : 'vegetarian'));
              setOpen(true);
            }}
            className={chip(dietary === 'vegetarian')}
          >
            Vegetarian
          </button>
          <button
            type="button"
            aria-pressed={dietary === 'vegan'}
            onClick={() => {
              setDietary((d) => (d === 'vegan' ? null : 'vegan'));
              setOpen(true);
            }}
            className={chip(dietary === 'vegan')}
          >
            Vegan
          </button>
          <button
            type="button"
            aria-pressed={lighter}
            onClick={() => {
              setLighter((v) => !v);
              setOpen(true);
            }}
            className={chip(lighter)}
          >
            Under 600 kcal
          </button>

          <span aria-hidden="true" className="h-5 w-px shrink-0 bg-line" />

          {([5, 8, 12] as const).map((cap) => (
            <button
              key={cap}
              type="button"
              aria-pressed={priceCap === cap}
              onClick={() => {
                setPriceCap((p) => (p === cap ? null : cap));
                setOpen(true);
              }}
              className={chip(priceCap === cap)}
            >
              Under £{cap}
            </button>
          ))}

          {(hasFilters || hasQuery) && (
            <button
              type="button"
              onClick={clearAll}
              className="ml-auto shrink-0 whitespace-nowrap px-2 text-xs font-semibold text-ink/50 underline-offset-2 hover:text-ink hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {open ? statusText : ''}
      </p>

      {/* Results panel */}
      {showPanel && (
        <div className="absolute left-0 right-0 top-full mt-3 overflow-hidden rounded-[20px] border border-line bg-white shadow-[var(--shadow-float)]">
          {hasQuery || hasFilters ? (
            <>
              <div className="flex items-center justify-between gap-3 border-b border-ink/5 px-5 py-3">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">{statusText}</span>
                {results.length > 1 && (
                  <div className="flex items-center gap-1 text-xs" role="group" aria-label="Sort results">
                    {(
                      [
                        ['relevance', 'Best match'],
                        ['price', 'Price'],
                        ['kcal', 'Calories'],
                      ] as const
                    ).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={sort === value}
                        onClick={() => setSort(value)}
                        className={`rounded-full px-2.5 py-1 font-semibold transition-colors ${
                          sort === value ? 'bg-navy text-white' : 'text-muted hover:text-ink'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {visible.length > 0 ? (
                <ul id={listboxId} role="listbox" aria-label="Menu search results" className="max-h-[400px] overflow-y-auto py-1">
                  {visible.map((item, index) => {
                    const active = index === activeIndex;
                    return (
                      <li
                        key={`${item.category}/${item.slug}`}
                        id={`${listboxId}-opt-${index}`}
                        role="option"
                        aria-selected={active}
                        onMouseEnter={() => setActiveIndex(index)}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => goToItem(item)}
                        className={`flex cursor-pointer items-center gap-4 px-5 py-3 transition-colors ${
                          active ? 'bg-mist' : 'hover:bg-cloud'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist font-display text-sm font-semibold text-primary"
                        >
                          {item.name.charAt(0)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[15px] font-bold text-ink">
                            <Highlight text={item.name} tokens={intents.tokens} />
                          </span>
                          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink/55">
                            <span>{item.categoryName}</span>
                            {item.kcal !== null && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span>{item.kcal} kcal</span>
                              </>
                            )}
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-foam px-2 py-0.5 text-[10px] font-semibold capitalize text-teal-dark"
                              >
                                {tag}
                              </span>
                            ))}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-display text-base font-semibold text-teal">
                            {formatPrice(item.price)}
                          </span>
                          {item.price !== null && (
                            <span className="block text-[10px] uppercase tracking-wider text-ink/40">typical</span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div id={listboxId} role="listbox" aria-label="Menu search results" className="px-5 py-8 text-center">
                  <p className="font-display text-lg font-bold text-ink">Nothing matches that yet</p>
                  <p className="mt-1 text-sm text-ink/60">Try a broader word, or remove a filter.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {POPULAR_SEARCHES.slice(0, 4).map((term) => (
                      <button key={term} type="button" onClick={() => runQuickSearch(term)} className={chip(false)}>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={applyToFullMenu}
                  className="flex w-full items-center justify-between border-t border-line bg-cloud px-5 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-mist"
                >
                  <span>
                    Show all {results.length} in the full menu
                  </span>
                  <span className="hidden items-center gap-3 text-[11px] font-medium text-ink/45 sm:flex">
                    <span>
                      <kbd className="rounded border border-line bg-white px-1.5 py-0.5">Up</kbd>{' '}
                      <kbd className="rounded border border-line bg-white px-1.5 py-0.5">Down</kbd> to move
                    </span>
                    <span>
                      <kbd className="rounded border border-line bg-white px-1.5 py-0.5">Enter</kbd> to open
                    </span>
                  </span>
                </button>
              )}
            </>
          ) : (
            <div id={listboxId} role="listbox" aria-label="Search suggestions" className="grid gap-6 p-5 sm:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
                    {recent.length > 0 ? 'Recent searches' : 'Popular searches'}
                  </span>
                  {recent.length > 0 && (
                    <button type="button" onClick={clearRecent} className="text-xs text-ink/45 hover:text-ink">
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(recent.length > 0 ? recent : POPULAR_SEARCHES).map((term) => (
                    <button key={term} type="button" onClick={() => runQuickSearch(term)} className={chip(false)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
                  Browse by category
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORY_SLUGS.slice(0, 8).map((slug) => (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => {
                        setCategory(slug);
                        setActiveIndex(-1);
                        inputRef.current?.focus();
                      }}
                      className="rounded-lg px-2.5 py-2 text-left text-sm text-ink/75 transition-colors hover:bg-mist hover:text-primary"
                    >
                      {CATEGORY_NAMES[slug]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
