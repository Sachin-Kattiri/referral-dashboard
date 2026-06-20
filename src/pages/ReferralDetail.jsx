import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { fetchReferrals } from '../utils/api.js';
import { formatDate, formatProfit } from '../utils/format.js';

function resolveReferral(data, id) {
  if (!data || typeof data !== 'object') return null;

  if (String(data.id) === String(id) && (data.name || data.serviceName)) {
    return data;
  }

  if (Array.isArray(data.referrals)) {
    const match = data.referrals.find((row) => String(row.id) === String(id));
    if (match) return match;
  }

  return null;
}

function ReferralDetail() {
  const { id } = useParams();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setReferral(null);

    fetchReferrals({ id })
      .then((json) => {
        if (!active) return;
        const row = resolveReferral(json?.data, id);
        if (row) {
          setReferral(row);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="detail-page">
        {loading && <p className="loading-text">Loading…</p>}

        {!loading && notFound && (
          <div className="not-found-card">
            <h1>Referral not found</h1>
            <p>We couldn't find a referral matching this link.</p>
            <Link to="/" className="back-link">
              ← Back to dashboard
            </Link>
          </div>
        )}

        {!loading && !notFound && referral && (
          <div className="referral-detail-card">
            <h1>Referral Details</h1>
            <h2 className="referral-detail-name">{referral.name}</h2>

            <dl className="detail-list">
              <div className="detail-row">
                <dt>Referral ID</dt>
                <dd>{referral.id}</dd>
              </div>
              <div className="detail-row">
                <dt>Service Name</dt>
                <dd>{referral.serviceName}</dd>
              </div>
              <div className="detail-row">
                <dt>Date</dt>
                <dd>{formatDate(referral.date)}</dd>
              </div>
              <div className="detail-row">
                <dt>Profit</dt>
                <dd>{formatProfit(referral.profit)}</dd>
              </div>
            </dl>

            <Link to="/" className="back-link">
              ← Back to dashboard
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default ReferralDetail;
