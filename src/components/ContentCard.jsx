import { Link } from 'react-router';

const ContentCard = ({ content, loading = false }) => {
  return (
    <Link
      id={content?.slug || 'skeleton'}
      to={`/worksheet/${content?.slug || ''}`}
      className={`relative block h-[352px] rounded-lg sm:h-[286px] sn:h-[329px] pd:h-[372px] ${
          loading ? 'pointer-events-none' : ''}
      `}
    >
      <div
        className={`bg-white flex flex-col h-full overflow-hidden rounded-lg shadow-md group hover:bg-neutral-100 ${
          loading ? 'pointer-events-none' : ''
        }`}
      >
        <div className="relative flex justify-center bg-neutral-100 h-[210px] sm:h-[124px] sn:h-[147px] pd:h-[180px]">
          {loading ? (
            <div className="w-full h-full bg-neutral-100 animate-pulse" />
          ) : (
            <img
              src={content?.thumbnail}
              alt={content?.title || 'Worksheet thumbnail'}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="p-3 flex flex-col grow">
          <h2
            className={`text-lg leading-5 truncate ${
              loading ? 'bg-neutral-50 text-transparent rounded' : 'text-neutral-900 group-hover:underline group-hover:text-[#3E318F]'
            }`}
          >
            {content?.title || 'Loading...'}
          </h2>
          <p
            className={`mt-1 text-sm font-bold truncate ${
              loading ? 'bg-neutral-50 text-transparent rounded' : 'text-neutral-900 group-hover:underline group-hover:text-[#3E318F]'
            }`}
          >
            {content.subtitle}
          </p>
          {!loading && content?.options?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 items-center">
              <span className="text-xs text-neutral-600">Available in:</span>
              {content.options.map((opt, index) => (
                <span
                  key={index}
                  className="inline-block bg-[#CEC6FC] text-[10px] font-medium text-[#3E318F] px-1.5 py-0.5 rounded-full capitalize"
                >
                  {opt.option.replace('standard-', '')}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ContentCard;