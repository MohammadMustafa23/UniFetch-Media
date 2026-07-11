import "./DownloadsChart.css";

const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function DownloadsChart() {
  return (
    <section className="ufm-download-chart">
      <div className="ufm-download-chart-head">
        <h2>Downloads this week</h2>
      </div>

      <div className="ufm-chart-placeholder">{/* Chart will come here */}</div>

      <div className="ufm-chart-days">
        {days.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
    </section>
  );
}
