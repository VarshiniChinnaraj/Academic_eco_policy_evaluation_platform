import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Alert, Spinner, Modal, Button, Badge } from 'react-bootstrap';
import axios from 'axios';

const BLOCKS  = ['All', 'Academic Block', 'Laboratory Block', 'Administrative Block', 'Hostel Block', 'Library Block'];
const CUR_YR  = new Date().getFullYear();
const YEARS   = ['All', ...Array.from({ length: 6 }, (_, i) => CUR_YR - i)];

const blockClass = (b) => {
  if (!b) return '';
  const k = b.toLowerCase().split(' ')[0];
  return `block-${k}`;
};

const scoreBadge = (s) => {
  if (s >= 7) return 'score-high';
  if (s >= 5) return 'score-medium';
  return 'score-low';
};

export default function Reports() {
  const [records,     setRecords]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState('');
  const [filterBlock, setFilterBlock] = useState('All');
  const [filterYear,  setFilterYear]  = useState('All');
  const [deleteId,    setDeleteId]    = useState(null);
  const [deleting,    setDeleting]    = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [successMsg,  setSuccessMsg]  = useState('');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterBlock !== 'All') params.block = filterBlock;
      if (filterYear  !== 'All') params.year  = filterYear;
      const { data } = await axios.get('/api/environment/filter', { params });
      setRecords(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load records');
    } finally {
      setLoading(false);
    }
  }, [filterBlock, filterYear]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/environment/${deleteId}`);
      setSuccessMsg('✅ Record deleted successfully.');
      await fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete record');
    } finally {
      setDeleting(false);
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const handleDownload = async (format) => {
    setDownloading(true);
    try {
      const params = { format };
      if (filterBlock !== 'All') params.block = filterBlock;
      if (filterYear  !== 'All') params.year  = filterYear;

      const response = await axios.get('/api/reports/download', {
        params,
        responseType: 'blob'
      });

      const ext  = format === 'pdf' ? 'pdf' : 'csv';
      const mime = format === 'pdf' ? 'application/pdf' : 'text/csv';
      const url  = window.URL.createObjectURL(new Blob([response.data], { type: mime }));
      const link = document.createElement('a');
      link.href        = url;
      link.download    = `eco_report_${filterBlock.replace(' ', '_')}_${filterYear}.${ext}`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download report.');
    } finally {
      setDownloading(false);
    }
  };

  // Summary stats for filtered data
  const avgScore = records.length
    ? (records.reduce((s, r) => s + r.sustainabilityScore, 0) / records.length).toFixed(2)
    : 0;
  const totalCarbon = records.reduce((s, r) => s + (r.carbonEmission || 0), 0).toFixed(2);

  return (
    <>
      {/* Header */}
      <div className="mb-3">
        <h1 className="gc-page-title">📋 Reports</h1>
        <p className="gc-page-subtitle">Filter, download, and manage environmental data records</p>
      </div>

      {successMsg && (
        <Alert variant="success" onClose={() => setSuccessMsg('')} dismissible className="py-2" style={{ fontSize: '0.88rem', borderRadius: '8px' }}>
          {successMsg}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" onClose={() => setError('')} dismissible className="py-2" style={{ fontSize: '0.88rem', borderRadius: '8px' }}>
          ⚠️ {error}
        </Alert>
      )}

      {/* Filter Bar */}
      <div className="gc-filter-bar mb-3">
        <div>
          <label className="gc-form-label">🏢 Filter by Block</label>
          <select
            className="gc-input form-select"
            style={{ minWidth: '180px' }}
            value={filterBlock}
            onChange={e => setFilterBlock(e.target.value)}
          >
            {BLOCKS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div>
          <label className="gc-form-label">🗓️ Filter by Year</label>
          <select
            className="gc-input form-select"
            style={{ minWidth: '120px' }}
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <div className="ms-auto d-flex gap-2 align-items-end">
          <button
            className="btn-gc-primary"
            onClick={() => handleDownload('csv')}
            disabled={downloading || records.length === 0}
            title="Download CSV"
          >
            {downloading ? <Spinner size="sm" /> : '⬇️ CSV'}
          </button>
          <button
            className="btn-gc-accent"
            onClick={() => handleDownload('pdf')}
            disabled={downloading || records.length === 0}
            title="Download PDF"
          >
            {downloading ? <Spinner size="sm" /> : '📄 PDF'}
          </button>
        </div>
      </div>

      {/* Summary Pills */}
      {records.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mb-3">
          <span className="badge rounded-pill" style={{ background: 'var(--primary)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            📊 {records.length} Records
          </span>
          <span className="badge rounded-pill" style={{ background: '#f0c040', color: '#333', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            🏆 Avg Score: {avgScore}/10
          </span>
          <span className="badge rounded-pill" style={{ background: '#dc3545', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
            🌫️ Total CO₂: {Number(totalCarbon).toLocaleString()} kg
          </span>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="success" />
        </div>
      ) : records.length === 0 ? (
        <div className="gc-empty">
          <div className="gc-empty-icon">🌿</div>
          <p>No records found for the selected filters.</p>
          <small>Try changing the block or year filter, or <a href="/add" style={{ color: 'var(--primary)' }}>add new data</a>.</small>
        </div>
      ) : (
        <div className="gc-table-wrap">
          <div className="table-responsive">
            <table className="table gc-table table-hover mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Block</th>
                  <th>Month</th>
                  <th>Year</th>
                  <th>Energy (kWh)</th>
                  <th>Water (L)</th>
                  <th>Waste (kg)</th>
                  <th>Recycled (kg)</th>
                  <th>Trees</th>
                  <th>Eco Score</th>
                  <th>CO₂ (kg)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr key={r._id}>
                    <td className="text-muted" style={{ fontSize: '0.8rem' }}>{idx + 1}</td>
                    <td>
                      <span className={`block-badge ${blockClass(r.blockName)}`}>
                        {r.blockName}
                      </span>
                    </td>
                    <td>{r.month}</td>
                    <td>{r.year}</td>
                    <td>{r.energyUsed.toLocaleString()}</td>
                    <td>{r.waterUsed.toLocaleString()}</td>
                    <td>{r.totalWaste}</td>
                    <td>{r.recycledWaste}</td>
                    <td>🌳 {r.treesPlanted}</td>
                    <td>
                      <span className={`score-badge ${scoreBadge(r.sustainabilityScore)}`}>
                        {r.sustainabilityScore} / 10
                      </span>
                    </td>
                    <td>{r.carbonEmission}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        style={{ fontSize: '0.78rem', borderRadius: '6px', padding: '0.2rem 0.6rem' }}
                        onClick={() => { setDeleteId(r._id); setShowModal(true); }}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: '1px solid var(--border)' }}>
          <Modal.Title style={{ fontFamily: 'Poppins', fontSize: '1rem', fontWeight: 700 }}>
            🗑️ Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: '0.9rem' }}>
          Are you sure you want to delete this record? This action <strong>cannot be undone</strong>.
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid var(--border)' }}>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            style={{ borderRadius: '7px', fontSize: '0.88rem' }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleting}
            style={{ borderRadius: '7px', fontSize: '0.88rem' }}
          >
            {deleting ? <><Spinner size="sm" className="me-1" />Deleting...</> : '🗑️ Yes, Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
