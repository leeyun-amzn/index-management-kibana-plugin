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
import {
  EuiSpacer,
  EuiCheckbox,
  EuiRadioGroup,
  EuiFormRow,
  EuiDatePicker,
  EuiSelect,
  EuiFieldNumber,
  EuiFlexGroup,
  EuiFlexItem,
  EuiTextArea,
} from "@elastic/eui";
import { ContentPanel } from "../../../../components/ContentPanel";
import moment, { Moment } from "moment";
import { TimeunitOptions, TimezoneOptions } from "../../utils/constants";

interface ScheduleProps {
  rollupId: string;
  rollupIdError: string;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

interface ScheduleState {
  checked: boolean;
  recurringJob: string;
  recurringDefinition: string;
  startDate: Moment;
  hasEndDate: boolean;
  endDate: Moment;
  timezone: number;
  cronExpression: string;
  pageSize: number;
  delayTime: number | null;
  delayTimeunit: string;
}

const radios = [
  {
    id: "no",
    label: "No",
  },
  {
    id: "yes",
    label: "Yes",
  },
];

//TODO: Add invalid and error for date picker
const jobStartSelect = (
  startDate: Moment,
  timezone: number,
  handleDateChange: (value: Moment) => void,
  onChangeTimezone: (value: ChangeEvent<HTMLSelectElement>) => void
) => (
  <React.Fragment>
    <EuiFormRow label="Job starts on">
      <EuiDatePicker showTimeSelect selected={startDate} onChange={handleDateChange} />
    </EuiFormRow>

    <EuiSpacer size="m" />

    <EuiFormRow label={"Timezone"}>
      <EuiSelect id="timezone" options={TimezoneOptions} value={timezone} onChange={onChangeTimezone} />
    </EuiFormRow>

    <EuiSpacer size="m" />
  </React.Fragment>
);

//TODO: Add invalid and error for end date, such as endDate should be later than start date. Also add a clear field since this is optional
const jobEndSelect = (endDate: Moment, handleDateChange: (value: Moment) => void) => (
  <React.Fragment>
    <EuiFormRow label="Job ends on - optional">
      <EuiDatePicker showTimeSelect selected={endDate} onChange={handleDateChange} />
    </EuiFormRow>

    <EuiSpacer size="m" />
  </React.Fragment>
);

const defineCron = (cronExpression: string, onChangeCron: (value: ChangeEvent<HTMLTextAreaElement>) => void) => (
  <React.Fragment>
    <EuiFormRow label="Cron expression">
      <EuiTextArea value={cronExpression} onChange={onChangeCron} compressed={true} />
    </EuiFormRow>
    <EuiSpacer size="m" />
  </React.Fragment>
);

export default class Schedule extends Component<ScheduleProps, ScheduleState> {
  constructor(props: ScheduleProps) {
    super(props);

    this.state = {
      checked: false,
      recurringJob: "no",
      recurringDefinition: "date",
      startDate: moment(),
      endDate: null,
      hasEndDate: false,
      timezone: -7,
      cronExpression: "",
      pageSize: 1000,
      delayTime: null,
      delayTimeunit: "m",
    };
  }

  onChangeCheck = (): void => {
    const checked = this.state.checked;
    this.setState({ checked: !checked });
  };

  onChangeCron = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({ cronExpression: e.target.value });
  };

  onChangeDelayTime = (e: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ delayTime: e.target.value });
  };

  onChangeRecurringDefinition = (e: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ recurringDefinition: e.target.value });
  };

  onChangeRadio = (optionId: string): void => {
    this.setState({ recurringJob: optionId });
  };

  onChangeTimezone = (e: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ timezone: e.target.value });
  };

  onChangeTimeunit = (e: ChangeEvent<HTMLSelectElement>): void => {
    this.setState({ delayTimeunit: e.target.value });
  };

  handleStartDateChange = (date: Moment): void => {
    this.setState({ startDate: date });
  };

  handleEndDateChange = (date: Moment): void => {
    this.setState({ endDate: date, hasEndDate: true });
  };

  render() {
    const {
      checked,
      recurringJob,
      recurringDefinition,
      startDate,
      endDate,
      hasEndDate,
      timezone,
      cronExpression,
      pageSize,
      delayTime,
      delayTimeunit,
    } = this.state;
    return (
      <ContentPanel bodyStyles={{ padding: "initial" }} title="Schedule" titleSize="s">
        <div style={{ paddingLeft: "10px" }}>
          <EuiCheckbox id="jobEnabledByDefault" label="Job enabled by default" checked={checked} onChange={this.onChangeCheck} />
          <EuiSpacer size="m" />
          <EuiFormRow label="Recurring job">
            <EuiRadioGroup options={radios} idSelected={recurringJob} onChange={(id) => this.onChangeRadio(id)} name="recurringJob" />
          </EuiFormRow>
          <EuiSpacer size="m" />

          {/*Hide this portion of components if the rollup job is not recurring*/}
          {recurringJob == "yes" && (
            <EuiFormRow label={"Recurring definition"}>
              <EuiSelect
                id="recurringDefinition"
                options={[
                  { value: "date", text: "Choose date and time" },
                  { value: "cron", text: "Cron expression" },
                ]}
                value={recurringDefinition}
                onChange={this.onChangeRecurringDefinition}
              />
            </EuiFormRow>
          )}

          {/*Hide this part if is recurring job and defined by cron expression*/}
          {(recurringJob == "no" || (recurringJob == "yes" && recurringDefinition == "date")) &&
            jobStartSelect(startDate, timezone, this.handleStartDateChange, this.onChangeTimezone)}

          {recurringJob == "yes" && recurringDefinition == "date" && jobEndSelect(endDate, this.handleEndDateChange)}
          {recurringJob == "yes" && recurringDefinition == "cron" && defineCron(cronExpression, this.onChangeCron)}
          <EuiSpacer size="m" />

          <EuiFormRow
            label="Page per execution"
            helpText={"The number of pages every execution processes. A larger number means faster execution and more cost on memory."}
          >
            <EuiFieldNumber min={1} placeholder={"1000"} value={pageSize} />
          </EuiFormRow>
          <EuiSpacer size="m" />
          <EuiFlexGroup style={{ maxWidth: 400 }}>
            <EuiFlexItem grow={false} style={{ width: 200 }}>
              <EuiFormRow label="Execution delay - optional">
                <EuiFieldNumber value={delayTime} onChange={this.onChangeDelayTime} />
              </EuiFormRow>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiFormRow hasEmptyLabelSpace={true}>
                <EuiSelect
                  id="selectTimeunit"
                  options={TimeunitOptions}
                  value={delayTimeunit}
                  onChange={this.onChangeTimeunit}
                  disabled={delayTime == null}
                  isInvalid={delayTime != null && delayTime <= 0}
                />
              </EuiFormRow>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </ContentPanel>
    );
  }
}