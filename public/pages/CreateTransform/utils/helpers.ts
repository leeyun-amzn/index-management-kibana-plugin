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

import { DATA_TYPES, FieldItem } from "../../../../models/interfaces";
import { COMPARISON_OPERATORS, OPERATORS_MAP } from "./constants";

export const parseTimeunit = (timeunit: string): string => {
  if (timeunit == "ms" || timeunit == "Milliseconds") return "millisecond(s)";
  else if (timeunit == "SECONDS" || timeunit == "s" || timeunit == "Seconds") return "second(s)";
  else if (timeunit == "MINUTES" || timeunit == "m" || timeunit == "Minutes") return "minute(s)";
  else if (timeunit == "HOURS" || timeunit == "h" || timeunit == "Hours") return "hour(s)";
  else if (timeunit == "DAYS" || timeunit == "d" || timeunit == "Days") return "day(s)";
  else if (timeunit == "w") return "week";
  else if (timeunit == "M") return "month";
  else if (timeunit == "q") return "quarter";
  else if (timeunit == "y") return "year";

  return timeunit;
};

//Returns true if field type is numeric
export const isNumericMapping = (fieldType: string | undefined): boolean => {
  return (
    fieldType == "long" ||
    fieldType == "integer" ||
    fieldType == "short" ||
    fieldType == "byte" ||
    fieldType == "double" ||
    fieldType == "float" ||
    fieldType == "half_float" ||
    fieldType == "scaled_float"
  );
};

export const compareFieldItem = (itemA: FieldItem, itemB: FieldItem): boolean => {
  return itemB.label == itemA.label && itemA.type == itemB.type;
};

export const parseFieldOptions = (prefix: string, mappings: any): FieldItem[] => {
  let fieldsOption: FieldItem[] = [];
  for (let field in mappings) {
    if (mappings.hasOwnProperty(field)) {
      if (mappings[field].type != "object" && mappings[field].type != null && mappings[field].type != "nested")
        fieldsOption.push({ label: prefix + field, type: mappings[field].type });
      if (mappings[field].fields != null)
        fieldsOption = fieldsOption.concat(parseFieldOptions(prefix + field + ".", mappings[field].fields));
      if (mappings[field].properties != null)
        fieldsOption = fieldsOption.concat(parseFieldOptions(prefix + field + ".", mappings[field].properties));
    }
  }
  return fieldsOption;
};

export const getOperators = (fieldType: string) =>
  COMPARISON_OPERATORS.reduce(
    (acc, currentOperator) =>
      currentOperator.dataTypes.includes(fieldType) ? [...acc, { text: currentOperator.text, value: currentOperator.value }] : acc,
    []
  );

export const isRangeOperator = (selectedOperator) => [OPERATORS_MAP.IN_RANGE, OPERATORS_MAP.NOT_IN_RANGE].includes(selectedOperator);

export const isNullOperator = (selectedOperator) => [OPERATORS_MAP.IS_NULL, OPERATORS_MAP.IS_NOT_NULL].includes(selectedOperator);

export const OPERATORS_QUERY_MAP = {
  [OPERATORS_MAP.IS]: {
    query: ({ fieldName: [{ label, type }], fieldValue }) =>
      type === DATA_TYPES.TEXT ? { match_phrase: { [label]: fieldValue } } : { term: { [label]: fieldValue } },
  },
  [OPERATORS_MAP.IS_NOT]: {
    query: ({ fieldName: [{ label, type }], fieldValue }) =>
      type === DATA_TYPES.TEXT
        ? {
            bool: { must_not: { match_phrase: { [label]: fieldValue } } },
          }
        : {
            bool: { must_not: { term: { [label]: fieldValue } } },
          },
  },
  [OPERATORS_MAP.IS_NULL]: {
    query: ({ fieldName: [{ label: fieldKey }] }) => ({
      bool: { must_not: { exists: { field: fieldKey } } },
    }),
  },
  [OPERATORS_MAP.IS_NOT_NULL]: {
    query: ({ fieldName: [{ label: fieldKey }] }) => ({ exists: { field: fieldKey } }),
  },
  [OPERATORS_MAP.IS_GREATER]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldValue }) => ({
      range: { [fieldKey]: { gt: fieldValue } },
    }),
  },

  [OPERATORS_MAP.IS_GREATER_EQUAL]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldValue }) => ({
      range: { [fieldKey]: { gte: fieldValue } },
    }),
  },
  [OPERATORS_MAP.IS_LESS]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldValue }) => ({
      range: { [fieldKey]: { lt: fieldValue } },
    }),
  },

  [OPERATORS_MAP.IS_LESS_EQUAL]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldValue }) => ({
      range: { [fieldKey]: { lte: fieldValue } },
    }),
  },

  [OPERATORS_MAP.IN_RANGE]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldRangeStart, fieldRangeEnd }) => ({
      range: { [fieldKey]: { gte: fieldRangeStart, lte: fieldRangeEnd } },
    }),
  },
  [OPERATORS_MAP.NOT_IN_RANGE]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldRangeStart, fieldRangeEnd }) => ({
      bool: { must_not: { range: { [fieldKey]: { gte: fieldRangeStart, lte: fieldRangeEnd } } } },
    }),
  },

  [OPERATORS_MAP.STARTS_WITH]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldValue }) => ({
      prefix: { [fieldKey]: fieldValue },
    }),
  },

  [OPERATORS_MAP.ENDS_WITH]: {
    query: ({ fieldName: [{ label: fieldKey }], fieldValue }) => ({
      wildcard: { [fieldKey]: `*${fieldValue}` },
    }),
  },
  [OPERATORS_MAP.CONTAINS]: {
    query: ({ fieldName: [{ label, type }], fieldValue }) =>
      type === DATA_TYPES.TEXT
        ? {
            query_string: { query: `*${fieldValue}*`, default_field: label },
          }
        : {
            wildcard: { [label]: `*${fieldValue}*` },
          },
  },
  [OPERATORS_MAP.NOT_CONTAINS]: {
    query: ({ fieldName: [{ label, type }], fieldValue }) =>
      type === DATA_TYPES.TEXT
        ? {
            bool: {
              must_not: { query_string: { query: `*${fieldValue}*`, default_field: label } },
            },
          }
        : {
            bool: { must_not: { wildcard: { [label]: `*${fieldValue}*` } } },
          },
  },
};

export const validateRange = (value, whereFilters) => {
  if (value === "") return "Required";
  if (whereFilters.fieldRangeEnd < value) {
    return "Start should be less than end range";
  }
  if (value < whereFilters.fieldRangeStart) {
    return "End should be greater than start range";
  }
};
