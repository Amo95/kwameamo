import { test } from "node:test";
import assert from "node:assert/strict";
import { REACTIONS, isReaction, readReacted, toggleReacted } from "./reactions.ts";

test("REACTIONS: wave, heart and fire, in that order", () => {
  assert.deepEqual(REACTIONS.map((r) => r.key), ["wave", "heart", "fire"]);
  assert.equal(isReaction("heart"), true);
  assert.equal(isReaction("likes"), false);
  assert.equal(isReaction(""), false);
});

test("readReacted: reads the saved reactions and keeps old hearts", () => {
  assert.deepEqual(readReacted('{"a":["wave","fire"]}', null), { a: ["wave", "fire"] });
  // Old hearts (liked-notes) count as a heart.
  assert.deepEqual(readReacted(null, '["a","b"]'), { a: ["heart"], b: ["heart"] });
  assert.deepEqual(readReacted('{"a":["wave"]}', '["a"]'), { a: ["wave", "heart"] });
});

test("readReacted: anything broken or unknown is dropped", () => {
  assert.deepEqual(readReacted("not json", "nope"), {});
  assert.deepEqual(readReacted('{"a":["wave","boom"],"b":"x"}', "{}"), { a: ["wave"] });
});

test("toggleReacted: adds and removes one reaction", () => {
  assert.deepEqual(toggleReacted({}, "a", "fire", true), { a: ["fire"] });
  assert.deepEqual(toggleReacted({ a: ["fire", "wave"] }, "a", "fire", false), { a: ["wave"] });
  assert.deepEqual(toggleReacted({ a: ["fire"] }, "a", "fire", false), {});
  assert.deepEqual(toggleReacted({ a: ["fire"] }, "a", "fire", true), { a: ["fire"] });
});
