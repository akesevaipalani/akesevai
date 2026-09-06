import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, ChevronDown, Check, Building, FileText, AlertCircle } from 'lucide-react';
import {
  GOVERNMENT_SERVICES,
  SERVICE_CATEGORIES,
  searchGovernmentServices,
  findGovernmentService
} from '../data/governmentServicesData';
import '../styles/SearchableServiceSelect.css';

export default function SearchableServiceSelect({
  value = '',
  onChange,
  onSelect,
  lang = 'ta',
  placeholder,
  required = false,
  id = 'gov-service-combobox',
  className = '',
  disabled = false
}) {
  const isTa = lang === 'ta';
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listboxRef = useRef(null);

  // Determine currently selected service object
  const selectedService = useMemo(() => {
    if (!value) return null;
    return findGovernmentService(value);
  }, [value]);

  // Filter services using master search with category filter
  const filteredServices = useMemo(() => {
    return searchGovernmentServices(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Sync search input with value when closed
  useEffect(() => {
    if (!isOpen) {
      if (selectedService) {
        setSearchQuery(isTa ? selectedService.nameTa : selectedService.nameEn);
      } else if (value) {
        setSearchQuery(value);
      } else {
        setSearchQuery('');
      }
    }
  }, [value, selectedService, isOpen, isTa]);

  // Reset highlight index when results change
  useEffect(() => {
    setHighlightedIndex(filteredServices.length > 0 ? 0 : -1);
  }, [filteredServices]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[highlightedIndex];
      if (activeEl && typeof activeEl.scrollIntoView === 'function') {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, []);

  const handleSelectService = (service) => {
    if (!service) return;
    const serviceName = isTa ? service.nameTa : service.nameEn;
    setSearchQuery(serviceName);
    setIsOpen(false);
    if (typeof onChange === 'function') {
      onChange(serviceName, service);
    }
    if (typeof onSelect === 'function') {
      onSelect(service);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchQuery('');
    setIsOpen(true);
    setSelectedCategory('all');
    if (typeof onChange === 'function') {
      onChange('', null);
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredServices.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredServices.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredServices.length) {
          handleSelectService(filteredServices[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const defaultPlaceholder = isTa
    ? '🔍 அரசு சேவையைத் தட்டச்சு செய்து தேடுக (98 சேவைகள்)...'
    : '🔍 Type to search government services (98 options)...';

  return (
    <div
      ref={containerRef}
      className={`searchable-service-select-container ${className} ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''}`}
    >
      {/* Search Input Box */}
      <div
        className="combobox-input-wrapper"
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
            if (inputRef.current) inputRef.current.focus();
          }
        }}
      >
        <Search size={17} className="combobox-search-icon" />

        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={`${id}-listbox`}
          aria-activedescendant={
            highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined
          }
          className="combobox-text-input"
          placeholder={placeholder || defaultPlaceholder}
          value={searchQuery}
          disabled={disabled}
          required={required && !value}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />

        {searchQuery && !disabled && (
          <button
            type="button"
            className="combobox-clear-btn"
            onClick={handleClear}
            title={isTa ? 'அழிக்க (Clear)' : 'Clear search'}
            aria-label="Clear selection"
          >
            <X size={15} />
          </button>
        )}

        <button
          type="button"
          className="combobox-toggle-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (!disabled) {
              setIsOpen((prev) => !prev);
              if (!isOpen && inputRef.current) inputRef.current.focus();
            }
          }}
          aria-label="Toggle services list"
          tabIndex={-1}
        >
          <ChevronDown size={17} className={`toggle-chevron ${isOpen ? 'rotated' : ''}`} />
        </button>
      </div>

      {/* Floating Dropdown Listbox */}
      {isOpen && !disabled && (
        <div className="combobox-dropdown-panel" id={`${id}-listbox`} role="listbox">
          {/* Category Chips Bar */}
          <div className="combobox-category-filter">
            <button
              type="button"
              className={`cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedCategory('all');
                if (inputRef.current) inputRef.current.focus();
              }}
            >
              🏛️ {isTa ? 'அனைத்தும்' : 'All'} ({GOVERNMENT_SERVICES.length})
            </button>
            {SERVICE_CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory(cat.id);
                  if (inputRef.current) inputRef.current.focus();
                }}
              >
                {cat.icon} {isTa ? cat.nameTa.split('–')[0].trim() : cat.nameEn.split('–')[0].trim()}
              </button>
            ))}
          </div>

          {/* Results Counter */}
          <div className="combobox-results-header">
            <span>
              {isTa ? 'கிடைத்த சேவைகள்:' : 'Matching Services:'}{' '}
              <strong>{filteredServices.length}</strong>
            </span>
            {searchQuery && (
              <span className="search-hint">
                "{searchQuery}"
              </span>
            )}
          </div>

          {/* Service Items List */}
          <div className="combobox-options-scroll" ref={listboxRef}>
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => {
                const isSelected = selectedService?.id === service.id;
                const isHighlighted = highlightedIndex === index;
                const reqCount = service.requiredDocuments?.length || 0;
                const prereqCount = service.prerequisites?.length || 0;

                return (
                  <div
                    key={service.id}
                    id={`${id}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    className={`combobox-option-item ${isHighlighted ? 'highlighted' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => handleSelectService(service)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="option-code-row">
                      <span className="option-id-badge">{service.id}</span>
                      <span className="option-dept-badge">
                        {isTa ? service.departmentTa : service.department}
                      </span>
                    </div>

                    <div className="option-main-title">
                      {isTa ? service.nameTa : service.nameEn}
                    </div>
                    <div className="option-sub-title">
                      {isTa ? service.nameEn : service.nameTa}
                    </div>

                    <div className="option-meta-row">
                      {reqCount > 0 ? (
                        <span className="option-doc-tag">
                          📄 {reqCount} {isTa ? 'ஆவணங்கள் (Required)' : 'Docs Required'}
                        </span>
                      ) : (
                        <span className="option-doc-tag zero-docs">
                          ⚡ {isTa ? 'பதிவேற்றம் தேவையில்லை (No Upload)' : 'No Upload Needed'}
                        </span>
                      )}

                      {prereqCount > 0 && (
                        <span className="option-prereq-tag">
                          🔑 {prereqCount} {isTa ? 'முன்நிபந்தனைகள்' : 'Prerequisites'}
                        </span>
                      )}

                      {isSelected && (
                        <span className="option-check-icon">
                          <Check size={16} />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="combobox-no-results">
                <AlertCircle size={24} className="no-res-icon" />
                <p className="no-res-title">
                  {isTa ? 'சேவைகள் எதுவும் கண்டறியப்படவில்லை' : 'No matching services found'}
                </p>
                <p className="no-res-desc">
                  {isTa
                    ? 'வேறு தேடல் சொற்களைப் பயன்படுத்தவும் (எ.கா: வருமானம், TNEB, Smart Card, Patta, ஆதார்).'
                    : 'Try typing other keywords like Income, Electricity, Ration Card, Patta, Aadhaar.'}
                </p>
                <button
                  type="button"
                  className="combobox-reset-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    if (inputRef.current) inputRef.current.focus();
                  }}
                >
                  {isTa ? 'அனைத்து சேவைகளையும் காட்டுக' : 'Show All Services'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
