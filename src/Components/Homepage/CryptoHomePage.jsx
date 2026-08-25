import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './style.css';

const API_KEY = import.meta.env.VITE_COINGECKO_API_KEY;

const CryptoHomePage = () => {
  const [coins, setCoins] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchTimeout = useRef(null);
  const searchController = useRef(null);

  const fetchCoins = async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'inr',
            order: 'market_cap_desc',
            per_page: 100,
            page: 1,
            sparkline: false,
            x_cg_demo_api_key: API_KEY,
          },
          signal,
        }
      );

      setCoins(response.data);
      setFilteredCoins(response.data);
    } catch (error) {
      if (error.code === 'ERR_CANCELED') {
        return;
      }

      console.error('CoinGecko API Error:', error);

      if (error.response?.status === 429) {
        setError(
          'Too many requests. Please wait a moment and try again.'
        );
      } else if (error.response?.status === 401) {
        setError('Invalid or missing CoinGecko API key.');
      } else if (error.response?.status === 403) {
        setError('CoinGecko has blocked this request.');
      } else {
        setError(
          'Failed to load cryptocurrencies. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchCoins(controller.signal);

    return () => {
      controller.abort();

      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      if (searchController.current) {
        searchController.current.abort();
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.trim().toLowerCase();

    setSearchQuery(query);

    // Previous timer cancel
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Previous API request cancel
    if (searchController.current) {
      searchController.current.abort();
      searchController.current = null;
    }

    // Empty search
    if (!query) {
      setFilteredCoins(coins);
      return;
    }

    // Search inside already loaded coins first
    const localResults = coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(query) ||
        coin.symbol.toLowerCase().includes(query) ||
        coin.id.toLowerCase().includes(query)
      );
    });

    setFilteredCoins(localResults);

    // If found locally, don't call API
    if (localResults.length > 0) {
      return;
    }

    // API search after 300ms
    searchTimeout.current = setTimeout(async () => {
      try {
        const controller = new AbortController();

        searchController.current = controller;

        const response = await axios.get(
          'https://api.coingecko.com/api/v3/search',
          {
            params: {
              query: query,
              x_cg_demo_api_key: API_KEY,
            },
            signal: controller.signal,
          }
        );

        const results = response.data.coins || [];

        setFilteredCoins(
          results.map((coin) => ({
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            image: coin.thumb,
            current_price: null,
          }))
        );
      } catch (error) {
        if (error.code === 'ERR_CANCELED') {
          return;
        }

        console.error('Search error:', error);
        setFilteredCoins([]);
      }
    }, 300);
  };

  const handleRetry = () => {
    const controller = new AbortController();

    fetchCoins(controller.signal);
  };

  return (
    <div className="crypto-homepage">

      {/* Hero Section */}
      <div className="hero-section">

        <h1 className="crypto-title">
          Crypto Tracker
        </h1>

        <p className="crypto-subtitle">
          Track cryptocurrency prices and market data.
        </p>

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

      {/* Main Content */}
      {loading ? (

        <div className="coin-list-state">

          <div className="loading-spinner"></div>

          <h3>
            Loading cryptocurrencies...
          </h3>

          <p>
            Please wait while we fetch the latest
            market data.
          </p>

        </div>

      ) : error ? (

        <div className="coin-list-state error-state">

          <div className="error-icon">
            !
          </div>

          <h3>
            Unable to load cryptocurrencies
          </h3>

          <p>
            {error}
          </p>

          <button
            className="retry-button"
            onClick={handleRetry}
          >
            Try Again
          </button>

        </div>

      ) : (

        <div className="coin-list">

          {filteredCoins.length > 0 ? (

            filteredCoins.map((coin) => (

              <Link
                to={`/coin/${coin.id}`}
                key={coin.id}
                className="coin-card"
              >

                <div className="coin-card-content">

                  <img
                    src={coin.image || coin.thumb}
                    alt={coin.name}
                    className="home-coin-image"
                  />

                  <div className="card-body">

                    <h3 className="coin-name">
                      {coin.name}
                    </h3>

                    <p className="coin-price">
                      {coin.current_price != null
                        ? `Price: ₹${coin.current_price.toLocaleString('en-IN')}`
                        : coin.symbol?.toUpperCase()}
                    </p>

                  </div>

                </div>

              </Link>

            ))

          ) : (

            <p className="no-results">
              No cryptocurrencies found.
            </p>

          )}

        </div>

      )}

    </div>
  );
};

export default CryptoHomePage;