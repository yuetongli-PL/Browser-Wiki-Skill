// @ts-check

import {
  normalizeLifecycleEvent,
  assertLifecycleEventProducerObservability,
} from '../lifecycle-events.mjs';
import {
  assertExecutionPolicyDecisionCompatible,
} from './policy-gate.mjs';
import {
  createCoverageDeltaArtifactQueueEntry,
  prepareCoverageDeltaArtifactQueueWrite,
} from './coverage-delta-queue.mjs';
import {
  createCoverageDeltaFromExecutionFeedback,
  createExecutionFeedbackFromLayerReceipt,
} from './layer-handoff.mjs';
import {
  SITE_CAPABILITY_EXECUTION_SCHEMA_VERSION,
  SITE_CAPABILITY_EXECUTION_VERSION,
} from './schema.mjs';
import {
  assertCoverageDeltaCompatible,
  assertExecutionFeedbackCompatible,
  assertLayerExecutionHandoffDescriptorCompatible,
  assertNoExecutionSensitiveMaterial,
} from './validator.mjs';

function fail(message, code = 'execution.layer_consumer_invalid') {
  const error = new Error(message);
  error.code = code;
  throw error;
}

function normalizeText(value) {
  const text = String(value ?? '').trim();
  return text || undefined;
}

export function assertLayerOwnedRuntimeConsumerResultCompatible(result = {}) {
  if (result.schemaVersion !== SITE_CAPABILITY_EXECUTION_SCHEMA_VERSION) {
    fail('LayerOwnedRuntimeConsumerResult schemaVersion is not compatible', 'execution.version_incompatible');
  }
  if (result.executionVersion !== SITE_CAPABILITY_EXECUTION_VERSION) {
    fail('LayerOwnedRuntimeConsumerResult executionVersion is not compatible', 'execution.version_incompatible');
  }
  if (result.resultType !== 'LayerOwnedRuntimeConsumerResult') {
    fail('LayerOwnedRuntimeConsumerResult resultType is required');
  }
  if (
    result.consumerOwner !== 'site-capability-layer'
    || result.layerReceiptConsumed !== true
    || result.runtimeTaskExecutedByConsumer !== false
    || result.directDownloaderInvocationAllowed !== false
    || result.directSiteAdapterInvocationAllowed !== false
    || result.sessionViewMaterializationAllowed !== false
    || result.rawCredentialMaterialAllowed !== false
    || result.redactionRequired !== true
  ) {
    fail('LayerOwnedRuntimeConsumerResult must remain Layer-owned and non-executing');
  }
  assertNoExecutionSensitiveMaterial(result);
  assertExecutionFeedbackCompatible(result.executionFeedback);
  assertCoverageDeltaCompatible(result.coverageDelta);
  assertLifecycleEventProducerObservability(result.lifecycleEvent);
  return true;
}

export function createLayerOwnedRuntimeConsumerResult({
  handoffDescriptor,
  policyDecision,
  layerReceipt = {},
  coverageBefore = 'partial',
  coverageAfter = 'partial',
  deltaType = 'observed',
  affectedNodeRefs = [],
  affectedCapabilityRefs = [],
  affectedRouteRefs = [],
  evidenceRefs,
  traceId,
  correlationId,
  siteKey,
  taskType = 'site-capability-execution',
  adapterVersion,
} = {}) {
  assertLayerExecutionHandoffDescriptorCompatible(handoffDescriptor);
  assertExecutionPolicyDecisionCompatible(policyDecision);
  assertNoExecutionSensitiveMaterial(layerReceipt);
  if (policyDecision.layerGovernedDispatchReady !== true) {
    fail('Layer-owned runtime consumer requires ready Layer-governed dispatch', 'execution.approval_required');
  }
  if (policyDecision.executionId !== handoffDescriptor.executionId) {
    fail('Layer-owned runtime consumer executionId must match handoff descriptor');
  }
  const artifactRefs = Array.isArray(layerReceipt.artifactRefs)
    ? layerReceipt.artifactRefs
    : [];
  const safeEvidenceRefs = Array.isArray(evidenceRefs) ? evidenceRefs : artifactRefs;
  const executionFeedback = createExecutionFeedbackFromLayerReceipt({
    executionId: handoffDescriptor.executionId,
    executionStatus: normalizeText(layerReceipt.executionStatus) ?? 'accepted',
    reasonCodes: Array.isArray(layerReceipt.reasonCodes) ? layerReceipt.reasonCodes : [],
    artifactRefs,
    timingSummary: layerReceipt.timingSummary ?? {},
  });
  const coverageDelta = createCoverageDeltaFromExecutionFeedback({
    executionFeedback,
    coverageBefore,
    coverageAfter,
    deltaType,
    affectedNodeRefs,
    affectedCapabilityRefs,
    affectedRouteRefs,
    evidenceRefs: safeEvidenceRefs,
    reasonCodes: executionFeedback.reasonCodes,
  });
  const coverageDeltaQueueEntry = createCoverageDeltaArtifactQueueEntry({ coverageDelta });
  const coverageDeltaArtifactWrite = prepareCoverageDeltaArtifactQueueWrite({ coverageDelta });
  const lifecycleEvent = normalizeLifecycleEvent({
    eventType: 'execution.layer.consumer.receipt',
    traceId,
    correlationId,
    taskId: handoffDescriptor.executionId,
    siteKey,
    taskType,
    adapterVersion,
    reasonCode: executionFeedback.reasonCodes[0],
    details: {
      executionId: handoffDescriptor.executionId,
      executionStatus: executionFeedback.executionStatus,
      coverageDeltaType: coverageDelta.deltaType,
      coverageAfter: coverageDelta.coverageAfter,
      artifactRefCount: artifactRefs.length,
      directDownloaderInvocationAllowed: false,
      directSiteAdapterInvocationAllowed: false,
      sessionViewMaterializationAllowed: false,
    },
  });
  const result = {
    schemaVersion: SITE_CAPABILITY_EXECUTION_SCHEMA_VERSION,
    executionVersion: SITE_CAPABILITY_EXECUTION_VERSION,
    resultType: 'LayerOwnedRuntimeConsumerResult',
    consumerOwner: 'site-capability-layer',
    executionId: handoffDescriptor.executionId,
    capabilityPlanRef: handoffDescriptor.capabilityPlanRef,
    graphVersion: handoffDescriptor.graphVersion,
    plannerVersion: handoffDescriptor.plannerVersion,
    layerCompatibilityVersion: handoffDescriptor.layerCompatibilityVersion,
    policyDecisionStatus: policyDecision.decisionStatus,
    layerReceiptConsumed: true,
    runtimeTaskExecutedByConsumer: false,
    directDownloaderInvocationAllowed: false,
    directSiteAdapterInvocationAllowed: false,
    sessionViewMaterializationAllowed: false,
    rawCredentialMaterialAllowed: false,
    executionFeedback,
    coverageDelta,
    coverageDeltaQueueEntry,
    coverageDeltaArtifactWrite,
    lifecycleEvent,
    redactionRequired: true,
  };
  assertLayerOwnedRuntimeConsumerResultCompatible(result);
  return result;
}
