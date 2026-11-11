import PropTypes from 'prop-types';

function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          selected === ''
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          type="button"
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {`#${cat}`}
        </button>
      ))}
    </div>
  );
}

CategoryFilter.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
