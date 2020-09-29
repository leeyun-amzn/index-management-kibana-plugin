/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import React, { ChangeEvent, Component } from "react";
import { EuiSpacer, EuiBasicTable } from "@elastic/eui";
import { ContentPanel } from "../../../../components/ContentPanel";

interface AdvancedAggregationProps {
  rollupId: string;
  rollupIdError: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

const columns = [
  {
    field: "fieldname",
    name: "Field Name",
    sortable: true,
  },
  {
    field: "fieldType",
    name: "Field Type",
    truncateText: true,
  },
  {
    field: "aggregationMethod",
    name: "Aggregation method",
  },
  {
    field: "histogramInterval",
    name: "Histogram Interval",
  },
  {
    field: "actions",
    name: "Actions",
  },
];

export default class AdvancedAggregation extends Component<AdvancedAggregationProps> {
  render() {
    return (
      <ContentPanel bodyStyles={{ padding: "initial" }} title="Advanced aggregation - optional" titleSize="s">
        <div style={{ paddingLeft: "10px" }}>
          <EuiBasicTable items={[]} rowHeader="fieldName" columns={columns} />
          <EuiSpacer size="s" />
        </div>
      </ContentPanel>
    );
  }
}