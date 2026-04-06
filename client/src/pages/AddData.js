import React, { useState } from 'react';
import { Row, Col, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const BLOCKS  = ['Academic Block', 'Laboratory Block', 'Administrative Block', 'Hostel Block', 'Library Block'];
const MONTHS  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CUR_YR  = new Date().getFullYear();
const YEARS   = Array.from({ length: 6 }, (_, i) => CUR_YR - i);

const INIT = {
  blockName: '', month: '', year: CUR_YR,
  energyUsed: '', waterUsed: '',
  totalWaste: '', recycledWaste: '',
  treesPlanted: 0
};

export default function AddData() {
  const [form,    setForm]    = useState(INIT);
  const [success, setSuccess] = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (Number(form.recycledWaste) > Number(form.totalWaste)) {
      return setError('Recycled waste cannot exceed total waste generated.');
    }
    if (Number(form.energyUsed) < 0 || Number(form.waterUsed) < 0 || Number(form.totalWaste) < 0) {
      return setError('Values cannot be negative.');
    }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/environment/add', {
        ...form,
        year:          Number(form.year),
        energyUsed:    Number(form.energyUsed),
        waterUsed:     Number(form.waterUsed),
        totalWaste:    Number(form.totalWaste),
        recycledWaste: Number(form.recycledWaste),
        treesPlanted:  Number(form.treesPlanted) || 0
      });

      setSuccess(
        `✅ Data saved! Sustainability Score: ${data.record.sustainabilityScore}/10 | Carbon Emission: ${data.record.carbonEmission} kg CO₂`
      );
      setForm(INIT);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const recycleRatio = form.totalWaste && form.recycledWaste
    ? ((Number(form.recycledWaste) / Number(form.totalWaste)) * 100).toFixed(1)
    : null;

  return (
    <>
      <div className="mb-3">
        <h1 className="gc-page-title">➕ Add Environmental Data</h1>
        <p className="gc-page-subtitle">Record monthly block-wise environmental metrics</p>
      </div>

      <Row>
        <Col xs={12} xl={8}>
          <div className="gc-form-card">

            {success && (
              <Alert variant="success" className="py-2" style={{ fontSize: '0.88rem', borderRadius: '8px' }}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert variant="danger" className="py-2" style={{ fontSize: '0.88rem', borderRadius: '8px' }}>
                ⚠️ {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {/* Block & Period */}
              <Row className="g-3 mb-3">
                <Col xs={12} md={4}>
                  <label className="gc-form-label">🏢 Block Name *</label>
                  <select
                    name="blockName"
                    className="gc-input form-select"
                    value={form.blockName}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Block</option>
                    {BLOCKS.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </Col>
                <Col xs={6} md={4}>
                  <label className="gc-form-label">📅 Month *</label>
                  <select
                    name="month"
                    className="gc-input form-select"
                    value={form.month}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Month</option>
                    {MONTHS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </Col>
                <Col xs={6} md={4}>
                  <label className="gc-form-label">🗓️ Year *</label>
                  <select
                    name="year"
                    className="gc-input form-select"
                    value={form.year}
                    onChange={handleChange}
                    required
                  >
                    {YEARS.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </Col>
              </Row>

              <hr style={{ borderColor: 'var(--border)' }} />

              {/* Energy & Water */}
              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <label className="gc-form-label">⚡ Energy Used (kWh) *</label>
                  <input
                    type="number"
                    name="energyUsed"
                    className="gc-input form-control"
                    value={form.energyUsed}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 850"
                    required
                  />
                  
                </Col>
                <Col xs={12} md={6}>
                  <label className="gc-form-label">💧 Water Used (Liters) *</label>
                  <input
                    type="number"
                    name="waterUsed"
                    className="gc-input form-control"
                    value={form.waterUsed}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 15000"
                    required
                  />
                 
                </Col>
              </Row>

              {/* Waste */}
              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <label className="gc-form-label">🗑️ Total Waste Generated (kg) *</label>
                  <input
                    type="number"
                    name="totalWaste"
                    className="gc-input form-control"
                    value={form.totalWaste}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 120"
                    required
                  />
                </Col>
                <Col xs={12} md={6}>
                  <label className="gc-form-label">♻️ Recycled Waste (kg) *</label>
                  <input
                    type="number"
                    name="recycledWaste"
                    className="gc-input form-control"
                    value={form.recycledWaste}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="e.g. 80"
                    required
                  />
                  {recycleRatio !== null && (
                    <small style={{ color: Number(recycleRatio) >= 50 ? 'var(--primary)' : '#dc3545', fontSize: '0.75rem', fontWeight: 600 }}>
                      Recycle ratio: {recycleRatio}%
                    </small>
                  )}
                </Col>
              </Row>

              {/* Trees */}
              <Row className="g-3 mb-4">
                <Col xs={12} md={6}>
                  <label className="gc-form-label">🌳 Trees Planted (Number)</label>
                  <input
                    type="number"
                    name="treesPlanted"
                    className="gc-input form-control"
                    value={form.treesPlanted}
                    onChange={handleChange}
                    min="0"
                    placeholder="e.g. 5"
                  />
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    
                  </small>
                </Col>
              </Row>

              <button
                type="submit"
                className="btn-gc-primary"
                disabled={loading}
              >
                {loading ? (
                  <><Spinner size="sm" className="me-2" />Saving...</>
                ) : (
                  '💾 Save Environmental Data'
                )}
              </button>
            </form>
          </div>
        </Col>

        {/* Score Guide */}
        <Col xs={12} xl={4} className="mt-3 mt-xl-0">
          <div className="gc-form-card h-100">
            <h6 style={{ fontFamily: 'Poppins', fontWeight: 700, color: 'var(--primary-dark)', marginBottom: '1rem' }}>
              📊 Sustainability Score Guide
            </h6>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <p className="mb-2"><strong style={{ color: 'var(--primary)' }}>Score Formula:</strong></p>
              <ul className="ps-3 mb-3">
                <li>Energy Score × 35%</li>
                <li>Water Score × 30%</li>
                <li>Waste Score × 35%</li>
                <li>Tree Bonus (max +1)</li>
              </ul>

              <div className="d-flex gap-2 flex-wrap mb-2">
                <span className="score-badge score-high">7–10 Excellent</span>
                <span className="score-badge score-medium">5–6.9 Good</span>
                <span className="score-badge score-low">Below 5 Poor</span>
              </div>

              <hr style={{ borderColor: 'var(--border)' }} />
              <p className="mb-1"><strong style={{ color: 'var(--primary)' }}>Carbon Emission:</strong></p>
              <p className="mb-0">CO₂ = (Energy × 0.92) + (Waste × 0.5) kg</p>
              <p style={{ fontSize: '0.75rem' }}>Based on India electricity grid factor</p>

              <hr style={{ borderColor: 'var(--border)' }} />
              <p className="mb-1"><strong style={{ color: 'var(--primary)' }}>Blocks:</strong></p>
              <div className="d-flex flex-column gap-1">
                {BLOCKS.map(b => {
                  const cls = b.toLowerCase().split(' ')[0];
                  return (
                    <span key={b} className={`block-badge block-${cls}`} style={{ display: 'inline-block', width: 'fit-content' }}>
                      {b}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
