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
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      {/* Table scroll area */}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
        <table className="w-full min-w-[1100px] border-collapse">
          {/* Header */}
          <thead className="sticky top-0 z-10 bg-white dark:bg-gray-900">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key.toString()}
                  className="whitespace-nowrap px-6 py-4 text-left text-[13px] font-semibold text-gray-800 dark:text-gray-200"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-900">
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800"
              >
                {columns.map((column) => (
                  <td
                    key={column.key.toString()}
                    className="whitespace-nowrap px-4 py-3 align-middle text-sm text-gray-700 dark:text-gray-300 sm:px-5 sm:py-4"
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