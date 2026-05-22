type Submission = {
  id: number;
  date: string;
  type: string;
  status: string;
  note: string;
};

type Props = {
  data: Submission[];
};

export default function SubmissionTable({ data }: Props) {
  return (
    <div className="table-box" id="history">
      <h3>Lịch sử nộp hồ sơ</h3>

      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Ngày nộp</th>
            <th>Loại hồ sơ</th>
            <th>Trạng thái</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.date}</td>
              <td>{item.type}</td>
              <td>{item.status}</td>
              <td>{item.note}</td>
              <td>
                <button className="action-btn">Xem</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}