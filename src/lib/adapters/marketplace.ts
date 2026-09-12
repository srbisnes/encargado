/**
 * Marketplace adapter interface for production integration.
 * Demo uses MockMarketplaceAdapter. A partner integration can implement
 * official marketplace APIs without changing the policy engine.
 *
 * IMPORTANT:
 * - Never publish answers without human or policy gate.
 * - Never process payments from this layer in the demo.
 * - Prefer official documented APIs and OAuth flows only.
 */

import type { Order, Question } from "../types";

export type PublishResult =
  | { ok: true; externalId: string }
  | { ok: false; reason: string };

export interface MarketplaceAdapter {
  listOpenQuestions(sellerId: string): Promise<Question[]>;
  listRecentOrders(sellerId: string): Promise<Order[]>;
  /**
   * Publish only after PolicyEngine.evaluateAnswer allows it.
   * Implementations must refuse if the gate was not called.
   */
  publishAnswer(
    questionId: string,
    text: string,
    meta: { policyAllowed: boolean; actor: "human" | "agent-assisted" }
  ): Promise<PublishResult>;
}

export class MockMarketplaceAdapter implements MarketplaceAdapter {
  constructor(
    private questions: Question[],
    private orders: Order[]
  ) {}

  async listOpenQuestions(): Promise<Question[]> {
    return this.questions.filter((q) => q.status !== "publicada");
  }

  async listRecentOrders(): Promise<Order[]> {
    return this.orders;
  }

  async publishAnswer(
    questionId: string,
    text: string,
    meta: { policyAllowed: boolean; actor: "human" | "agent-assisted" }
  ): Promise<PublishResult> {
    if (!meta.policyAllowed) {
      return { ok: false, reason: "policy_denied" };
    }
    if (!text.trim()) {
      return { ok: false, reason: "empty_text" };
    }
    // Demo: local only. No external network call.
    return { ok: true, externalId: `SANDBOX-${questionId}` };
  }
}
