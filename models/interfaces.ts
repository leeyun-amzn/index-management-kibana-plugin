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

// TODO: Backend has PR out to change this model, this needs to be updated once that goes through
export interface ManagedIndexMetaData {
  index: string;
  indexUuid: string;
  policyId: string;
  policySeqNo?: number;
  policyPrimaryTerm?: number;
  policyCompleted?: boolean;
  rolledOver?: boolean;
  transitionTo?: string;
  state?: { name: string; startTime: number };
  action?: { name: string; startTime: number; index: number; failed: boolean; consumedRetries: number };
  retryInfo?: { failed: boolean; consumedRetries: number };
  info?: object;
}

/**
 * ManagedIndex item shown in the Managed Indices table
 */
export interface ManagedIndexItem {
  index: string;
  indexUuid: string;
  policyId: string;
  policySeqNo: number;
  policyPrimaryTerm: number;
  policy: Policy | null;
  enabled: boolean;
  managedIndexMetaData: ManagedIndexMetaData | null;
}

export interface IndexItem {
  index: string;
}

/**
 * Interface what the Policy Elasticsearch Document
 */
export interface DocumentPolicy {
  id: string;
  primaryTerm: number;
  seqNo: number;
  policy: Policy;
}

export interface DocumentRollup {
  id: string;
  primaryTerm: number;
  seqNo: number;
  rollup: Rollup;
}

// TODO: Fill out when needed
// TODO: separate a frontend Policy from backendPolicy
export interface Policy {
  description: string;
  default_state: string;
  states: State[];
}

export interface State {
  name: string;
  actions: object[];
  transitions: object[];
}

export interface Rollup {
  id: string;
  seq_no: number;
  primary_Term: number;
  rollup: {
    continuous: boolean;
    delay?: number;
    description?: string;
    dimensions: [
      {
        date_histogram: [
          {
            source_field: string;
            fixed_interval: string;
            timezone: string;
          }
        ];
      }
    ];
    enabled: boolean;
    enabled_time?: number;
    last_updated_time: number;
    metadata_id?: number;
    metrics: [];
    page_size: number;
    roles: [];
    schedule: {
      interval?: {
        start_time: number;
        period: number;
        unit: string;
      };
      cron?: {
        expression: string;
        timezone?: string;
      };
    };
    schema_version: number;
    source_index: string;
    target_index: string;
  };
}
