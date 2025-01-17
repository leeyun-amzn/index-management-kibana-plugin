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

import { resolve } from "path";
import { existsSync } from "fs";

import { createISMCluster } from "./server/clusters";
import { PolicyService, ManagedIndexService, IndexService, RollupService } from "./server/services";
import { indices, policies, managedIndices, rollups } from "./server/routes";
import { DEFAULT_APP_CATEGORIES } from "../../src/core/utils";

export default function (kibana) {
  return new kibana.Plugin({
    require: ["elasticsearch"],
    name: "opendistro_index_management_kibana",
    uiExports: {
      app: {
        title: "Index Management",
        description: "Kibana plugin for Index Management",
        main: "plugins/opendistro_index_management_kibana/app",
        category: DEFAULT_APP_CATEGORIES.management,

        //To insert the title - "Index Management" in between "Dev Tools" and "Stack management" in Kibana Side menu.
        // Dev Tools is at 9010  and Stack Management is at 9040
        order: 9020,
      },
      hacks: [],
      styleSheetPaths: [resolve(__dirname, "public/app.scss"), resolve(__dirname, "public/app.css")].find((p) => existsSync(p)),
    },

    config(Joi) {
      return Joi.object({
        enabled: Joi.boolean().default(true),
      }).default();
    },

    init(server, options) {
      // Create clusters
      createISMCluster(server);

      // Initialize services
      const esDriver = server.plugins.elasticsearch;
      const indexService = new IndexService(esDriver);
      const policyService = new PolicyService(esDriver);
      const managedIndexService = new ManagedIndexService(esDriver);
      const rollupService = new RollupService(esDriver);
      const services = { indexService, policyService, managedIndexService, rollupService };

      // Add server routes
      indices(server, services);
      policies(server, services);
      managedIndices(server, services);
      rollups(server, services);
    },
  });
}
