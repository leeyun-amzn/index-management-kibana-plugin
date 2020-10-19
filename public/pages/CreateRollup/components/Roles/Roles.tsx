/*
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import React, { Component } from "react";
import { EuiSpacer, EuiFormRow, EuiComboBox, EuiComboBoxOptionOption } from "@elastic/eui";
import { ContentPanel } from "../../../../components/ContentPanel";
import { RollupService } from "../../../../services";
import { toastNotifications } from "ui/notify";

interface RolesProps {
  rollupService: RollupService;
  rollupId: string;
  rollupIdError: string;
  onChange: (selectedOptions: EuiComboBoxOptionOption<String>[]) => void;
  roles: EuiComboBoxOptionOption<String>[];
}

interface RolesState {
  isLoading: boolean;
  roleOptions: EuiComboBoxOptionOption<String>[];
}

export default class Roles extends Component<RolesProps, RolesState> {
  constructor(props: RolesProps) {
    super(props);
    this.state = {
      isLoading: true,
      roleOptions: [],
    };
  }

  async componentDidMount(): Promise<void> {
    await this.getRoles();
  }

  //TODO: Need to check if this is working properly to get roles
  getRoles = async (): Promise<void> => {
    const { rollupService } = this.props;
    this.setState({ isLoading: true, roleOptions: [] });
    try {
      const rolesResponse = await rollupService.getAuthInfo();
      if (rolesResponse.ok) {
        const roles = rolesResponse.response.roles.map((role: string) => ({
          label: role,
        }));
        this.setState({ roleOptions: roles });
      } else {
        toastNotifications.addDanger(rolesResponse.error);
      }
    } catch (err) {
      toastNotifications.addDanger(err.message);
    }
    this.setState({ isLoading: false });
  };

  render() {
    const { roleOptions } = this.state;
    return (
      <ContentPanel bodyStyles={{ padding: "initial" }} title="Roles" titleSize="m">
        <div style={{ paddingLeft: "10px" }}>
          <EuiSpacer size="s" />
          <EuiFormRow label="Roles" helpText="These roles have access to this rollup job.">
            <EuiComboBox
              placeholder="Select for roles"
              options={roleOptions}
              selectedOptions={this.props.roles}
              onChange={this.props.onChange}
              isClearable={true}
            />
          </EuiFormRow>
        </div>
      </ContentPanel>
    );
  }
}
