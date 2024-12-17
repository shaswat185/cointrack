import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import ShowMoreText from 'react-show-more-text';
import './style.css';

const CoinDetailsPage = () => {
  const { coinId } = useParams();
  const [coinDetails, setCoinDetails] = useState(null);

  useEffect(() => {
    const fetchCoinDetails = async () => {
      try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`, {
          params: {
            localization: false,
          },
        });
        setCoinDetails(response.data);
      } catch (error) {
        console.error('Error fetching coin details:', error);
      }
    };

    fetchCoinDetails();
  }, [coinId]);

  if (!coinDetails) return <p className="loading">Loading...</p>;

  return (
    <div className="coin-details-container">
      <div className="coin-header">
        <img src={coinDetails.image.large} alt={coinDetails.name} className="coin-image" />
        <h1 className="coin-name">{coinDetails.name}</h1>
      </div>

      <div className="coin-stats">
        <div className="stat-item">
          <h3>Price</h3>
          <p>₹{coinDetails.market_data.current_price.inr.toLocaleString()}</p>
        </div>
        <div className="stat-item">
          <h3>Circulating Supply</h3>
          <p>{coinDetails.market_data.circulating_supply.toLocaleString()}</p>
        </div>
        <div className="stat-item">
          <h3>Market Cap</h3>
          <p>₹{coinDetails.market_data.market_cap.inr.toLocaleString()}</p>
        </div>
        <div className="stat-item">
          <h3>24h Change</h3>
          <p
            className={
              coinDetails.market_data.price_change_percentage_24h > 0
                ? 'positive-change'
                : 'negative-change'
            }
          >
            {coinDetails.market_data.price_change_percentage_24h}%
          </p>
        </div>
      </div>

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
          {coinDetails.description.en}
        </ShowMoreText>
      </div>

      {/* Add Home Button */}
      <div className="home-button-container">
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default CoinDetailsPage;
