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

import React from "react";
import { EuiButtonIcon, EuiContextMenu, EuiContextMenuPanelDescriptor, EuiFlexGroup, EuiFlexItem, EuiPopover } from "@elastic/eui";
import { useState } from "react";
import { isNumericMapping } from "../../utils/helpers";
import { GROUP_TYPES, TransformGroupItem } from "../../../../../models/interfaces";
import HistogramPanel from "./Panels/HistogramPanel";
import PercentilePanel from "./Panels/PercentilePanel";

interface TransformOptionsProps {
  name: string;
  type?: string;
  selectedGroupField: TransformGroupItem[];
  onGroupSelectionChange: (name: string, selectedFields: TransformGroupItem[]) => void;
  selectedAggregations: any;
  onAggregationSelectionChange: (name: string, selectedFields: any) => void;
  groupAggList: string[];
}

export default function TransformOptions({
  name,
  type,
  selectedGroupField,
  onGroupSelectionChange,
  selectedAggregations,
  onAggregationSelectionChange,
  groupAggList,
}: TransformOptionsProps) {
  const isNumeric = isNumericMapping(type);
  const isDate = type == "date";

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [groupSelection, setGroupSelection] = useState<TransformGroupItem[]>(selectedGroupField);
  const [aggSelection, setAggSelection] = useState(selectedAggregations);

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const handleGroupSelectionChange = (name: string, newGroupItem: TransformGroupItem): void => {
    groupAggList.push(name);
    groupSelection.push(newGroupItem);
    onGroupSelectionChange(name, groupSelection);
    setGroupSelection(selectedGroupField);
    closePopover();

    //Debug use
    console.log("groupagglist: " + groupAggList);
  };
  const handleAggSelectionChange = (name: string): void => {
    groupAggList.push(name);
    onAggregationSelectionChange(name, aggSelection);
    setAggSelection(selectedAggregations);
    closePopover();
    //Debug use
    console.log("groupagglist: " + groupAggList);
  };

  const panels: EuiContextMenuPanelDescriptor[] = [
    {
      id: 0,
      title: "Transform options",
      items: [
        {
          name: "Group by histogram",
          panel: 1,
        },
        {
          name: "Group by date histogram",
          panel: 2,
        },
        {
          name: "Group by terms",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.terms}`;
            handleGroupSelectionChange(targetField, {
              terms: {
                source_field: name,
                target_field: targetField,
              },
            });
          },
        },
        {
          name: "Aggregate by sum",
          onClick: () => {
            const targetField = `sum_${name}`;
            aggSelection[targetField] = {
              sum: { field: name },
            };
            handleAggSelectionChange(targetField);
          },
        },
        {
          name: "Aggregate by max",
          onClick: () => {
            const targetField = `max_${name}`;
            aggSelection[targetField] = {
              max: { field: name },
            };
            handleAggSelectionChange(targetField);
          },
        },
        {
          name: "Aggregate by min",
          onClick: () => {
            const targetField = `min_${name}`;
            aggSelection[targetField] = {
              min: { field: name },
            };
            handleAggSelectionChange(targetField);
          },
        },
        {
          name: "Aggregate by avg",
          onClick: () => {
            const targetField = `avg_${name}`;
            aggSelection[targetField] = {
              avg: { field: name },
            };
            handleAggSelectionChange(targetField);
          },
        },
        {
          name: "Aggregate by count",
          onClick: () => {
            const targetField = `count_${name}`;
            aggSelection[targetField] = {
              value_count: { field: name },
            };
            handleAggSelectionChange(targetField);
          },
        },
        {
          name: "Aggregate by percentile",
          panel: 3,
        },
        {
          name: "Aggregate by scripted metrics",
          panel: 4,
        },
      ],
    },
    {
      id: 1,
      title: "Back",
      content: <HistogramPanel name={name} handleGroupSelectionChange={handleGroupSelectionChange} closePopover={closePopover} />,
    },
    {
      id: 2,
      title: "Back",
      items: [
        {
          name: "Millisecond",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_millisecond`;
            handleGroupSelectionChange({
              date_histogram: {
                source_field: name,
                target_field: targetField,
                fixed_interval: "1ms",
              },
            });
          },
        },
        {
          name: "Second",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_second`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                fixed_interval: "1s",
              },
            });
          },
        },
        {
          name: "Minute",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_minute`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                fixed_interval: "1m",
              },
            });
          },
        },
        {
          name: "Hour",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_hour`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                fixed_interval: "1h",
              },
            });
          },
        },
        {
          name: "Day",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_day`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                calendar_interval: "1d",
              },
            });
          },
        },
        {
          name: "Week",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_week`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                calendar_interval: "1w",
              },
            });
          },
        },
        {
          name: "Month",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_month`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                calendar_interval: "1M",
              },
            });
          },
        },
        {
          name: "Quarter",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_quarter`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                calendar_interval: "1q",
              },
            });
          },
        },
        {
          name: "Year",
          onClick: () => {
            const targetField = `${name}_${GROUP_TYPES.dateHistogram}_year`;
            handleGroupSelectionChange(targetField, {
              date_histogram: {
                source_field: name,
                target_field: targetField,
                calendar_interval: "1y",
              },
            });
          },
        },
      ],
    },
    {
      id: 3,
      title: "Back",
      content: (
        <PercentilePanel
          name={name}
          aggSelection={aggSelection}
          handleAggSelectionChange={handleAggSelectionChange}
          closePopover={closePopover}
        />
      ),
    },
    {
      id: 4,
      title: "Back",
    },
  ];

  const button = <EuiButtonIcon iconType="plusInCircleFilled" onClick={() => setIsPopoverOpen(!isPopoverOpen)} />;

  return (
    <div>
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem grow={false}>{name}</EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiPopover
            id="contextMenuExample"
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="rightCenter"
          >
            <EuiContextMenu initialPanelId={0} panels={panels} />
          </EuiPopover>
        </EuiFlexItem>
      </EuiFlexGroup>
    </div>
  );
}
