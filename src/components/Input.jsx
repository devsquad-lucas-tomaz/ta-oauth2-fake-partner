import { XCircleIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';


export default function InputField({
  type = 'text',
  id,
  name,
  value,
  onChange,
  onBlur,
  wireTarget,
  disabled = false,
  error,
  inline = false,
  prepend = false,
  append = false,
  className = '',
  ...rest
}) {
  const inputClass = classNames(
    'block px-3 w-full h-9 text-body-14 font-normal text-neutral-700 rounded-md border-1 border-neutral-400 shadow-sm focus:outline-none focus:border-1 focus:border-neutral-400 focus:ring-0',
    {
      'border-support-red placeholder-support-red text-support-red focus:border-support-red':
        error && !prepend && !append,
      'bg-neutral-50 cursor-not-allowed': disabled,
      'mt-1': !inline && !prepend && !append,
    },
    className
  );

  return (
    <>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={inputClass}
        data-wire-target={wireTarget}
        data-wire-loading={wireTarget ? 'true' : undefined}
        {...rest}
      />
      {error && <ErrorMessage message={error} />}
    </>
  );
};

const ErrorMessage = ({ message, className = '' }) => {
  return (
    <div
      className={`bg-red-100 text-body-14 text-support-red font-normal mt-1 w-full min-h-[40px] rounded-sm mb-6 py-2 px-3 flex gap-2.5 items-center ${className}`}
    >
      <XCircleIcon className="text-support-red min-w-[20px] h-5" />
      <span dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};