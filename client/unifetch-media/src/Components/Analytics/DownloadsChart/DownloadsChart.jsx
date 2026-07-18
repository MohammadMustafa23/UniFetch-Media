import "./DownloadsChart.css";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function DownloadsChart({ analytics }) {
  const data = analytics?.downloadsThisWeek || [];

  return (
    <section className="ufm-download-chart">
      <div className="ufm-download-chart-head">
        <h2>Downloads This Week</h2>
      </div>

      <div className="ufm-chart">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="downloads"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
