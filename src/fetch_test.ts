/*!
   Copyright 2018 Propel http://propel.site/.  All rights reserved.
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

import * as path from "path";
import { test } from "../tools/tester";
import * as fetch from "./fetch";
import {
  assert,
  IS_WEB,
  localServer
} from "./util";

const mnistPath = "/data/mnist/t10k-images-idx3-ubyte.bin";

test(async function fetch_fetchArrayBuffer() {
  await localServer(async function(url: string) {
    url += mnistPath;
    const ab = await fetch.fetchArrayBuffer(url);
    assert(ab.byteLength === 7840016);
  });
});

test(function fetch_resolve() {
  let actual, expected, p;

  // When in testing mode, MNIST should resolve to local paths.
  p = "http://propelml.org" + mnistPath;
  actual = fetch.resolve(p, true).toString();
  if (IS_WEB) {
    expected = document.location.origin +
      "/data/mnist/t10k-images-idx3-ubyte.bin";
  } else {
    expected = "file://" + path.resolve(__dirname,
      "../build/dev_website" + mnistPath);
  }
  assert(actual === expected);

  // When not in testing mode, the URL shouldn't be modified.
  actual = fetch.resolve(p, false).toString();
  expected = p;
  assert(actual === expected);

  /*
  console.log("\nresolve pathname", u.pathname);
  assert(true);
              "deps/data/mnist/t10k-images-idx3-ubyte.bin");

  assertMapTo("http://ar.propelml.org/cifar10_train_labels.npy",
              "http://ar.propelml.org/cifar10_train_labels.npy");

  assertMapTo("src/testdata/4.npy",
              "src/testdata/4.npy");
  */
});
