'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { MenuItem, CategorySlug, CATEGORY_SLUGS, CATEGORY_NAMES, DietaryTag } from '@/lib/types';
import { APPLY_SEARCH_EVENT, type ApplySearchDetail } from '@/lib/search-index';

interface MenuSearchProps {
  items: MenuItem[];
}

type SortOption = 'menu' | 'price-asc' | 'price-desc';

export function MenuSearch({ items }: MenuSearchProps) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [activeDietary, setActiveDietary] = useState<DietaryTag | null>(null);
  const [activeSort, setActiveSort] = useState<SortOption>('menu');

  const [mounted, setMounted] = useState(false);

  // Hydration state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(inputValue.trim().toLowerCase());
    }, 200);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Receive filters handed off from the hero search
  useEffect(() => {
    const onApply = (e: Event) => {
      const detail = (e as CustomEvent<ApplySearchDetail>).detail;
      if (!detail) return;
      setInputValue(detail.query);
      setSearchQuery(detail.query.trim().toLowerCase());
      setActiveCategory(detail.category);
      setActiveDietary(detail.dietary);
      setActiveSort('menu');
    };
    window.addEventListener(APPLY_SEARCH_EVENT, onApply);
    return () => window.removeEventListener(APPLY_SEARCH_EVENT, onApply);
  }, []);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (searchQuery) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery)
      );
    }

    if (activeCategory !== 'all') {
      result = result.filter((item) => item.category === activeCategory);
    }

    if (activeDietary === 'vegan') {
      result = result.filter((item) => item.dietaryTags.includes('vegan'));
    } else if (activeDietary === 'vegetarian') {
      // Vegans are also vegetarians by definition in menus usually, but let's just check the tags
      // Sometimes items only have 'vegan' tag, but they are vegetarian. Let's include vegan in vegetarian.
      result = result.filter((item) => 
        item.dietaryTags.includes('vegetarian') || item.dietaryTags.includes('vegan')
      );
    }

    if (activeSort === 'price-asc') {
      result.sort((a, b) => {
        const priceA = a.typicalPriceGbp ?? Infinity;
        const priceB = b.typicalPriceGbp ?? Infinity;
        return priceA - priceB;
      });
    } else if (activeSort === 'price-desc') {
      result.sort((a, b) => {
        const priceA = a.typicalPriceGbp ?? -Infinity;
        const priceB = b.typicalPriceGbp ?? -Infinity;
        return priceB - priceA;
      });
    }

    return result;
  }, [items, searchQuery, activeCategory, activeDietary, activeSort]);

  // Update aria-live text
  const announceMessage = useMemo(() => {
    if (!mounted) return '';
    const catText = activeCategory === 'all' ? '' : ` ${CATEGORY_NAMES[activeCategory]}`;
    return `${filteredItems.length}${catText} items found`;
  }, [filteredItems.length, activeCategory, mounted]);

  const isFiltered =
    searchQuery !== '' || activeCategory !== 'all' || activeDietary !== null || activeSort !== 'menu';

  const clearFilters = useCallback(() => {
    setInputValue('');
    setSearchQuery('');
    setActiveCategory('all');
    setActiveDietary(null);
    setActiveSort('menu');
  }, []);

  const handleDietaryToggle = (tag: DietaryTag) => {
    setActiveDietary((prev) => (prev === tag ? null : tag));
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return 'Not verified';
    return `£${price.toFixed(2)}`;
  };

  // If JS is disabled or during SSR, we just render the raw un-filtered list, or we could render the filteredItems (which starts as all items)
  // Wait, the requirement says "The complete menu MUST be rendered in server HTML first. This component should only HIDE items after hydration"
  // Since we render filteredItems and initially filteredItems is all items, it renders all items in server HTML.
  
  return (
    <div className="space-y-6">
      {/* Screen Reader Announcement Region */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {announceMessage}
      </div>

      {/* Controls */}
      <div className="glass-light rounded-[var(--radius-xl)] p-5 sm:p-6 space-y-5">
        {/* Search */}
        <div className="relative">
          <label htmlFor="menu-search" className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted mb-2.5">
            Search menu
          </label>
          <div className="relative flex items-center">
            <input
              id="menu-search"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-white border border-line rounded-full px-5 py-3 text-ink placeholder:text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              placeholder="E.g. burger, chips..."
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="absolute right-3 text-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary p-1 rounded-sm"
                aria-label="Clear search"
              >
                X
              </button>
            )}
          </div>
        </div>

        {/* Categories Rail */}
        <div>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-muted mb-2.5">Categories</span>
          <div className="relative overflow-hidden">
            <div className="flex overflow-x-auto pb-2 -mb-2 gap-2 hide-scrollbar snap-x">
              <button
                onClick={() => setActiveCategory('all')}
                className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeCategory === 'all'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-ink/80 border border-line hover:border-primary/40 hover:text-primary'
                }`}
              >
                All categories
              </button>
              {CATEGORY_SLUGS.map((slug) => (
                <button
                  key={slug}
                  onClick={() => setActiveCategory(slug)}
                  className={`snap-start whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    activeCategory === slug
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-ink/80 border border-line hover:border-primary/40 hover:text-primary'
                  }`}
                >
                  {CATEGORY_NAMES[slug]}
                </button>
              ))}
            </div>
            {/* Fade indicator for scrollable area (mobile) */}
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden"></div>
          </div>
        </div>

        {/* Dietary and Sort Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted mr-2">Dietary:</span>
            <button
              onClick={() => handleDietaryToggle('vegetarian')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeDietary === 'vegetarian'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-ink/80 border-line hover:border-primary/40 hover:text-primary'
              }`}
            >
              Vegetarian
            </button>
            <button
              onClick={() => handleDietaryToggle('vegan')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                activeDietary === 'vegan'
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-ink/80 border-line hover:border-primary/40 hover:text-primary'
              }`}
            >
              Vegan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted mr-2">Sort:</span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortOption)}
              className="bg-white border border-line text-ink text-sm rounded-full px-4 py-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Sort options"
            >
              <option value="menu">Menu order</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {isFiltered && (
          <div className="pt-2 border-t border-line flex items-center justify-between">
            <p className="text-sm text-muted">
              Showing {filteredItems.length} of {items.length} items
            </p>
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-primary hover:text-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-primary underline"
            >
              Clear filters
            </button>
          </div>
        )}
        {!isFiltered && (
          <div className="pt-2 border-t border-line">
            <p className="text-sm text-muted">Showing all {items.length} items</p>
          </div>
        )}
      </div>

      {/* Results Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/${item.category}/${item.slug}`}
              className="lift group flex flex-col bg-white rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] p-6 border border-line hover:border-primary/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary h-full"
            >
              <div className="flex justify-between items-start mb-2 gap-4">
                <p className="font-display font-semibold text-lg leading-snug text-ink group-hover:text-primary transition-colors">
                  {item.name}
                </p>
                <span className="font-display font-semibold text-lg text-teal whitespace-nowrap">
                  {formatPrice(item.typicalPriceGbp)}
                </span>
              </div>
              <p className="text-sm text-muted line-clamp-2 mb-4 flex-grow">
                {item.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-auto pt-4 border-t border-line text-xs">
                {item.caloriesKcal && (
                  <span className="bg-cloud text-muted px-2.5 py-1 rounded-full font-medium">
                    {item.caloriesKcal} kcal
                  </span>
                )}
                {item.dietaryTags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-foam text-teal-dark px-2.5 py-1 rounded-full font-semibold capitalize"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white shadow-[var(--shadow-card)] rounded-[var(--radius-lg)] p-10 text-center border border-line">
          <p className="text-ink font-medium">No items match your filters.</p>
          <p className="text-muted text-sm mt-2">
            Try removing some filters or search for something else.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
