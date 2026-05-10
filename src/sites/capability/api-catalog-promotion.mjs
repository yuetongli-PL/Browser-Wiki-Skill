// @ts-check

import {
  createApiCandidateMultiAspectVerificationResultFromFixtures,
  normalizeSiteAdapterCandidateDecision,
  normalizeSiteAdapterCatalogUpgradePolicy,
  verifyApiCandidateForCatalog,
  writeRuntimeVerifiedApiCatalogStoreArtifacts,
} from './api-candidates.mjs';
import { apiCandidateFromObservedRequest } from './api-discovery.mjs';
import { assertNoForbiddenPatterns } from './security-guard.mjs';

function normalizeText(value) {
  const text = String(value ?? '').trim();
  return text || undefined;
}

function createVerificationResult(candidate, {
  verificationResult,
  verifierId,
  verifiedAt,
  responseFixture,
  authFixture,
  paginationFixture,
  riskFixture,
  metadata,
} = {}) {
  if (verificationResult) {
    return verificationResult;
  }
  return createApiCandidateMultiAspectVerificationResultFromFixtures({
    candidate,
    verifierId,
    verifiedAt,
    responseFixture,
    authFixture,
    paginationFixture,
    riskFixture,
    metadata,
  });
}

export async function writeVerifiedApiCatalogArtifactsFromObservedProducerEvidence({
  observedRequest,
  siteAdapterDecision,
  catalogUpgradePolicy,
  verification = {},
  metadata = {},
  decidedAt,
} = {}, paths = {}) {
  const observedCandidate = apiCandidateFromObservedRequest(observedRequest);
  assertNoForbiddenPatterns(observedCandidate);
  const normalizedDecision = normalizeSiteAdapterCandidateDecision(siteAdapterDecision, {
    candidate: observedCandidate,
  });
  const verificationResult = createVerificationResult(observedCandidate, verification);
  const verifiedEvidence = verifyApiCandidateForCatalog({
    candidate: observedCandidate,
    siteAdapterDecision: normalizedDecision,
    verificationResult,
  });
  const normalizedPolicy = normalizeSiteAdapterCatalogUpgradePolicy(catalogUpgradePolicy, {
    candidate: verifiedEvidence.candidate,
    siteAdapterDecision: verifiedEvidence.siteAdapterDecision,
  });
  const artifacts = await writeRuntimeVerifiedApiCatalogStoreArtifacts({
    candidate: verifiedEvidence.candidate,
    siteAdapterDecision: verifiedEvidence.siteAdapterDecision,
    policy: normalizedPolicy,
    decidedAt,
    metadata: {
      verifiedAt: normalizeText(verificationResult.verifiedAt),
      ...metadata,
    },
  }, paths);
  return {
    observedCandidate,
    verifiedCandidate: verifiedEvidence.candidate,
    verification: verifiedEvidence.verification,
    siteAdapterDecision: verifiedEvidence.siteAdapterDecision,
    catalogUpgradePolicy: normalizedPolicy,
    artifacts,
    observedApiAutoPromotionAllowed: false,
    verifiedCatalogPromotionPath: 'site-adapter-policy-schema-test-gated',
    redactionRequired: true,
  };
}
