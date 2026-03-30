import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-8 items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
          selectedCategory === null
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
            : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            selectedCategory === category.id
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 active:scale-95'
              : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
