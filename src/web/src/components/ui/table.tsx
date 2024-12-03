/**
 * Human Tasks:
 * 1. Verify table accessibility with screen readers
 * 2. Test table responsiveness across different viewport sizes
 * 3. Validate table sorting functionality with large datasets
 * 4. Ensure table styling matches design system guidelines
 */

// React v18.0.0
import React, { useState, useCallback, useMemo } from 'react';

// classnames v2.3.1
import classNames from 'classnames';

// Internal imports
import { theme } from '../../theme/index';
import { deepClone } from '../../lib/utils';
import type { CommonError } from '../../types/common';

// Requirement: Type Safety (9.1 Programming Languages/Frontend)
interface TableColumn<T> {
  key: keyof T;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  sortable?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  error?: CommonError;
}

// Requirement: UI Consistency (8.1 User Interface Design/Design Specifications/Visual Hierarchy)
const tableStyles = {
  wrapper: 'w-full overflow-x-auto',
  table: 'min-w-full divide-y divide-gray-200',
  header: {
    row: 'bg-gray-50',
    cell: classNames(
      'px-6 py-3',
      'text-left text-xs font-medium',
      'text-gray-500 uppercase tracking-wider'
    ),
    sortable: 'cursor-pointer hover:bg-gray-100',
  },
  body: {
    row: classNames(
      'bg-white',
      'transition-colors duration-150 ease-in-out'
    ),
    cell: classNames(
      'px-6 py-4',
      'whitespace-nowrap',
      'text-sm text-gray-900'
    ),
    striped: 'even:bg-gray-50',
    hoverable: 'hover:bg-gray-50',
    clickable: 'cursor-pointer',
  },
  loading: 'animate-pulse bg-gray-100',
  error: 'text-red-500 text-center py-4',
  empty: 'text-gray-500 text-center py-4',
};

// Requirement: Code Reusability (1.3 Scope/Core Features and Functionalities/User Management)
export function Table<T extends Record<string, any>>({
  columns,
  data,
  className,
  striped = false,
  hoverable = false,
  bordered = false,
  compact = false,
  sortable = false,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  error,
}: TableProps<T>): JSX.Element {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Sort data when sortConfig changes
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const sorted = deepClone(data);
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  // Handle column header click for sorting
  const handleSort = useCallback((key: keyof T) => {
    if (!sortable) return;

    setSortConfig((currentSort) => {
      if (currentSort?.key === key) {
        return currentSort.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  }, [sortable]);

  // Render loading state
  if (loading) {
    return (
      <div className={tableStyles.wrapper}>
        <table className={classNames(tableStyles.table, className)}>
          <thead className={tableStyles.header.row}>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={tableStyles.header.cell}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(3)].map((_, index) => (
              <tr key={index} className={tableStyles.loading}>
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={tableStyles.body.cell}
                  >
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={tableStyles.error}>
        {error.message || 'An error occurred while loading the data.'}
      </div>
    );
  }

  // Render empty state
  if (!data.length) {
    return (
      <div className={tableStyles.empty}>
        {emptyMessage}
      </div>
    );
  }

  // Render table
  return (
    <div className={tableStyles.wrapper}>
      <table 
        className={classNames(
          tableStyles.table,
          className,
          bordered && 'border border-gray-200',
          compact && 'table-compact'
        )}
      >
        <thead className={tableStyles.header.row}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={classNames(
                  tableStyles.header.cell,
                  sortable && tableStyles.header.sortable
                )}
                style={{ width: column.width }}
                onClick={() => handleSort(column.key)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.header}</span>
                  {sortable && sortConfig?.key === column.key && (
                    <span>
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={classNames(
                tableStyles.body.row,
                striped && tableStyles.body.striped,
                hoverable && tableStyles.body.hoverable,
                onRowClick && tableStyles.body.clickable
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={classNames(
                    tableStyles.body.cell,
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}