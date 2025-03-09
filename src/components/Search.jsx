import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search">
      <div>
        <img src="./search.svg" alt="search icon" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search through thousands of movies"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Search;
