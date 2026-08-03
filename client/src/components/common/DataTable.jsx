import React, { useState } from 'react';
import clsx from 'clsx';
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './Button';
import { Dropdown } from './Dropdown';

export const DataTable = ({
  columns = [],
  data = [],
  pagination,
  sorting,
  rowActions = [],
  selectable = false,
  onRowSelect,
  emptyState,
  isLoading = false,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((row) => row.id || row._id);
      setSelectedIds(allIds);
      if (onRowSelect) onRowSelect(allIds);
    } else {
      setSelectedIds([]);
      if (onRowSelect) onRowSelect([]);
    }
  };

  const handleSelectRow = (id) => {
    let updated;
    if (selectedIds.includes(id)) {
      updated = selectedIds.filter((item) => item !== id);
    } else {
      updated = [...selectedIds, id];
    }
    setSelectedIds(updated);
    if (onRowSelect) onRowSelect(updated);
  };

  const totalPages = pagination ? Math.ceil(pagination.total / pagination.limit) : 0;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Table Shell */}
      <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-205 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold sticky top-0 z-10">
            <tr>
              {selectable && (
                <th className="px-6 py-4 w-12">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={handleSelectAll}
                    className="h-4.5 w-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
              )}
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  onClick={() => {
                    if (col.sortable && sorting) {
                      const dir =
                        sorting.key === col.key && sorting.direction === 'asc' ? 'desc' : 'asc';
                      sorting.onSort(col.key, dir);
                    }
                  }}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />}
                  </div>
                </th>
              ))}
              {rowActions.length > 0 && <th className="px-6 py-4 w-16 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center text-slate-400">
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions.length > 0 ? 1 : 0)} className="px-6 py-12 text-center text-slate-400">
                  {emptyState || 'No records found.'}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const id = row.id || row._id || idx;
                const isSelected = selectedIds.includes(id);
                return (
                  <tr
                    key={id}
                    className={clsx(
                      'hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors',
                      isSelected && 'bg-primary-50/30 dark:bg-primary-950/10'
                    )}
                  >
                    {selectable && (
                      <td className="px-6 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(id)}
                          className="h-4.5 w-4.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-3.5">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                    {rowActions.length > 0 && (
                      <td className="px-6 py-3.5 text-right">
                        <Dropdown
                          align="right"
                          trigger={
                            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg">
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          }
                          items={rowActions.map((action) => ({
                            ...action,
                            onClick: () => action.onClick(row),
                          }))}
                        />
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-semibold">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-semibold">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span>{' '}
            of <span className="font-semibold">{pagination.total}</span> entries
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              return (
                <Button
                  key={p}
                  variant={pagination.page === p ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => pagination.onPageChange(p)}
                >
                  {p}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page === totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
