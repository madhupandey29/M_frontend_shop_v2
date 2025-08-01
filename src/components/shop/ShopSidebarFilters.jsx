import React, { useState, useEffect } from 'react';
import { useGetFilterOptionsQuery } from '../../redux/api/apiSlice';

const FILTERS = [
  { key: 'category', label: 'Category', api: 'category/' },
  { key: 'color', label: 'Color', api: 'color/' },
  { key: 'content', label: 'Content', api: 'content/' },
  { key: 'design', label: 'Design', api: 'design/' },
  { 
    key: 'structure', 
    label: 'Structure', 
    api: 'structure/', 
    sub: { 
      key: 'substructure', 
      label: 'Substructure', 
      api: 'substructure/' 
    } 
  },
  { 
    key: 'finish', 
    label: 'Finish', 
    api: 'finish/',
    sub: {
      key: 'subfinish',
      label: 'Sub Finish',
      api: 'subfinish/'
    }
  },
  { key: 'groupcode', label: 'Group Code', api: 'groupcode/' },
  { key: 'vendor', label: 'Vendor', api: 'vendor/' },
  { 
    key: 'suitablefor', 
    label: 'Suitable For', 
    api: 'suitablefor/',
    sub: {
      key: 'subsuitable',
      label: 'Sub Suitable',
      api: 'subsuitable/'
    }
  },
  { key: 'motifsize', label: 'Motif Size', api: 'motif/' }
];

const ShopSidebarFilters = ({ onFilterChange, selected = {} }) => {
  const [openKey, setOpenKey] = useState(null);
  const [expandedSubFilters, setExpandedSubFilters] = useState({});

  const handleAccordion = (key) => {
    setOpenKey(key === openKey ? null : key);
  };

  const handleSubAccordion = (parentKey, subKey) => {
    setExpandedSubFilters(prev => ({
      ...prev,
      [parentKey]: prev[parentKey] === subKey ? null : subKey
    }));
  };

  const handleCheckboxSelect = (filterKey, value) => {
    const currentValues = selected[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...selected, [filterKey]: newValues });
  };

  // Helper function to safely get options from API response
  const getOptionsFromResponse = (data) => {
    if (!data) return [];
    // Handle different possible response structures
    if (Array.isArray(data)) return data;
    if (data.data && Array.isArray(data.data)) return data.data;
    if (data.results && Array.isArray(data.results)) return data.results;
    return [];
  };

  return (
    <div className="tp-shop-sidebar mr-10">
      <h3 className="tp-shop-widget-title">Filter</h3>
      <div className="tp-shop-widget-content">
        {FILTERS.map((filter) => {
          const { 
            data: response, 
            isLoading, 
            error 
          } = useGetFilterOptionsQuery(filter.api, {
            skip: openKey !== filter.key && !expandedSubFilters[filter.key]
          });

          const options = getOptionsFromResponse(response);

          // Debug logging
          useEffect(() => {
            if (error) {
              console.error(`Error fetching ${filter.key}:`, error);
            } else if (response) {
              console.log(`Response for ${filter.key}:`, response);
            }
          }, [error, response, filter.key]);

          return (
            <div key={filter.key} className="tp-shop-widget mb-30">
              <div
                className="tp-shop-widget-title no-border d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => handleAccordion(filter.key)}
              >
                <span>{filter.label}</span>
                <span>{openKey === filter.key ? '-' : '+'}</span>
              </div>
              {openKey === filter.key && (
                <div className="tp-shop-widget-options mt-2">
                  <div className="d-flex flex-column">
                    {isLoading ? (
                      <div className="text-muted small">Loading...</div>
                    ) : error ? (
                      <div className="text-danger small">Error loading options</div>
                    ) : options.length === 0 ? (
                      <div className="text-muted small">No options available</div>
                    ) : (
                      options.map((opt) => (
                        <label 
                          key={opt._id || opt.id || opt.name} 
                          className="d-flex align-items-center mb-2"
                        >
                          <input
                            type="checkbox"
                            className="me-2"
                            name={filter.key}
                            checked={(selected[filter.key] || []).includes(opt._id || opt.id || opt.name)}
                            onChange={() => handleCheckboxSelect(
                              filter.key, 
                              opt._id || opt.id || opt.name
                            )}
                          />
                          <span>{opt.name || opt.parent || opt.title}</span>
                        </label>
                      ))
                    )}
                  </div>
                  
                  {filter.sub && (
                    <div className="tp-shop-widget-subfilter mt-3">
                      <div
                        className="tp-shop-widget-title no-border d-flex justify-content-between align-items-center"
                        style={{ cursor: 'pointer', fontSize: '0.95em' }}
                        onClick={() => handleSubAccordion(filter.key, filter.sub.key)}
                      >
                        <span>{filter.sub.label}</span>
                        <span>{expandedSubFilters[filter.key] === filter.sub.key ? '−' : '+'}</span>
                      </div>
                      {expandedSubFilters[filter.key] === filter.sub.key && (
                        <SubFilter 
                          api={filter.sub.api} 
                          filterKey={filter.sub.key}
                          selected={selected[filter.sub.key] || []}
                          onSelect={handleCheckboxSelect}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SubFilter = ({ api, filterKey, selected, onSelect }) => {
  const { data: response, isLoading, error } = useGetFilterOptionsQuery(api);
  const options = Array.isArray(response) ? response : 
                 (response?.data || response?.results || []);

  if (isLoading) return <div className="text-muted small ps-3">Loading sub-options...</div>;
  if (error) return <div className="text-danger small ps-3">Error loading sub-options</div>;
  if (!options.length) return <div className="text-muted small ps-3">No sub-options available</div>;

  return (
    <div className="ps-3 mt-2">
      {options.map((opt) => (
        <label 
          key={opt._id || opt.id || opt.name} 
          className="d-flex align-items-center mb-2"
        >
          <input
            type="checkbox"
            className="me-2"
            name={filterKey}
            checked={selected.includes(opt._id || opt.id || opt.name)}
            onChange={() => onSelect(filterKey, opt._id || opt.id || opt.name)}
          />
          <span>{opt.name || opt.parent || opt.title}</span>
        </label>
      ))}
    </div>
  );
};

export default ShopSidebarFilters;