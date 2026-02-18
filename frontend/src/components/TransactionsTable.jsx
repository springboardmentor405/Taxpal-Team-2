function TransactionsTable() {
  return (
    <div className="transactions-card">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>May 8, 2025</td>
            <td>Design Project</td>
            <td>Consulting</td>
            <td>$1200</td>
            <td>Income</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TransactionsTable;