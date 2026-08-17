type TableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TableProps<T extends { id: string }> = {
  columns: TableColumn<T>[];
  data: T[];
};

export default function Table<T extends { id: string }>({
  columns,
  data,
}: TableProps<T>) {
  return (
    <div className="w-full overflow-hidden border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  className="whitespace-nowrap px-6 py-4 text-left text-[13px] font-semibold text-gray-800"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 transition-colors last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key.toString()}
                    className="whitespace-nowrap px-6 py-4 align-middle text-sm text-gray-700"
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
