// @ts-check

import { createBilibiliSiteDoctorScenarioSuite } from '../bilibili/doctor/scenarios.mjs';
import { createDouyinSiteDoctorScenarioSuite } from '../douyin/doctor/scenarios.mjs';
import { createXiaohongshuSiteDoctorScenarioSuite } from '../xiaohongshu/doctor/scenarios.mjs';

export function resolveSiteDoctorScenarioSuite({
  siteKey = null,
  profile = null,
  helpers = {},
} = {}) {
  switch (String(siteKey ?? '')) {
    case 'bilibili':
      return createBilibiliSiteDoctorScenarioSuite({ profile, helpers });
    case 'douyin':
      return createDouyinSiteDoctorScenarioSuite({ helpers });
    case 'xiaohongshu':
      return createXiaohongshuSiteDoctorScenarioSuite({ profile, helpers });
    default:
      return null;
  }
}
