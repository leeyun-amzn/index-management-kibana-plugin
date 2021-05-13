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
import {
  EuiForm,
  EuiFlexItem,
  EuiFormRow,
  EuiSelect,
  EuiPopoverTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiButtonEmpty,
  EuiCodeEditor,
  EuiButton,
  EuiFieldText,
  EuiText,
  EuiFieldNumber,
} from "@elastic/eui";
import { DATA_TYPES, FieldItem, IndexItem } from "../../../../../models/interfaces";
import { getOperators, isNullOperator, isNumericMapping, isRangeOperator, validateRange } from "../../utils/helpers";
import { WHERE_BOOLEAN_FILTERS } from "../../utils/constants";

interface IndexFilterPopoverProps {
  sourceIndex: { label: string; value?: IndexItem }[];
  fields: FieldItem[];
  sourceIndexFilter: string;
  onChangeSourceIndexFilter: (sourceIndexFilter: string) => void;
  closePopover: () => void;
}

export default function IndexFilterPopover({
  sourceIndex,
  fields,
  sourceIndexFilter,
  onChangeSourceIndexFilter,
  closePopover,
}: IndexFilterPopoverProps) {
  const [selectedField, setSelectedField] = useState("");
  const [selectedFieldType, setSelectedFieldType] = useState("number");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedBooleanValue, setSelectedBooleanValue] = useState("true");
  const [isCustomEditorOpen, setIsCustomEditorOpen] = useState(false);
  const [queryDsl, setQueryDsl] = useState(sourceIndexFilter);
  const [fieldRangeStart, setFieldRangeStart] = useState();
  const [fieldRangeEnd, setFieldRangeEnd] = useState();

  const onChangeSelectedField = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedField(e.target.value);
    const type = fields.find((acc) => {
      return acc.label === e.target.value;
    }).type;
    isNumericMapping(type) ? setSelectedFieldType("number") : setSelectedFieldType(type);
  };

  const onChangeSelectedOperator = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedOperator(e.target.value);
  };

  const renderBetweenAnd = () => {
    return (
      <EuiFlexGroup alignItems="center">
        <EuiFlexItem>
          <EuiFieldNumber
            name="where.fieldRangeStart"
            // validate={ value => validateRange(value, fieldRangeStart,fieldRangeEnd)}
            // onChange={ handleChangeWrapper, isInvalid }}
            value={fieldRangeStart}
            onChange={(e) => setFieldRangeStart(e.target.valueAsNumber)}
          />
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiText textAlign="center">to</EuiText>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiFieldNumber
            name="where.fieldRangeEnd"
            // fieldProps={{
            //   validate: value => validateRange(value, values.where),
            // }}
            // inputProps={{ onChange: this.handleChangeWrapper, isInvalid }}
            value={fieldRangeEnd}
            onChange={(e) => setFieldRangeEnd(e.target.valueAsNumber)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    );
  };

  const renderValueField = (fieldType: string, fieldOperator: string) => {
    if (fieldType == DATA_TYPES.NUMBER) {
      return isRangeOperator(fieldOperator) ? (
        renderBetweenAnd()
      ) : (
        <EuiFieldNumber
          name="where.fieldValue"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.valueAsNumber)}
          // fieldProps={{ validate: required }}
          // inputProps={{ onChange: this.handleChangeWrapper, isInvalid }}
        />
      );
    } else if (fieldType == DATA_TYPES.BOOLEAN) {
      return (
        <EuiSelect
          name="where.fieldValue"
          value={selectedBooleanValue}
          onChange={(e) => setSelectedBooleanValue(e.target.value)}
          // fieldProps={{ validate: required }}
          options={WHERE_BOOLEAN_FILTERS}
        />
      );
    } else {
      return (
        <EuiFieldText
          name="where.fieldValue"
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          // fieldProps={{ validate: required }}
          // inputProps={{ onChange: this.handleChangeWrapper, isInvalid }}
        />
      );
    }
  };

  function paramsEditor() {
    return (
      <div>
        <EuiFlexGroup>
          <EuiFlexItem grow={false}>
            <EuiFormRow label="Field">
              <EuiSelect
                id="selectField"
                options={fields.map((item) => {
                  return {
                    value: item.label,
                    text: item.label,
                  };
                })}
                value={selectedField}
                onChange={onChangeSelectedField}
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiFormRow label="Operator">
              <EuiSelect
                id="selectOperator"
                // options={[]}
                options={getOperators(selectedFieldType)}
                value={selectedOperator}
                onChange={onChangeSelectedOperator}
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        {!isNullOperator(selectedOperator) && (
          <EuiFormRow label="Value">
            <EuiFlexItem>{renderValueField(selectedFieldType, selectedOperator)}</EuiFlexItem>
          </EuiFormRow>
        )}
        {/*<EuiFlexItem>*/}
        {/*  <EuiFormRow label="Value">*/}
        {/*    /!*<EuiSelect id="selectValue" options={[]} value={selectedValue} onChange={onChangeSelectedValue} />*!/*/}
        {/*    <EuiFieldText value={selectedValue} onChange={onChangeSelectedValue}/>*/}
        {/*  </EuiFormRow>*/}
        {/*</EuiFlexItem>*/}
      </div>
    );
  }

  function customEditor() {
    return (
      <EuiFormRow label="Custom Query DSL">
        <EuiCodeEditor value={queryDsl} onChange={(string) => setQueryDsl(string)} mode="json" width="100%" height="250px" />
      </EuiFormRow>
    );
  }

  return (
    <div>
      <EuiPopoverTitle>
        <EuiFlexGroup alignItems="baseline" responsive={false}>
          <EuiFlexItem>Add data filter</EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty size="xs" onClick={() => setIsCustomEditorOpen(!isCustomEditorOpen)}>
              {isCustomEditorOpen ? "Edit filter values" : "Custom expression"}
            </EuiButtonEmpty>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiPopoverTitle>
      <EuiForm>
        {/*TODO: implement paramsEditor and uncomment the line below*/}
        {isCustomEditorOpen ? customEditor() : paramsEditor()}
        {/*{customEditor()}*/}
        <EuiSpacer />
        <EuiFlexGroup direction="rowReverse" alignItems="center" responsive={false}>
          <EuiFlexItem grow={false}>
            <EuiButton
              fill
              onClick={() => {
                onChangeSourceIndexFilter(queryDsl);
                closePopover();
              }}
              // isDisabled={!this.isFilterValid()}
              data-test-subj="saveFilter"
            >
              Save
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty flush="right" onClick={closePopover} data-test-subj="cancelSaveFilter">
              Cancel
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem />
        </EuiFlexGroup>
      </EuiForm>
    </div>
  );
}
