import React from 'react';

const SearchSortBar = ({ searchTerm, setSearchTerm, sortOption, setSortOption, handleSearch }) => {
  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="row mb-4">
      <div className="col-md-8 mb-3 mb-md-0">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, description or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e)}
            onKeyPress={handleKeyPress}
            aria-label="Search products"
          />
          <button 
            className="btn btn-primary" 
            type="button"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
      <div className="col-md-4">
        <div className="input-group">
          <label className="input-group-text" htmlFor="sortSelect">Sort By</label>
          <select
            className="form-select"
            id="sortSelect"
            value={sortOption}
            onChange={setSortOption}
            aria-label="Sort products"
          >
            <option value="">Default</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="a-z">Name: A to Z</option>
            <option value="z-a">Name: Z to A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchSortBar;