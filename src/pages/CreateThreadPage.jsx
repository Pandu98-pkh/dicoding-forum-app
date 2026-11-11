import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  createThread,
  selectThreadsLoading,
  selectThreadsError,
} from '../store/slices/threadsSlice';
import ThreadForm from '../components/thread/ThreadForm';

function CreateThreadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectThreadsLoading);
  const error = useSelector(selectThreadsError);

  const handleSubmit = async ({ title, body, category }) => {
    const result = await dispatch(createThread({ title, body, category }));
    if (createThread.fulfilled.match(result)) {
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Thread</h1>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ThreadForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
}

export default CreateThreadPage;
