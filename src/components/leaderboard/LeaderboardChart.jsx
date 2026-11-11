import PropTypes from 'prop-types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const COLORS = ['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

function LeaderboardChart({ items }) {
  if (!items || items.length === 0) return null;

  // Mengambil 5 pengguna teratas untuk visualisasi grafik
  const topItems = items.slice(0, 5).map((item) => ({
    name: item.user.name,
    score: item.score,
  }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
      <h2 className="text-base font-semibold text-gray-800 mb-3">
        Top 5 Users Overview
      </h2>
      <div className="w-full h-56" data-testid="leaderboard-chart">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topItems}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 20,
            }}
          >
            <XAxis
              dataKey="name"
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              interval={0}
              angle={-15}
              textAnchor="end"
            />
            <YAxis
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                borderColor: '#e5e7eb',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                fontSize: '12px',
              }}
              formatter={(val) => [`${val} pts`, 'Score']}
            />
            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {topItems.map((entry, index) => (
                <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

LeaderboardChart.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      }).isRequired,
      score: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default LeaderboardChart;
