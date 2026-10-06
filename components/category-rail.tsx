'use client';

import React from 'react';

interface Category {
  slug: string;
  name: string;
}

interface CategoryRailProps {
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange?: (slug: string | null) => void;
}

export function CategoryRail({ categories, activeCategory, onCategoryChange }: CategoryRailProps) {
  return (
    <div className="relative border-b border-ink/10">
      <nav 
        className="flex overflow-x-auto overflow-y-hidden whitespace-nowrap py-4 px-4 sm:px-6 lg:px-8 space-x-8 scrollbar-thin max-w-[var(--max-content)] mx-auto"
        aria-label="Menu categories"
      >
        <button
          onClick={() => onCategoryChange?.(null)}
          className={`text-base font-medium transition-colors hover:text-brass ${
            activeCategory === null
              ? 'text-brass border-b-2 border-brass pb-1'
              : 'text-ink/70'
          }`}
        >
          All
        </button>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              onClick={() => {
                onCategoryChange?.(cat.slug);
                const element = document.getElementById(`category-${cat.slug}`);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`text-base font-medium transition-colors hover:text-brass ${
                isActive
                  ? 'text-brass border-b-2 border-brass pb-1'
                  : 'text-ink/70'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
