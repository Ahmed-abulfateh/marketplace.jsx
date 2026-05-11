import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { getListingImages } from '../lib/listingImages';

function ListingCard({ listing }) {
  const { copy, formatCurrency, translateCatalogText, translateListingStatus } = useLanguage();
  const { cartIds, favoriteIds, listingStatuses, toggleCart, toggleFavorite } = useMarketplace();
  const isFavorite = favoriteIds.includes(listing.id);
  const isInCart = cartIds.includes(listing.id);
  const currentStatus = listingStatuses[listing.id] ?? listing.status;
  const listingImages = getListingImages(listing);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [listing.id]);

  useEffect(() => {
    if (listingImages.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % listingImages.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, [listingImages]);

  return (
    <article className="listing-card">
      <div className="listing-image-stage">
        {listingImages.length > 0 ? (
          <img
            className="listing-image-media"
            src={listingImages[activeImageIndex]}
            alt={translateCatalogText(listing.title)}
            loading="lazy"
          />
        ) : (
          <div className="listing-image-placeholder" aria-hidden="true" />
        )}

        {/* Price badge overlay */}
        <div className="listing-price-badge">
          {formatCurrency(listing.price)}
        </div>

        {/* Favorite button overlay */}
        <button
          type="button"
          className={`listing-fav-btn${isFavorite ? ' listing-fav-btn-active' : ''}`}
          onClick={() => toggleFavorite(listing.id)}
          aria-label={isFavorite ? copy.product.savedToFavorites : copy.common.save}
          title={isFavorite ? copy.product.savedToFavorites : copy.common.save}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {listingImages.length > 1 && (
          <div className="listing-image-dots" aria-hidden="true">
            {listingImages.map((imageUrl, index) => (
              <span
                key={`${listing.id}-${imageUrl}`}
                className={index === activeImageIndex ? 'listing-image-dot listing-image-dot-active' : 'listing-image-dot'}
              />
            ))}
          </div>
        )}
      </div>

      <div className="listing-card-body">
        <div className="listing-topline">
          <p className="card-label">{translateCatalogText(listing.category)}</p>
          <span className="badge">{translateCatalogText(listing.trust)}</span>
        </div>

        <h3>
          <Link className="listing-link" to={`/browse/${listing.id}`}>
            {translateCatalogText(listing.title)}
          </Link>
        </h3>

        <p className="seller-name">{listing.seller}</p>
        <p>{translateCatalogText(listing.meta)}</p>

        <div className="listing-meta-grid">
          <span>{translateCatalogText(listing.shipping)}</span>
          <span>{copy.common.sellerScore(listing.reviewScore.toFixed(1))}</span>
          <span>{translateListingStatus(currentStatus)}</span>
        </div>

        <div className="listing-footer">
          <span className="listing-stock-label">{copy.common.inStock(listing.inventory)}</span>
          <button
            type="button"
            className={`button${isInCart ? ' button-ghost listing-cart-btn-active' : ' button-secondary'} listing-cart-btn`}
            onClick={() => toggleCart(listing.id)}
          >
            {isInCart ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {copy.product.removeFromCart}
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {copy.product.addToCart}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ListingCard;
