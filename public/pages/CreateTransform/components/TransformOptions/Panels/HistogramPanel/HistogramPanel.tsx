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

import { GROUP_TYPES, TransformGroupItem } from "../../../../../../../models/interfaces";
import React, { useState } from "react";
import { EuiButton, EuiFieldNumber, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiPanel } from "@elastic/eui";
interface HistogramPanelProps {
  name: string;
  handleGroupSelectionChange: (name: string, newGroupItem: TransformGroupItem) => void;
  closePopover: () => void;
}

export default function HistogramPanel({ name, handleGroupSelectionChange, closePopover }: HistogramPanelProps) {
  const [histogramInterval, setHistogramInterval] = useState(5);

  return (
    <EuiPanel>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiFormRow label="Histogram interval">
            <EuiFieldNumber value={histogramInterval} onChange={(e) => setHistogramInterval(e.target.valueAsNumber)} />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={false}></EuiFlexItem>
      </EuiFlexGroup>
      <EuiFlexGroup>
        <EuiFlexItem grow={false}>
          <EuiButton fullWidth={false} onClick={() => closePopover()}>
            Cancel
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            fill
            fullWidth={false}
            onClick={() => {
              const targetField = `${name} _${GROUP_TYPES.histogram}`;
              handleGroupSelectionChange(targetField, {
                histogram: {
                  source_field: name,
                  target_field: targetField,
                  interval: histogramInterval,
                },
              });
            }}
          >
            OK
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPanel>
  );
}
