import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const BLOCK_COLORS = [
  'rgba(26,122,74,0.82)',
  'rgba(102,187,106,0.82)',
  'rgba(240,192,64,0.82)',
  'rgba(33,150,243,0.82)',
  'rgba(156,39,176,0.82)'
];
const BLOCK_BORDERS = [
  'rgba(26,122,74,1)',
  'rgba(56,142,60,1)',
  'rgba(200,152,0,1)',
  'rgba(21,101,192,1)',
  'rgba(106,27,154,1)'
];

function StatCard({ icon, value, label, bg }) {
  return (
    <div className="gc-stat-card">
      <div className="gc-stat-icon" style={{ background: bg }}>{icon}</div>
      <div>
        <div className="gc-stat-value">{value}</div>
        <div className="gc-stat-label">{label}</div>
      </div>
    </div>
  );
}

const chartOpts = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } },
    title:  { display: false }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 10 } } }
  }
});

export default function Dashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: d } = await axios.get('/api/dashboard');
        setData(d);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <Spinner animation="border" variant="success" />
    </div>
  );

  if (error) return <Alert variant="danger">{error}</Alert>;

  const blocks = data.blockWiseEnergy.map(b => b.block.replace(' Block', ''));

  // Chart datasets
  const energyBarData = {
    labels: blocks,
    datasets: [{
      label: 'Energy Used (kWh)',
      data: data.blockWiseEnergy.map(b => b.value),
      backgroundColor: BLOCK_COLORS,
      borderColor: BLOCK_BORDERS,
      borderWidth: 1.5,
      borderRadius: 5
    }]
  };

  const waterBarData = {
    labels: blocks,
    datasets: [{
      label: 'Water Used (Liters)',
      data: data.blockWiseWater.map(b => b.value),
      backgroundColor: BLOCK_COLORS.map(c => c.replace('0.82', '0.75')),
      borderColor: BLOCK_BORDERS,
      borderWidth: 1.5,
      borderRadius: 5
    }]
  };

  const wasteDonutData = {
    labels: blocks,
    datasets: [{
      label: 'Recycle %',
      data: data.blockWiseWaste.map(b => b.recyclePercent),
      backgroundColor: BLOCK_COLORS,
      borderColor: '#fff',
      borderWidth: 2
    }]
  };

  const sustainBarData = {
    labels: blocks,
    datasets: [{
      label: 'Avg Sustainability Score',
      data: data.blockWiseSustainability.map(b => b.value),
      backgroundColor: data.blockWiseSustainability.map(b =>
        b.value >= 7 ? 'rgba(26,122,74,0.8)' :
        b.value >= 5 ? 'rgba(240,192,64,0.8)' : 'rgba(220,53,69,0.8)'
      ),
      borderColor: data.blockWiseSustainability.map(b =>
        b.value >= 7 ? '#1a7a4a' : b.value >= 5 ? '#e6a000' : '#dc3545'
      ),
      borderWidth: 1.5,
      borderRadius: 5
    }]
  };

  const trendLabels = data.monthlyTrend.map(m => m.label);
  const trendLineData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Avg Score',
        data: data.monthlyTrend.map(m => m.avgScore),
        borderColor: '#1a7a4a',
        backgroundColor: 'rgba(26,122,74,0.12)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        yAxisID: 'y'
      },
      {
        label: 'Energy (kWh)',
        data: data.monthlyTrend.map(m => m.energy),
        borderColor: '#f0c040',
        backgroundColor: 'transparent',
        tension: 0.4,
        pointRadius: 3,
        borderDash: [4, 2],
        yAxisID: 'y1'
      }
    ]
  };

  const carbonDonutData = {
    labels: ['Carbon Emissions (kg CO₂)', 'Trees Offset Estimate'],
    datasets: [{
      data: [
        parseFloat(data.totalCarbonEmission.toFixed(0)),
        parseFloat((data.totalTreesPlanted * 21).toFixed(0))
      ],
      backgroundColor: ['rgba(220,53,69,0.8)', 'rgba(26,122,74,0.8)'],
      borderColor: ['#dc3545', '#1a7a4a'],
      borderWidth: 2
    }]
  };

  const scoreColor = data.avgSustainabilityScore >= 7 ? '#1a7a4a' : data.avgSustainabilityScore >= 5 ? '#f0c040' : '#dc3545';

  return (
    <>
      {/* Header */}
      <div className="mb-3">
        <h1 className="gc-page-title">🌿 Dashboard</h1>
        <p className="gc-page-subtitle">Campus-wide environmental sustainability overview</p>
      </div>
      {/* Stat Cards */}
      <Row className="g-3 mb-4">
        <Col xs={6} xl={3}>
          <StatCard
            icon="⚡"
            value={`${Number(data.categoryBreakdown.totalEnergy).toLocaleString()} kWh`}
            label="Total Energy Used"
            bg="rgba(240,192,64,0.15)"
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard
            icon="💧"
            value={`${Number(data.categoryBreakdown.totalWater).toLocaleString()} L`}
            label="Total Water Used"
            bg="rgba(33,150,243,0.12)"
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard
            icon="♻️"
            value={`${data.categoryBreakdown.totalRecycled} kg`}
            label="Total Waste Recycled"
            bg="rgba(26,122,74,0.12)"
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard
            icon="🌱"
            value={data.totalTreesPlanted}
            label="Total Trees Planted"
            bg="rgba(102,187,106,0.15)"
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard
            icon="🏆"
            value={<span style={{ color: scoreColor }}>{data.avgSustainabilityScore} / 10</span>}
            label="Avg Sustainability Score"
            bg={`${scoreColor}18`}
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard
            icon="🌫️"
            value={`${data.totalCarbonEmission.toLocaleString()} kg`}
            label="Total CO₂ Emissions"
            bg="rgba(220,53,69,0.1)"
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard
            icon="🗂️"
            value={data.totalRecords}
            label="Data Records"
            bg="rgba(156,39,176,0.1)"
          />
        </Col>
        <Col xs={6} xl={3}>
          <StatCard
            icon="📅"
            value={new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            label="Report Period"
            bg="rgba(26,122,74,0.08)"
          />
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row className="g-3 mb-3">
        <Col xs={12} lg={6}>
          <div className="gc-chart-card">
            <div className="gc-chart-title">⚡ Energy Usage by Block (kWh)</div>
            <div style={{ height: 240 }}>
              <Bar data={energyBarData} options={chartOpts()} />
            </div>
          </div>
        </Col>
        <Col xs={12} lg={6}>
          <div className="gc-chart-card">
            <div className="gc-chart-title">💧 Water Usage by Block (Liters)</div>
            <div style={{ height: 240 }}>
              <Bar data={waterBarData} options={chartOpts()} />
            </div>
          </div>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row className="g-3 mb-3">
        <Col xs={12} lg={4}>
          <div className="gc-chart-card">
            <div className="gc-chart-title">♻️ Waste Recycling % by Block</div>
            <div style={{ height: 240 }}>
              <Doughnut
                data={wasteDonutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 8 } },
                    tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw}%` } }
                  }
                }}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} lg={4}>
          <div className="gc-chart-card">
            <div className="gc-chart-title">🏆 Sustainability Score by Block</div>
            <div style={{ height: 240 }}>
              <Bar
                data={sustainBarData}
                options={{
                  ...chartOpts(),
                  scales: {
                    ...chartOpts().scales,
                    y: { ...chartOpts().scales.y, min: 0, max: 10 }
                  }
                }}
              />
            </div>
          </div>
        </Col>
        <Col xs={12} lg={4}>
          <div className="gc-chart-card">
            <div className="gc-chart-title">🌫️ Carbon vs Tree Offset</div>
            <div style={{ height: 240 }}>
              <Doughnut
                data={carbonDonutData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 10 }, padding: 8 } }
                  }
                }}
              />
            </div>
          </div>
        </Col>
      </Row>

      {/* Monthly Trend */}
      {data.monthlyTrend.length > 0 && (
        <Row className="g-3">
          <Col xs={12}>
            <div className="gc-chart-card">
              <div className="gc-chart-title">📈 Monthly Sustainability Trend</div>
              <div style={{ height: 250 }}>
                <Line
                  data={trendLineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 14 } }
                    },
                    scales: {
                      x:  { grid: { display: false }, ticks: { font: { size: 10 } } },
                      y:  { grid: { color: 'rgba(0,0,0,0.05)' }, min: 0, max: 10, ticks: { font: { size: 10 } }, title: { display: true, text: 'Score' } },
                      y1: { position: 'right', grid: { display: false }, ticks: { font: { size: 10 } }, title: { display: true, text: 'kWh' } }
                    }
                  }}
                />
              </div>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
}
