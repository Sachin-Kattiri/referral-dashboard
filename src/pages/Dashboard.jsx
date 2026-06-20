import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { fetchReferrals } from '../utils/api.js';
import { formatDate, formatProfit } from '../utils/format.js';

const PAGE_SIZE = 10;

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sort, setSort] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(searchInput), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    fetchReferrals({ search: debouncedSearch, sort })
      .then((json) => {
        if (!active) return;
        setData(json?.data ?? null);
        setCurrentPage(1);
      })
      .catch((err) => {
        if (!active) return;
        setError({ message: err.message, status: err.status });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, sort]);

  const metrics = data?.metrics ?? [];
  const serviceSummary = data?.serviceSummary ?? null;
  const referral = data?.referral ?? null;

  const { pageRows, totalEntries, totalPages, fromCount, toCount } = useMemo(() => {
    const referrals = data?.referrals ?? [];
    const total = referrals.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(currentPage, pages);
    const start = (safePage - 1) * PAGE_SIZE;
    const rows = referrals.slice(start, start + PAGE_SIZE);
    return {
      pageRows: rows,
      totalEntries: total,
      totalPages: pages,
      fromCount: total === 0 ? 0 : start + 1,
      toCount: Math.min(start + PAGE_SIZE, total),
    };
  }, [data, currentPage]);

  const handleCopy = async (value, field) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
    }
  };

  const handleRowActivate = (id) => {
    navigate(`/referral/${id}`);
  };

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <header className="dashboard-header">
          <h1>Referral Dashboard</h1>
          <p className="dashboard-subtitle">
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </header>

        {loading && <p className="loading-text">Loading…</p>}

        {!loading && error && (
          <p className="error-text" role="alert">
            {error.message}
            {error.status ? ` (Status: ${error.status})` : ''}
          </p>
        )}

        {!loading && !error && data && (
          <>
            <section className="card" aria-label="Overview metrics">
              <h2>Overview</h2>
              <div className="metrics-grid">
                {metrics.map((metric) => (
                  <div className="metric-tile" key={metric.id ?? metric.label}>
                    <span className="metric-label">{metric.label}</span>
                    <span className="metric-value">{metric.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {serviceSummary && (
              <section className="card" aria-label="Service summary">
                <h2>Service summary</h2>
                <dl className="summary-grid">
                  <div className="summary-item">
                    <dt>Service</dt>
                    <dd>{serviceSummary.service}</dd>
                  </div>
                  <div className="summary-item">
                    <dt>Your Referrals</dt>
                    <dd>{serviceSummary.yourReferrals}</dd>
                  </div>
                  <div className="summary-item">
                    <dt>Active Referrals</dt>
                    <dd>{serviceSummary.activeReferrals}</dd>
                  </div>
                  <div className="summary-item">
                    <dt>Total Ref. Earnings</dt>
                    <dd>{serviceSummary.totalRefEarnings}</dd>
                  </div>
                </dl>
              </section>
            )}

            {referral && (
              <section className="card" aria-label="Share referral">
                <h2>Refer friends and earn more</h2>
                <div className="share-grid">
                  <div className="share-field">
                    <label htmlFor="referral-link">Your Referral Link</label>
                    <div className="share-input-row">
                      <input id="referral-link" type="text" readOnly value={referral.link ?? ''} />
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleCopy(referral.link, 'link')}
                      >
                        {copiedField === 'link' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <div className="share-field">
                    <label htmlFor="referral-code">Your Referral Code</label>
                    <div className="share-input-row">
                      <input id="referral-code" type="text" readOnly value={referral.code ?? ''} />
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => handleCopy(referral.code, 'code')}
                      >
                        {copiedField === 'code' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="card">
              <div className="table-toolbar">
                <h2>All referrals</h2>
                <div className="table-controls">
                  <div className="search-field">
                    <input
                      type="text"
                      placeholder="Name or service…"
                      aria-label="Search referrals"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                    />
                  </div>
                  <label className="sort-field">
                    Sort by date
                    <select value={sort} onChange={(event) => setSort(event.target.value)}>
                      <option value="desc">Newest first</option>
                      <option value="asc">Oldest first</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Service</th>
                      <th scope="col">Date</th>
                      <th scope="col">Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="empty-state">
                          No matching entries
                        </td>
                      </tr>
                    )}
                    {pageRows.map((row) => (
                      <tr
                        key={row.id}
                        className="referral-row"
                        tabIndex={0}
                        onClick={() => handleRowActivate(row.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            handleRowActivate(row.id);
                          }
                        }}
                      >
                        <td>{row.name}</td>
                        <td>{row.serviceName}</td>
                        <td>{formatDate(row.date)}</td>
                        <td>{formatProfit(row.profit)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <p className="table-summary">
                  Showing {fromCount}–{toCount} of {totalEntries} entries
                </p>

                <div className="pagination">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>

                  {totalPages > 1 &&
                    Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`page-button${page === currentPage ? ' active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ))}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

export default Dashboard;
