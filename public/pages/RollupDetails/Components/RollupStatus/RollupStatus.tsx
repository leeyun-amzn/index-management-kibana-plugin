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
import { EuiFlexGrid, EuiSpacer, EuiFlexItem, EuiText } from "@elastic/eui";
import { ContentPanel, ContentPanelActions } from "../../../../components/ContentPanel";
import { ModalConsumer } from "../../../../components/Modal";

interface RollupStatusProps {
  // rollupId: string;
  // description: string;
  // sourceIndex: string;
  // targetIndex: string;
  // roles: string[];
  // onEdit: () => void;
}

export default class RollupStatus extends Component<RollupStatusProps> {
  constructor(props: RollupStatusProps) {
    super(props);
  }

  render() {
    // const { rollupId, description, onEdit, sourceIndex, targetIndex, roles } = this.props;

    return (
      <ContentPanel bodyStyles={{ padding: "initial" }} title="Rollup status" titleSize="m">
        <div style={{ paddingLeft: "10px" }}>
          <EuiSpacer size={"s"} />
          <EuiFlexGrid columns={4}>
            <EuiFlexItem>
              <EuiText size={"xs"}>
                <dt>Current rollup window</dt>
                <dd></dd>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size={"xs"}>
                <dt>Status</dt>
                <dd></dd>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size={"xs"}>
                <dt>Rollup indexed</dt>
                <dd></dd>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size={"xs"}>
                <dt>Indexed time (ms)</dt>
                <dd></dd>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem></EuiFlexItem>
            <EuiFlexItem></EuiFlexItem>
            <EuiFlexItem>
              <EuiText size={"xs"}>
                <dt>Document processed</dt>
                <dd></dd>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem>
              <EuiText size={"xs"}>
                <dt>Search time (ms)</dt>
                <dd></dd>
              </EuiText>
            </EuiFlexItem>
            <EuiFlexItem></EuiFlexItem>
            <EuiFlexItem></EuiFlexItem>
            <EuiFlexItem>
              <EuiText size={"xs"}>
                <dt>Page processed</dt>
                <dd></dd>
              </EuiText>
            </EuiFlexItem>
          </EuiFlexGrid>
          <EuiSpacer size={"s"} />
        </div>
      </ContentPanel>
    );
  }
}
