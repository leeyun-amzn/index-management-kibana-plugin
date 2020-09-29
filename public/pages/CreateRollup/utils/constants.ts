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

export const DEFAULT_ROLLUP = JSON.stringify(
  {
    rollup: {
      source_index: "logstash-1", // or "log*" or "some-alias" or "logstash-*, something"
      target_index: "rollup-logstash",
      page_size: 100,
      delay: "10m",
      schedule: {
        interval: {
          start_time: 1553112384,
          period: 1,
          unit: "Hours",
        },
      },
      roles: ["super_role", "ops"],
      run_as_user: "drew",
      description: "Rolls up our daily logstash indices into monthly summarized views",
      last_updated_time: 1553112384,
      error_notification: {
        destination: { slack: { url: "..." } },
      },
      message_template: { source: "..." },
    },
    // fill in dimensions/metrics
  },
  null,
  4
);

export const TimeunitOptions = [
  { value: "ms", text: "Milliseconds" },
  { value: "s", text: "Seconds" },
  { value: "m", text: "Minutes" },
  { value: "h", text: "Hours" },
  { value: "d", text: "Days" },
];

export const TimezoneOptions = [
  { value: 12, text: "UTC +12" },
  { value: 11, text: "UTC +11" },
  { value: 10, text: "UTC +10" },
  { value: 9, text: "UTC +9" },
  { value: 8, text: "UTC +8" },
  { value: 7, text: "UTC +7" },
  { value: 6, text: "UTC +6" },
  { value: 5, text: "UTC +5" },
  { value: 4, text: "UTC +4" },
  { value: 3, text: "UTC +3" },
  { value: 2, text: "UTC +2" },
  { value: 1, text: "UTC +1" },
  { value: 0, text: "UTC +0" },
  { value: -1, text: "UTC -1" },
  { value: -2, text: "UTC -2" },
  { value: -3, text: "UTC -3" },
  { value: -4, text: "UTC -4" },
  { value: -5, text: "UTC -5" },
  { value: -6, text: "UTC -6" },
  { value: -7, text: "UTC -7" },
  { value: -8, text: "UTC -8" },
  { value: -9, text: "UTC -9" },
  { value: -10, text: "UTC -10" },
  { value: -11, text: "UTC -11" },
  { value: -12, text: "UTC -12" },
];