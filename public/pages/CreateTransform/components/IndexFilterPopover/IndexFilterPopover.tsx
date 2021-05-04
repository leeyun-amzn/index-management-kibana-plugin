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

import React, { ChangeEvent, useState } from "react";
import { EuiForm, EuiFlexItem, EuiFormRow, EuiSelect, EuiFlexGroup } from "@elastic/eui";
import { FieldItem } from "../../../../../models/interfaces";
import { getOperators } from "../../../CreateRollup/utils/helpers";

interface IndexFilterPopoverProps {
  fields: FieldItem[];
  selectedField: string;
  setSelectedField: () => void;
}

export default function IndexFilterPopover({ fields }: IndexFilterPopoverProps) {
  const [selectedField, setSelectedField] = useState();
  const [selectedOperator, setSelectedOperator] = useState("");

  const onChangeSelectedField = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedField(e.target.value);
  };
  const onChangeSelectedOperator = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedOperator(e.target.value);
  };

  return (
    <EuiForm>
      <EuiFlexGroup />
      <EuiFlexItem grow={false}>
        <EuiFormRow label="Field">
          <EuiSelect
            id="selectField"
            placeholder="Select Field"
            options={fields.map((item) => {
              return {
                value: item.label,
                text: item.label,
              };
            })} // Needs options from source index
            value={selectedField}
            onChange={onChangeSelectedField}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiFormRow label="Operator">
          <EuiSelect
            id="selectOperator"
            placeholder="Select Field"
            options={getOperators(selectedField?.type)} // Needs options from source index
            value={selectedOperator}
            onChange={onChangeSelectedOperator}
          />
        </EuiFormRow>
      </EuiFlexItem>
      <EuiFlexGroup />
      <EuiFlexItem>Value</EuiFlexItem>
    </EuiForm>
  );
}
