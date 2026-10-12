import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { previewArtifactBuildIntegration } from "../scripts/preview-artifact-build.mjs";
const capture = JSON.parse(readFileSync(new URL("./fixtures/artifact-generated-sidera-image.json", import.meta.url), "utf8"));
const pluginFor = root => {
  let plugin;
  previewArtifactBuildIntegration(root).hooks["astro:config:setup"]({updateConfig(config) {plugin=config.vite.plugins[0];}});
  return plugin;
};
test("captured Sidera compiler raster metadata is independent of clean build root", () => {
  const roots=[capture.root,"/second/clean/build"];
  const outputs=roots.map(root => {
    const id=capture.id.replace(capture.root,root);
    const code=capture.code.replaceAll(capture.root,root);
    const plugin=pluginFor(root);
    for (const name of ["client","prerender"]) assert.equal(plugin.transform.call({environment:{name}},code,id),undefined);
    return plugin.transform.call({environment:{name:"ssr"}},code,id).code;
  });
  assert.equal(outputs[0],outputs[1]);
  assert.ok(outputs[0].includes("/workspace/template/src/assets/home/synastry-person-a.png"));
});
test("raster metadata hook preserves authored modules and rejects changed compiler shape", () => {
  const plugin=pluginFor(capture.root);
  const authored=`export default ${JSON.stringify(capture.id)};`;
  assert.equal(plugin.transform.call({environment:{name:"ssr"}},authored,capture.root+"/src/authored.ts"),undefined);
  assert.throws(()=>plugin.transform.call({environment:{name:"ssr"}},authored,capture.id),/preview_artifact_image_metadata_shape_changed/);
});
test("artifact manifest sorts only string assets and preserves routes", () => {
  const hook=previewArtifactBuildIntegration("/build/root").hooks["astro:build:ssr"];
  const routes=[{file:"src/pages/index.astro"}];
  const a={key:"build-local",assets:["/z.svg","/a.svg"],routes:structuredClone(routes)};
  const b={key:"build-local",assets:["/a.svg","/z.svg"],routes:structuredClone(routes)};
  hook({manifest:a});hook({manifest:b});assert.deepEqual(a,b);assert.deepEqual(a.routes,routes);
  assert.throws(()=>hook({manifest:{key:"build-local",assets:[123]}}),/preview_artifact_astro_manifest_shape_changed/);
});
