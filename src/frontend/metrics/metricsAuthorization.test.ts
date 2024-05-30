import * as metricsAuthorization from "./metricsAuthorization.ts";

// TODO(evanhahn): remove Deno
// TODO: DENO START
function assert(condition: unknown) {
  if (!condition) throw new Error("condition failed");
}
const it = Deno.test.bind(Deno);
// TODO: DENO END

it("encodes and decodes", () => {
  const original = "hello world 123";
  const encoded = metricsAuthorization.encodeMetricsAuthorization(original);
  const decoded = metricsAuthorization.decodeMetricsAuthorization(encoded);

  assert(encoded !== original);
  assert(decoded === original);
});
