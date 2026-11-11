import PropTypes from 'prop-types';

function Avatar({ src, name, size }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-10 h-10 text-sm';
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0`}
    >
      {initial}
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md']),
};

Avatar.defaultProps = {
  src: '',
  name: '',
  size: 'md',
};

export default Avatar;
