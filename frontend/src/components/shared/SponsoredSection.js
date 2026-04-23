import React, { useEffect, useState } from "react";
import axios from "axios";

const SponsoredSection = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    axios.get("/api/ads/active").then((res) => {
      let sorted = (res.data.ads || []).sort(
        (a, b) => b.remainingBudget - a.remainingBudget
      );
      sorted = sorted.slice(0, 5).sort(() => Math.random() - 0.5);
      setAds(sorted);
    });
  }, []);

  const handleAdClick = async (adId, productId) => {
    await axios.post(`/api/ads/${adId}/click`);
    window.location.href = `/product/${productId}`;
  };

  return (
    <div>
      <h2>Sponsored</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {ads.map((ad) => (
          <div
            key={ad._id}
            style={{ border: "1px solid #ccc", padding: "1rem", minWidth: 200 }}
          >
            <h4>{ad.adTitle}</h4>
            {ad.productId?.images?.[0] && (
              <img src={ad.productId.images[0]} alt="" width={100} />
            )}
            <p>{ad.productId?.name}</p>
            <button onClick={() => handleAdClick(ad._id, ad.productId._id)}>
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsoredSection;
