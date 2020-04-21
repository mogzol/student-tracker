import React from "react";
import SimpleBar from "simplebar-react";
import DateString from "components/DateString/DateString";
import classNames from "classnames";
import Modal from "components/Modal/Modal";
import "./List.scss";

export interface Column<T> {
  title: string;
  field: keyof T;
  sortable: boolean;
  width: number;
  renderer?: (data: T) => JSX.Element;
}

interface Props<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
  initialSortField?: keyof T;
  initialSortDir?: "asc" | "desc";
  deleteText?: string;
  deleteModalText?: (row: T) => string | JSX.Element;
  onSelected?: (row: T) => void;
  onDelete?: (row: T) => void;
}

export default function List<T>(props: Props<T>) {
  const [sortField, setSortField] = React.useState<keyof T | null>(
    props.initialSortField ?? null
  );

  const [sortDir, setSortDir] = React.useState<"asc" | "desc">(
    props.initialSortDir ?? "asc"
  );

  const [deleteRow, setDeleteRow] = React.useState<T | null>(null);

  const sortedRows = React.useMemo<T[]>(() => {
    if (!sortField) {
      return props.data;
    }

    let sortFunc: ((a: T, b: T) => number) | null = null;

    // Find first defined sort element
    const sortEl = props.data.find((d) => d[sortField])?.[sortField];

    if (sortEl instanceof Date) {
      sortFunc = (a, b) => {
        const aDate = (a[sortField] as unknown) as Date;
        const bDate = (b[sortField] as unknown) as Date;

        // Dates might not be set if no communications
        if (aDate && !bDate) return 1;
        if (!aDate && bDate) return -1;
        if (!aDate && bDate) return 0;
        return aDate.getTime() - bDate.getTime();
      };
    } else if (typeof sortEl === "string") {
      sortFunc = (a, b) => {
        const aStr = (a[sortField] as unknown) as string;
        const bStr = (b[sortField] as unknown) as string;

        return aStr.localeCompare(bStr);
      };
    }

    if (sortFunc) {
      if (sortDir === "desc") {
        const origSortFunc = sortFunc;
        sortFunc = (a: any, b: any) => origSortFunc(b, a);
      }

      return props.data.sort(sortFunc);
    } else {
      return props.data;
    }
  }, [props.data, sortField, sortDir]);

  function handleSort(column: Column<T>) {
    if (!column.sortable) {
      return;
    }

    if (sortField === column.field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(column.field);
      setSortDir("asc");
    }
  }

  function handleDelete(e: React.MouseEvent, row: T) {
    e.stopPropagation();
    setDeleteRow(row);
  }

  function handleConfirmDelete() {
    props.onDelete?.(deleteRow as T);
    setDeleteRow(null);
  }

  return (
    <div className="component list fill">
      <div className="headers">
        {props.columns.map((col, i) => (
          <div
            key={i}
            className={classNames("col", {
              sortable: col.sortable,
              sorted: col.field === sortField,
            })}
            style={{ flexGrow: col.width }}
            title={col.sortable ? "Click to sort" : undefined}
            onClick={() => handleSort(col)}
          >
            {col.title}
            {col.sortable && (
              <i
                className={classNames(
                  "fas sort-arrow",
                  sortDir === "desc" ? "fa-arrow-up" : "fa-arrow-down"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <SimpleBar className="rows">
        {sortedRows.map((row, i) => (
          <div
            key={props.rowKey?.(row) ?? i}
            className="row"
            onClick={() => props.onSelected?.(row)}
          >
            {props.columns.map((col, i) => {
              let colVal: any = row[col.field];

              if (col.renderer) {
                colVal = col.renderer(row);
              } else if (colVal instanceof Date) {
                colVal = <DateString date={colVal} />;
              }

              return (
                <div
                  key={i}
                  className={classNames("col", col.field as string)}
                  style={{ flexGrow: col.width }}
                >
                  <div className="content">{colVal}</div>
                </div>
              );
            })}
            {props.onDelete && (
              <div
                className="delete"
                title={props.deleteText ?? "Delete"}
                onClick={(e) => handleDelete(e, row)}
              >
                <i className="fas fa-trash" />
              </div>
            )}
          </div>
        ))}
      </SimpleBar>
      {deleteRow && (
        <Modal
          onClose={() => setDeleteRow(null)}
          onDelete={handleConfirmDelete}
        >
          {props.deleteModalText
            ? props.deleteModalText(deleteRow)
            : "Are you sure you want to delete this entry?"}
        </Modal>
      )}
    </div>
  );
}
