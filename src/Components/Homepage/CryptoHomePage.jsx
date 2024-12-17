import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';

const CryptoHomePage = () => {
  const [coins, setCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
        },
      });
      setCoins(response.data);
      setFilteredCoins(response.data);
    } catch (error) {
      console.error('Error fetching coins:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query)
    );
    setFilteredCoins(filtered);
  };

  return (
    <div className="crypto-homepage">
      <div className="hero-section">
        <h1 className="crypto-title">Crypto Tracker</h1>
        <p className="crypto-subtitle">Your gateway to tracking cryptocurrencies in real-time.</p>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for a cryptocurrency..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading coins...</div>
      ) : (
        <div className="coin-list">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin) => (
              <Link to={`/coin/${coin.id}`} key={coin.id} className="coin-card">
                <div className="coin-card-content">
                  <img src={coin.image} alt={coin.name} className="coin-image" />
                  <div className="card-body">
                    <h3 className="coin-name">{coin.name}</h3>
                    <p className="coin-price">Price: ₹{coin.current_price}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-results">No results found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CryptoHomePage;
