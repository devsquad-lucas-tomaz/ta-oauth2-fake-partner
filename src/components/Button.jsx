import classNames from 'classnames';

export default function Button({
  state = 'fill', // 'fill' | 'outline' | 'link'
  size = 'md',    // 'sm' | 'md' | 'lg' | 'xl'
  href = '',
  children,
  disabled = false,
  loading = false,
  className = '',
  ...rest
}) {
  // Size-based padding
  const buttonSizePadding = {
    sm: 'px-3',
    md: 'px-4',
    lg: 'px-5',
    xl: 'px-6',
  }[size];

  // Computed classes
  const classes = classNames(
    'flex items-center justify-center gap-2 font-bold disabled:opacity-30',
    {
      // Link state
      'text-primary-500 hover:text-primary-800 focus:border-b-2 focus:border-solid focus:border-primary-100':
        state === 'link',

      // Fill or outline state
      [`rounded-full focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-secondary-200 ${buttonSizePadding}`]:
        state !== 'link',

      'border-2 border-solid border-secondary-400 text-secondary-400 hover:bg-secondary-30 hover:text-secondary-500':
        state === 'outline',

      'text-white bg-secondary-400 hover:bg-secondary-500 disabled:bg-secondary-400':
        state === 'fill',

      // Size-based height & text
      'text-sm leading-4 h-9': size === 'sm',
      'text-base leading-[1.125rem] h-11': size === 'md',
      'text-lg leading-5 h-12': size === 'lg',
      'text-2xl h-14': size === 'xl',
    },
    className
  );

  // Button or anchor
  if (!href) {
    return (
      <button className={classes} disabled={disabled || loading} {...rest}>
        {loading && (
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        <span>{children}</span>
      </button>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}