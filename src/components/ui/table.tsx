export default function Table({ columns, data }: any) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* TABLE SCROLL AREA */}
      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          {/* Header */}
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-b border-gray-200">
              {columns.map((column: any) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 text-left text-[13px] font-semibold text-gray-800 sm:px-5 sm:py-4"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row: any) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50"
              >
                {columns.map((column: any) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-4 py-3 align-middle text-sm text-gray-700 sm:px-5 sm:py-4"
                  >
                    {column.render
                      ? column.render(row)
                      : row[column.key]}
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