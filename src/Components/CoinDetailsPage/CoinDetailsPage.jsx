import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ShowMoreText from 'react-show-more-text';
import './style.css';

const formatINR = (value) => {
  if (value == null) {
    return '—';
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
};

const CoinDetailsPage = () => {
  const { coinId } = useParams();

  const [coinDetails, setCoinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoinDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinId}`
      );

      setCoinDetails(response.data);
    } catch (error) {
      console.error('Failed to fetch coin details:', error);

      if (error.response?.status === 404) {
        setError('Cryptocurrency not found.');
      } else if (error.response?.status === 429) {
        setError(
          'Too many requests. Please wait a moment and try again.'
        );
      } else {
        setError(
          'Failed to load cryptocurrency details. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoinDetails();
  }, [coinId]);

  // Loading state
  if (loading) {
    return (
      <div className="details-loading">
        Loading cryptocurrency details...
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="details-error">
        <p>{error}</p>

        <button onClick={fetchCoinDetails}>
          Try Again
        </button>

        <br />

        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  // No data state
  if (!coinDetails) {
    return (
      <div className="details-error">
        <p>No cryptocurrency data available.</p>

        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const priceChange =
    coinDetails.market_data?.price_change_percentage_24h;

  return (
    <div className="coin-details-container">

      {/* Coin Header */}
      <div className="coin-header">
        <img
          src={coinDetails.image?.large}
          alt={coinDetails.name}
          className="home-coin-image"
        />

        <h1 className="coin-name">
          {coinDetails.name}
        </h1>

        <p>
          {coinDetails.symbol?.toUpperCase()}
        </p>
      </div>

      {/* Coin Statistics */}
      <div className="coin-stats">

        {/* Price */}
        <div className="stat-item">
          <h3>Price</h3>

          <p>
            {formatINR(
              coinDetails.market_data?.current_price?.inr
            )}
          </p>
        </div>

        {/* Circulating Supply */}
        <div className="stat-item">
          <h3>Circulating Supply</h3>

          <p>
            {coinDetails.market_data?.circulating_supply != null
              ? coinDetails.market_data.circulating_supply.toLocaleString(
                  'en-IN'
                )
              : '—'}
          </p>
        </div>

        {/* Market Cap */}
        <div className="stat-item">
          <h3>Market Cap</h3>

          <p>
            {formatINR(
              coinDetails.market_data?.market_cap?.inr
            )}
          </p>
        </div>

        {/* 24 Hour Change */}
        <div className="stat-item">
          <h3>24h Change</h3>

          <p
            className={
              priceChange > 0
                ? 'positive-change'
                : priceChange < 0
                ? 'negative-change'
                : 'neutral-change'
            }
          >
            {priceChange != null
              ? `${priceChange.toFixed(2)}%`
              : '—'}
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="coin-description">
        <h3>Description</h3>

        <ShowMoreText
          lines={3}
          more="Show More"
          less="Show Less"
          className="content-css"
          anchorClass="show-more-link"
          expanded={false}
          width={0}
        >
          {coinDetails.description?.en
            ? coinDetails.description.en
            : 'No description is available for this cryptocurrency.'}
        </ShowMoreText>
      </div>

      {/* Back to Home */}
      <div className="home-button-container">
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>

    </div>
  );
};

export default CoinDetailsPage;