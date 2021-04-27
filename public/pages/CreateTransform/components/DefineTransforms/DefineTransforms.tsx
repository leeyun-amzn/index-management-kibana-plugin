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

import React, { Component } from "react";
import { ContentPanel, ContentPanelActions } from "../../../../components/ContentPanel";

interface DefineTransformsProps {
  transformId: string;
}

interface DefineTransformsState {}

export default class DefineTransforms extends Component<DefineTransformsProps, DefineTransformsState> {
  constructor(props: DefineTransformsProps) {
    super(props);
    const { transfromId } = this.props;
    this.state = {};
  }

  render() {
    return (
      <ContentPanel
        actions={
          <ContentPanelActions
            actions={[
              {
                text: "Full screen view",
                buttonProps: {
                  iconType: "fullScreen",
                  //TODO: Add action to enter full screen view

                  // onClick: () =>
                  //   onShow(ApplyPolicyModal, {
                  //     indices: selectedItems.map((item: ManagedCatIndex) => item.index),
                  //     core: this.context,
                  //   }),
                },
              },
            ]}
          />
        }
        bodyStyles={{ padding: "initial" }}
        title="Select fields to transform"
        titleSize="m"
      ></ContentPanel>
    );
  }
}
