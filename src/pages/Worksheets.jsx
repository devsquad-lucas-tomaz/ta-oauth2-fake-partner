import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorksheets } from '../store/worksheetsSlice';
import ContentCard from '../components/ContentCard';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

function Worksheets() {
  const dispatch = useDispatch();
  const { data: worksheets, meta, loading } = useSelector((state) => state.worksheets);

  const { current_page, last_page } = meta;

  useEffect(() => {
    if (current_page) {
      dispatch(fetchWorksheets({ page: current_page }));
    }
  }, []);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= last_page) {
      dispatch(fetchWorksheets({ page }));
    }
  };

  return (
    <div className="xl:w-[1140px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-6">Therapy Worksheets</h1>

      {!loading && worksheets.length === 0 && (
        <p className="text-neutral-600">No worksheets found.</p>
      )}

      <div className="w-full max-w-[870px]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worksheets.map((worksheet) => (
            <ContentCard key={worksheet.id} content={worksheet} loading={loading} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      {last_page > 1 && (
        <nav
          aria-label="Worksheet pagination"
          className="mt-8 flex justify-center items-center space-x-2"
        >
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page === 1}
            className="px-2 py-2 bg-primary-600 text-white rounded-lg disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors cursor-pointer"
            aria-label="Go to previous page"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          {[...Array(last_page).keys()].map((page) => (
            <button
              key={page + 1}
              onClick={() => handlePageChange(page + 1)}
              className={`px-3 py-1 rounded-lg ${
                current_page === page + 1
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              } transition-colors cursor-pointer`}
              aria-current={current_page === page + 1 ? 'page' : undefined}
              aria-label={`Go to page ${page + 1}`}
            >
              {page + 1}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(current_page + 1)}
            disabled={current_page === last_page}
            className="px-2 py-2 bg-primary-600 text-white rounded-lg disabled:bg-neutral-300 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors cursor-pointer"
            aria-label="Go to next page"
          >
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </nav>
      )}
    </div>
  );
}

export default Worksheets;