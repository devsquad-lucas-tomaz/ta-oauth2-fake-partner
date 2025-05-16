import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router';
import handleAuthorize from '../services/authorizationCode';
import { unauthenticatedImplicit, unauthenticatedExplicit } from '../store/credentialSlice';

export default function Navigation() {
  const {
    implicit: { authenticated: isImplicitAuth },
    explicit: { authenticated: isExplicitAuth, user },
  } = useSelector((state) => state.credentials);

  const dispatch = useDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const showDropdown = isImplicitAuth || isExplicitAuth;

  return (
    <nav className="bg-secondary-400 p-4 flex justify-between items-center">
      <ul className="flex space-x-6 container mx-auto text-white">
        <li>
          <Link to="/" className="hover:underline">Home</Link>
        </li>
        {isImplicitAuth && (
          <li>
            <Link to="/worksheets" className="hover:underline">Worksheets</Link>
          </li>
        )}
      </ul>

      {showDropdown && (
        <div className="relative">
          <button
            ref={buttonRef}
            className="text-white bg-secondary-300 px-3 py-1 rounded hover:bg-secondary-500"
            onClick={toggleDropdown}
          >
            {isExplicitAuth && user?.id ? user.name : 'Menu'}
          </button>

          {dropdownOpen && (
            <ul
              ref={dropdownRef}
              className="absolute right-0 mt-2 bg-white text-neutral-900 border border-neutral-200 rounded shadow-lg w-40 z-10"
            >
              {!isExplicitAuth && (
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:underline"
                    onClick={handleAuthorize}
                  >
                    Authorize
                  </button>
                </li>
              )}
              {isExplicitAuth && (
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:underline"
                    onClick={() => dispatch(unauthenticatedExplicit())}
                  >
                    Logout Explicit
                  </button>
                </li>
              )}
              {isImplicitAuth && (
                <li>
                  <button
                    className="block w-full text-left px-4 py-2 hover:underline"
                    onClick={() => dispatch(unauthenticatedImplicit())}
                  >
                    Logout Implicit
                  </button>
                </li>
              )}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
}