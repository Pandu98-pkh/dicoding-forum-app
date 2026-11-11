import PropTypes from 'prop-types';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
      <p className="text-red-700 text-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm text-red-600 underline hover:text-red-800"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

ErrorMessage.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

ErrorMessage.defaultProps = {
  onRetry: null,
};

export default ErrorMessage;
