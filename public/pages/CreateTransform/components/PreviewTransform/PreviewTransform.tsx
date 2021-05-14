/*
 * Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import React, { useCallback, useState } from "react";
import { EuiDataGrid, EuiDataGridColumn } from "@elastic/eui";
import PreviewEmptyPrompt from "../PreviewEmptyPrompt";

interface PreviewTransformProps {
  previewTransform: any[];
  groupAggList: string[];
  isReadOnly: boolean;
}

export default function PreviewTransform({ previewTransform, groupAggList, isReadOnly }: PreviewTransformProps) {
  const [previewColumns, setPreviewColumns] = useState<EuiDataGridColumn[]>([]);
  const [visiblePreviewColumns, setVisiblePreviewColumns] = useState(() => previewColumns.map(({ id }) => id).slice(0, 5));
  const [previewPagination, setPreviewPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const renderPreviewCellValue = ({ rowIndex, columnId }) => {
    if (previewTransform.hasOwnProperty(rowIndex)) {
      return previewTransform[rowIndex][columnId] ? previewTransform[rowIndex][columnId] : "-";
    }
    return "-";
  };
  const onChangePreviewPerPage = useCallback(
    (pageSize) => {
      setPreviewPagination((previewPagination) => ({
        ...previewPagination,
        pageSize,
        pageIndex: 0,
      }));
    },
    [setPreviewPagination]
  );

  const onChangePreviewPage = useCallback(
    (pageIndex) => {
      setPreviewPagination((previewPagination) => ({ ...previewPagination, pageIndex }));
    },
    [setPreviewPagination]
  );

  const updatePreviewColumns = (): void => {
    //Attempt to show columns by the groups selected and aggregations selected instead of using preview column result.
    let tempCol: EuiDataGridColumn[] = [];
    if (!isReadOnly) {
      //Debug use
      console.log("Updating preview columns using groupAggList");
      groupAggList.map((item) => {
        tempCol.push({
          id: item,
          actions: {
            showHide: false,
            showMoveLeft: false,
            showMoveRight: false,
            showSortAsc: false,
            showSortDesc: false,
          },
        });
      });
      setPreviewColumns(tempCol);
      setVisiblePreviewColumns(() => tempCol.map(({ id }) => id).slice(0, 5));
    } else {
      //Using preview result
      if (previewTransform.length) {
        //Debug use
        console.log("Updating preview columns using previewTransform");
        for (const [key, value] of Object.entries(previewTransform[0])) {
          tempCol.push({
            id: key,
            actions: {
              showHide: false,
              showMoveLeft: false,
              showMoveRight: false,
              showSortAsc: false,
              showSortDesc: false,
            },
          });
        }
        setPreviewColumns(tempCol);
        setVisiblePreviewColumns(() => tempCol.map(({ id }) => id).slice(0, 5));
      }
    }
  };

  React.useEffect(() => {
    updatePreviewColumns();
  }, [previewTransform]);

  return previewTransform.length ? (
    <EuiDataGrid
      aria-label="Preview transforms"
      columns={previewColumns}
      columnVisibility={{ visibleColumns: visiblePreviewColumns, setVisibleColumns: setVisiblePreviewColumns }}
      rowCount={previewTransform.length}
      renderCellValue={renderPreviewCellValue}
      pagination={{
        ...previewPagination,
        pageSizeOptions: [5, 10, 20, 50],
        onChangeItemsPerPage: onChangePreviewPerPage,
        onChangePage: onChangePreviewPage,
      }}
      toolbarVisibility={{
        showColumnSelector: true,
        showStyleSelector: false,
        showSortSelector: false,
        showFullScreenSelector: false,
      }}
    />
  ) : (
    <PreviewEmptyPrompt />
  );
}
