type Props = {
  title: string;
  value: string;
};

export default function StatusCard({ title, value }: Props) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p style={{ fontSize: 16, fontWeight: "bold", color: "#111" }}>{value}</p>
    </div>
  );
}