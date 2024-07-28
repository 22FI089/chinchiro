/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
// チンチロを行うプログラムの作成



class ThreeJSContainer {
    scene;
    light;
    mesh = [];
    cubeShape = [];
    cubeBody = [];
    world;
    constructor() { }
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_1__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_1__.Color(0x495ed));
        renderer.shadowMap.enabled = true; // シャドウマップを有効にする
        const camera = new three__WEBPACK_IMPORTED_MODULE_1__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();
        this.world = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(0, -9.82, 0) });
        this.world.defaultContactMaterial.friction = 0.3;
        this.world.defaultContactMaterial.restitution = 0.8;
        this.addSceneFromObjFile("dice.obj");
        this.light = new three__WEBPACK_IMPORTED_MODULE_1__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        const update = (time) => {
            this.world.fixedStep();
            for (let i = 0; i < this.mesh.length; i++) {
                if (this.mesh[i] && this.cubeBody[i]) {
                    this.mesh[i].position.set(this.cubeBody[i].position.x, this.cubeBody[i].position.y, this.cubeBody[i].position.z);
                    this.mesh[i].quaternion.set(this.cubeBody[i].quaternion.x, this.cubeBody[i].quaternion.y, this.cubeBody[i].quaternion.z, this.cubeBody[i].quaternion.w);
                }
            }
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
    addSceneFromObjFile = async (filePath) => {
        const meshStr = await readFile(filePath);
        let vertices = [];
        let vertexIndices = [];
        let uvIndices = [];
        let uv = [];
        let materialFileName;
        let textureName;
        const meshLines = meshStr.split("\n");
        for (let i = 0; i < meshLines.length; ++i) {
            const meshLine = meshLines[i];
            const meshSpaceSplitArray = meshLine.split(" ");
            const meshType = meshSpaceSplitArray[0]; //どの情報を表すか
            if (meshType == "v") { //頂点
                vertices.push(parseFloat(meshSpaceSplitArray[1])); //x座標
                vertices.push(parseFloat(meshSpaceSplitArray[2])); //y座標
                vertices.push(parseFloat(meshSpaceSplitArray[3])); //z座標
            }
            else if (meshType == "f") { //面の情報
                const f1 = meshSpaceSplitArray[1].split("/");
                const f2 = meshSpaceSplitArray[2].split("/");
                const f3 = meshSpaceSplitArray[3].split("/");
                vertexIndices.push(parseInt(f1[0]) - 1); //頂点インデックス
                vertexIndices.push(parseInt(f2[0]) - 1); //頂点インデックス
                vertexIndices.push(parseInt(f3[0]) - 1); //頂点インデックス
                uvIndices.push(parseInt(f1[1]) - 1); //UVインデックス
                uvIndices.push(parseInt(f2[1]) - 1); //UVインデックス
                uvIndices.push(parseInt(f3[1]) - 1); //UVインデックス
            }
            else if (meshType == "vt") {
                uv.push(parseFloat(meshSpaceSplitArray[1])); //x座標
                uv.push(parseFloat(meshSpaceSplitArray[2])); //y座標
            }
            else if (meshType == "mtllib") { //マテリアルファイル名の情報
                materialFileName = meshSpaceSplitArray[1];
            }
        }
        const materialFile = await readFile(materialFileName);
        const materialLines = materialFile.split("\n");
        for (let i = 0; i < materialLines.length; ++i) {
            const materialLine = materialLines[i];
            const materialSpaceSplintArray = materialLine.split(" ");
            const materialType = materialSpaceSplintArray[0]; //どの情報を表すか
            if (materialType == "map_Kd") { //テクスチャのファイル名を探索
                textureName = materialSpaceSplintArray[1];
            }
        }
        let vertex = new Float32Array(vertexIndices.length * 3);
        for (let i = 0; i < vertexIndices.length; i++) {
            vertex[3 * i] = vertices[3 * vertexIndices[i]];
            vertex[3 * i + 1] = vertices[3 * vertexIndices[i] + 1];
            vertex[3 * i + 2] = vertices[3 * vertexIndices[i] + 2];
        }
        const uvs = [];
        for (let i = 0; i < uvIndices.length; i++) {
            const uvIndex = uvIndices[i];
            uvs.push(uv[2 * uvIndex]);
            uvs.push(uv[2 * uvIndex + 1]);
        }
        const geometry = new three__WEBPACK_IMPORTED_MODULE_1__.BufferGeometry();
        geometry.setAttribute('position', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(vertex, 3));
        geometry.setAttribute('uv', new three__WEBPACK_IMPORTED_MODULE_1__.BufferAttribute(new Float32Array(uvs), 2));
        geometry.computeVertexNormals();
        const texture = new three__WEBPACK_IMPORTED_MODULE_1__.TextureLoader().load(textureName);
        const material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: texture });
        for (let i = 0; i < 3; i++) {
            this.mesh[i] = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(geometry, material);
            this.mesh[i].rotateX(2 * Math.PI * Math.random());
            this.mesh[i].rotateY(2 * Math.PI * Math.random());
            this.mesh[i].rotateZ(2 * Math.PI * Math.random());
            this.mesh[i].position.y = 20;
            if (i == 0) {
                let theta = Math.PI / 6 + Math.PI / 3 * Math.random();
                this.mesh[i].position.x = 5 * Math.cos(theta);
                this.mesh[i].position.z = 5 * Math.sin(theta);
            }
            else if (i == 1) {
                let theta = Math.PI * 4 / 6 + Math.PI / 3 * Math.random();
                this.mesh[i].position.x = 5 * Math.cos(theta);
                this.mesh[i].position.z = 5 * Math.sin(theta);
            }
            else if (i == 2) {
                let theta = Math.PI * 8 / 6 + Math.PI / 3 * Math.random();
                this.mesh[i].position.x = 5 * Math.cos(theta);
                this.mesh[i].position.z = 5 * Math.sin(theta);
            }
            this.scene.add(this.mesh[i]);
            this.cubeShape[i] = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(1, 1, 1)); //頂点の座標から1にする
            this.cubeBody[i] = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 1 });
            this.cubeBody[i].addShape(this.cubeShape[i]);
            this.cubeBody[i].position.set(this.mesh[i].position.x, this.mesh[i].position.y, this.mesh[i].position.z);
            this.cubeBody[i].quaternion.set(this.mesh[i].quaternion.x, this.mesh[i].quaternion.y, this.mesh[i].quaternion.z, this.mesh[i].quaternion.w);
            this.world.addBody(this.cubeBody[i]);
        }
        // // どんぶり
        // // 土台
        // let basePoints: THREE.Vector2[] = [];
        // basePoints.push(new THREE.Vector2(5.5, 0));
        // basePoints.push(new THREE.Vector2(5.0, 0));
        // basePoints.push(new THREE.Vector2(5.0, 2));
        // basePoints.push(new THREE.Vector2(5.5, 2));
        // basePoints.push(new THREE.Vector2(5.5, 0));
        // let baseGeometry = new THREE.LatheGeometry(basePoints);
        // let baseMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        // let baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        // this.scene.add(baseMesh);
        // const baseShape = new CANNON.Cylinder(5.0, 5.0, 2, 20);
        // const baseBody = new CANNON.Body({ mass: 0 });
        // baseBody.addShape(baseShape);
        // baseBody.position.set(baseMesh.position.x, baseMesh.position.y, baseMesh.position.z);
        // baseBody.quaternion.set(baseMesh.quaternion.x, baseMesh.quaternion.y, baseMesh.quaternion.z, baseMesh.quaternion.w);
        // this.world.addBody(baseBody);
        // // 器
        // let bowlPoints: THREE.Vector2[] = [];
        // let pointNum = 10;
        // let radius = 10; // 器の半径
        // for (let i = 0; i < pointNum; ++i) {
        //     bowlPoints.push(new THREE.Vector2(radius * Math.cos(Math.PI / 2 * i / (pointNum - 1) - Math.PI / 2),
        //         radius * Math.sin(Math.PI / 2 * i / (pointNum - 1) - Math.PI / 2)));
        // }
        // let bowlGeometry = new THREE.LatheGeometry(bowlPoints);
        // let bowlMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
        // let bowlMesh = new THREE.Mesh(bowlGeometry, bowlMaterial);
        // bowlMesh.position.y = 2 + Math.sqrt(75);
        // this.scene.add(bowlMesh);
        // const bowlShape  = new CANNON.Sphere(radius);
        // const bowlBody = new CANNON.Body({ mass: 0 });
        // bowlBody.addShape(bowlShape);
        // bowlBody.position.set(bowlMesh.position.x, bowlMesh.position.y, bowlMesh.position.z);
        // bowlBody.quaternion.set(bowlMesh.quaternion.x, bowlMesh.quaternion.y, bowlMesh.quaternion.z, bowlMesh.quaternion.w);
        // this.world.addBody(bowlBody);
        const wallHeight = 9;
        const wallThickness = 0.5;
        const wallLength = 20;
        const wallMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ color: 0x00aaaa });
        // 前面の壁
        const frontWallGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(wallLength, wallHeight, wallThickness);
        const frontWallMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(frontWallGeometry, wallMaterial);
        frontWallMesh.position.set(0, wallHeight / 2, -wallLength / 2);
        this.scene.add(frontWallMesh);
        const frontWallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(wallLength / 2, wallHeight / 2, wallThickness / 2));
        const frontWallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        frontWallBody.addShape(frontWallShape);
        frontWallBody.position.set(frontWallMesh.position.x, frontWallMesh.position.y, frontWallMesh.position.z);
        this.world.addBody(frontWallBody);
        // 背面の壁
        const backWallGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(wallLength, wallHeight, wallThickness);
        const backWallMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(backWallGeometry, wallMaterial);
        backWallMesh.position.set(0, wallHeight / 2, wallLength / 2);
        this.scene.add(backWallMesh);
        const backWallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(wallLength / 2, wallHeight / 2, wallThickness / 2));
        const backWallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        backWallBody.addShape(backWallShape);
        backWallBody.position.set(backWallMesh.position.x, backWallMesh.position.y, backWallMesh.position.z);
        this.world.addBody(backWallBody);
        // 左側の壁
        const leftWallGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(wallThickness, wallHeight, wallLength);
        const leftWallMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(leftWallGeometry, wallMaterial);
        leftWallMesh.position.set(-wallLength / 2, wallHeight / 2, 0);
        this.scene.add(leftWallMesh);
        const leftWallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(wallThickness / 2, wallHeight / 2, wallLength / 2));
        const leftWallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        leftWallBody.addShape(leftWallShape);
        leftWallBody.position.set(leftWallMesh.position.x, leftWallMesh.position.y, leftWallMesh.position.z);
        this.world.addBody(leftWallBody);
        // 右側の壁
        const rightWallGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.BoxGeometry(wallThickness, wallHeight, wallLength);
        const rightWallMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(rightWallGeometry, wallMaterial);
        rightWallMesh.position.set(wallLength / 2, wallHeight / 2, 0);
        this.scene.add(rightWallMesh);
        const rightWallShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Box(new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Vec3(wallThickness / 2, wallHeight / 2, wallLength / 2));
        const rightWallBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        rightWallBody.addShape(rightWallShape);
        rightWallBody.position.set(rightWallMesh.position.x, rightWallMesh.position.y, rightWallMesh.position.z);
        this.world.addBody(rightWallBody);
        // 地面
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_1__.MeshPhongMaterial({ color: 0x00aaaa });
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneGeometry(20, 20);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_1__.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_2__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        this.world.addBody(planeBody);
    };
}
async function readFile(path) {
    return new Promise((resolve => {
        const loader = new three__WEBPACK_IMPORTED_MODULE_1__.FileLoader();
        loader.load(path, (data) => {
            if (typeof data === "string") {
                resolve(data);
            }
            else {
                const decoder = new TextDecoder('utf-8');
                const decodedString = decoder.decode(data);
                resolve(decodedString);
            }
        });
    }));
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_1__.Vector3(-10, 30, 10));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_cannon-es_dist_cannon-es_js-node_modules_three_examples_jsm_controls_Orb-e58bd2"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LE1BQU0sUUFBUSxHQUFHLElBQUksb0RBQXVCLENBQUMsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUUvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSx1Q0FBVSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBRTdCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDUixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDOUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2pEO2lCQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDZixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNqRDtpQkFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2YsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDakQ7WUFFRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLDBDQUFVLENBQUMsSUFBSSwyQ0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQWE7WUFDM0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLDJDQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUVoRCxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTVJLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN4QztRQUVE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Q0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOzs7OztXQzNCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxxQkFBcUI7V0FDM0I7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7Ozs7O1VFaERBO1VBQ0E7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvLi9zcmMvYXBwLnRzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2NodW5rIGxvYWRlZCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9jZ3ByZW5kZXJpbmcvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiLy8g44OB44Oz44OB44Ot44KS6KGM44GG44OX44Ot44Kw44Op44Og44Gu5L2c5oiQXG5cbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT3JiaXRDb250cm9scyB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vY29udHJvbHMvT3JiaXRDb250cm9sc1wiO1xuaW1wb3J0ICogYXMgQ0FOTk9OIGZyb20gJ2Nhbm5vbi1lcyc7XG5cbmNsYXNzIFRocmVlSlNDb250YWluZXIge1xuICAgIHByaXZhdGUgc2NlbmU6IFRIUkVFLlNjZW5lO1xuICAgIHByaXZhdGUgbGlnaHQ6IFRIUkVFLkxpZ2h0O1xuICAgIHByaXZhdGUgbWVzaDogVEhSRUUuTWVzaFtdID0gW107XG4gICAgcHJpdmF0ZSBjdWJlU2hhcGU6IENBTk5PTi5Cb3hbXSA9IFtdO1xuICAgIHByaXZhdGUgY3ViZUJvZHk6IENBTk5PTi5Cb2R5W10gPSBbXTtcbiAgICBwcml2YXRlIHdvcmxkOiBDQU5OT04uV29ybGQ7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlcmVyRE9NID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBjYW1lcmFQb3M6IFRIUkVFLlZlY3RvcjMpID0+IHtcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcigpO1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICByZW5kZXJlci5zZXRDbGVhckNvbG9yKG5ldyBUSFJFRS5Db2xvcigweDQ5NWVkKSk7XG4gICAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gdHJ1ZTsgLy8g44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG5cbiAgICAgICAgY29uc3Qgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuICAgICAgICBjb25zdCByZW5kZXI6IEZyYW1lUmVxdWVzdENhbGxiYWNrID0gKHRpbWUpID0+IHtcbiAgICAgICAgICAgIG9yYml0Q29udHJvbHMudXBkYXRlKCk7XG4gICAgICAgICAgICByZW5kZXJlci5yZW5kZXIodGhpcy5zY2VuZSwgY2FtZXJhKTtcbiAgICAgICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUuY3NzRmxvYXQgPSBcImxlZnRcIjtcbiAgICAgICAgcmVuZGVyZXIuZG9tRWxlbWVudC5zdHlsZS5tYXJnaW4gPSBcIjEwcHhcIjtcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVyLmRvbUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVTY2VuZSA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuXG4gICAgICAgIHRoaXMud29ybGQgPSBuZXcgQ0FOTk9OLldvcmxkKHsgZ3Jhdml0eTogbmV3IENBTk5PTi5WZWMzKDAsIC05LjgyLCAwKSB9KTtcbiAgICAgICAgdGhpcy53b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLmZyaWN0aW9uID0gMC4zO1xuICAgICAgICB0aGlzLndvcmxkLmRlZmF1bHRDb250YWN0TWF0ZXJpYWwucmVzdGl0dXRpb24gPSAwLjg7XG5cbiAgICAgICAgdGhpcy5hZGRTY2VuZUZyb21PYmpGaWxlKFwiZGljZS5vYmpcIik7XG5cbiAgICAgICAgdGhpcy5saWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZmZmZmKTtcbiAgICAgICAgY29uc3QgbHZlYyA9IG5ldyBUSFJFRS5WZWN0b3IzKDEsIDEsIDEpLm5vcm1hbGl6ZSgpO1xuICAgICAgICB0aGlzLmxpZ2h0LnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodCk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlOiBGcmFtZVJlcXVlc3RDYWxsYmFjayA9ICh0aW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLndvcmxkLmZpeGVkU3RlcCgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1lc2gubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5tZXNoW2ldICYmIHRoaXMuY3ViZUJvZHlbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNoW2ldLnBvc2l0aW9uLnNldCh0aGlzLmN1YmVCb2R5W2ldLnBvc2l0aW9uLngsIHRoaXMuY3ViZUJvZHlbaV0ucG9zaXRpb24ueSwgdGhpcy5jdWJlQm9keVtpXS5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tZXNoW2ldLnF1YXRlcm5pb24uc2V0KHRoaXMuY3ViZUJvZHlbaV0ucXVhdGVybmlvbi54LCB0aGlzLmN1YmVCb2R5W2ldLnF1YXRlcm5pb24ueSwgdGhpcy5jdWJlQm9keVtpXS5xdWF0ZXJuaW9uLnosIHRoaXMuY3ViZUJvZHlbaV0ucXVhdGVybmlvbi53KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZFNjZW5lRnJvbU9iakZpbGUgPSBhc3luYyAoZmlsZVBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zdCBtZXNoU3RyID0gYXdhaXQgcmVhZEZpbGUoZmlsZVBhdGgpO1xuICAgICAgICBsZXQgdmVydGljZXM6IG51bWJlcltdID0gW107XG4gICAgICAgIGxldCB2ZXJ0ZXhJbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBsZXQgdXZJbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBsZXQgdXY6IG51bWJlcltdID0gW107XG4gICAgICAgIGxldCBtYXRlcmlhbEZpbGVOYW1lO1xuICAgICAgICBsZXQgdGV4dHVyZU5hbWU7XG5cbiAgICAgICAgY29uc3QgbWVzaExpbmVzID0gbWVzaFN0ci5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNoTGluZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IG1lc2hMaW5lID0gbWVzaExpbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgbWVzaFNwYWNlU3BsaXRBcnJheSA9IG1lc2hMaW5lLnNwbGl0KFwiIFwiKTtcblxuICAgICAgICAgICAgY29uc3QgbWVzaFR5cGUgPSBtZXNoU3BhY2VTcGxpdEFycmF5WzBdOyAvL+OBqeOBruaDheWgseOCkuihqOOBmeOBi1xuICAgICAgICAgICAgaWYgKG1lc2hUeXBlID09IFwidlwiKSB7IC8v6aCC54K5XG4gICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChwYXJzZUZsb2F0KG1lc2hTcGFjZVNwbGl0QXJyYXlbMV0pKTsgLy945bqn5qiZXG4gICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChwYXJzZUZsb2F0KG1lc2hTcGFjZVNwbGl0QXJyYXlbMl0pKTsgLy955bqn5qiZXG4gICAgICAgICAgICAgICAgdmVydGljZXMucHVzaChwYXJzZUZsb2F0KG1lc2hTcGFjZVNwbGl0QXJyYXlbM10pKTsgLy965bqn5qiZXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc2hUeXBlID09IFwiZlwiKSB7IC8v6Z2i44Gu5oOF5aCxXG4gICAgICAgICAgICAgICAgY29uc3QgZjEgPSBtZXNoU3BhY2VTcGxpdEFycmF5WzFdLnNwbGl0KFwiL1wiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmMiA9IG1lc2hTcGFjZVNwbGl0QXJyYXlbMl0uc3BsaXQoXCIvXCIpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGYzID0gbWVzaFNwYWNlU3BsaXRBcnJheVszXS5zcGxpdChcIi9cIik7XG4gICAgICAgICAgICAgICAgdmVydGV4SW5kaWNlcy5wdXNoKHBhcnNlSW50KGYxWzBdKSAtIDEpOyAvL+mggueCueOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAgICAgICAgICAgIHZlcnRleEluZGljZXMucHVzaChwYXJzZUludChmMlswXSkgLSAxKTsgLy/poILngrnjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhJbmRpY2VzLnB1c2gocGFyc2VJbnQoZjNbMF0pIC0gMSk7IC8v6aCC54K544Kk44Oz44OH44OD44Kv44K5XG4gICAgICAgICAgICAgICAgdXZJbmRpY2VzLnB1c2gocGFyc2VJbnQoZjFbMV0pIC0gMSk7IC8vVVbjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgICAgICAgICAgICB1dkluZGljZXMucHVzaChwYXJzZUludChmMlsxXSkgLSAxKTsgLy9VVuOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAgICAgICAgICAgIHV2SW5kaWNlcy5wdXNoKHBhcnNlSW50KGYzWzFdKSAtIDEpOyAvL1VW44Kk44Oz44OH44OD44Kv44K5XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1lc2hUeXBlID09IFwidnRcIikge1xuICAgICAgICAgICAgICAgIHV2LnB1c2gocGFyc2VGbG9hdChtZXNoU3BhY2VTcGxpdEFycmF5WzFdKSk7IC8veOW6p+aomVxuICAgICAgICAgICAgICAgIHV2LnB1c2gocGFyc2VGbG9hdChtZXNoU3BhY2VTcGxpdEFycmF5WzJdKSk7IC8veeW6p+aomVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtZXNoVHlwZSA9PSBcIm10bGxpYlwiKSB7IC8v44Oe44OG44Oq44Ki44Or44OV44Kh44Kk44Or5ZCN44Gu5oOF5aCxXG4gICAgICAgICAgICAgICAgbWF0ZXJpYWxGaWxlTmFtZSA9IG1lc2hTcGFjZVNwbGl0QXJyYXlbMV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBtYXRlcmlhbEZpbGUgPSBhd2FpdCByZWFkRmlsZShtYXRlcmlhbEZpbGVOYW1lKTtcbiAgICAgICAgY29uc3QgbWF0ZXJpYWxMaW5lcyA9IG1hdGVyaWFsRmlsZS5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtYXRlcmlhbExpbmVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBtYXRlcmlhbExpbmUgPSBtYXRlcmlhbExpbmVzW2ldO1xuICAgICAgICAgICAgY29uc3QgbWF0ZXJpYWxTcGFjZVNwbGludEFycmF5ID0gbWF0ZXJpYWxMaW5lLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgIGNvbnN0IG1hdGVyaWFsVHlwZSA9IG1hdGVyaWFsU3BhY2VTcGxpbnRBcnJheVswXTsgLy/jganjga7mg4XloLHjgpLooajjgZnjgYtcbiAgICAgICAgICAgIGlmIChtYXRlcmlhbFR5cGUgPT0gXCJtYXBfS2RcIikgeyAvL+ODhuOCr+OCueODgeODo+OBruODleOCoeOCpOODq+WQjeOCkuaOoue0olxuICAgICAgICAgICAgICAgIHRleHR1cmVOYW1lID0gbWF0ZXJpYWxTcGFjZVNwbGludEFycmF5WzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHZlcnRleCA9IG5ldyBGbG9hdDMyQXJyYXkodmVydGV4SW5kaWNlcy5sZW5ndGggKiAzKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0ZXhJbmRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2ZXJ0ZXhbMyAqIGldID0gdmVydGljZXNbMyAqIHZlcnRleEluZGljZXNbaV1dO1xuICAgICAgICAgICAgdmVydGV4WzMgKiBpICsgMV0gPSB2ZXJ0aWNlc1szICogdmVydGV4SW5kaWNlc1tpXSArIDFdO1xuICAgICAgICAgICAgdmVydGV4WzMgKiBpICsgMl0gPSB2ZXJ0aWNlc1szICogdmVydGV4SW5kaWNlc1tpXSArIDJdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdXZzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHV2SW5kaWNlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdXZJbmRleCA9IHV2SW5kaWNlc1tpXTtcbiAgICAgICAgICAgIHV2cy5wdXNoKHV2WzIgKiB1dkluZGV4XSk7XG4gICAgICAgICAgICB1dnMucHVzaCh1dlsyICogdXZJbmRleCArIDFdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBuZXcgVEhSRUUuQnVmZmVyQXR0cmlidXRlKHZlcnRleCwgMykpO1xuICAgICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoJ3V2JywgbmV3IFRIUkVFLkJ1ZmZlckF0dHJpYnV0ZShuZXcgRmxvYXQzMkFycmF5KHV2cyksIDIpKTtcbiAgICAgICAgZ2VvbWV0cnkuY29tcHV0ZVZlcnRleE5vcm1hbHMoKTtcblxuICAgICAgICBjb25zdCB0ZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmVMb2FkZXIoKS5sb2FkKHRleHR1cmVOYW1lKTtcbiAgICAgICAgY29uc3QgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmUgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMubWVzaFtpXSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICAgICAgICB0aGlzLm1lc2hbaV0ucm90YXRlWCgyICogTWF0aC5QSSAqIE1hdGgucmFuZG9tKCkpO1xuICAgICAgICAgICAgdGhpcy5tZXNoW2ldLnJvdGF0ZVkoMiAqIE1hdGguUEkgKiBNYXRoLnJhbmRvbSgpKTtcbiAgICAgICAgICAgIHRoaXMubWVzaFtpXS5yb3RhdGVaKDIgKiBNYXRoLlBJICogTWF0aC5yYW5kb20oKSk7XG4gICAgICAgICAgICB0aGlzLm1lc2hbaV0ucG9zaXRpb24ueSA9IDIwO1xuXG4gICAgICAgICAgICBpZiAoaSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRoZXRhID0gTWF0aC5QSSAvIDYgKyBNYXRoLlBJIC8gMyAqIE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNoW2ldLnBvc2l0aW9uLnggPSA1ICogTWF0aC5jb3ModGhldGEpO1xuICAgICAgICAgICAgICAgIHRoaXMubWVzaFtpXS5wb3NpdGlvbi56ID0gNSAqIE1hdGguc2luKHRoZXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRoZXRhID0gTWF0aC5QSSAqIDQgLyA2ICsgTWF0aC5QSSAvIDMgKiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIHRoaXMubWVzaFtpXS5wb3NpdGlvbi54ID0gNSAqIE1hdGguY29zKHRoZXRhKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2hbaV0ucG9zaXRpb24ueiA9IDUgKiBNYXRoLnNpbih0aGV0YSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGkgPT0gMikge1xuICAgICAgICAgICAgICAgIGxldCB0aGV0YSA9IE1hdGguUEkgKiA4IC8gNiArIE1hdGguUEkgLyAzICogTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICB0aGlzLm1lc2hbaV0ucG9zaXRpb24ueCA9IDUgKiBNYXRoLmNvcyh0aGV0YSk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZXNoW2ldLnBvc2l0aW9uLnogPSA1ICogTWF0aC5zaW4odGhldGEpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLm1lc2hbaV0pO1xuXG4gICAgICAgICAgICB0aGlzLmN1YmVTaGFwZVtpXSA9IG5ldyBDQU5OT04uQm94KG5ldyBDQU5OT04uVmVjMygxLCAxLCAxKSk7IC8v6aCC54K544Gu5bqn5qiZ44GL44KJMeOBq+OBmeOCi1xuICAgICAgICAgICAgdGhpcy5jdWJlQm9keVtpXSA9IG5ldyBDQU5OT04uQm9keSh7IG1hc3M6IDEgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuY3ViZUJvZHlbaV0uYWRkU2hhcGUodGhpcy5jdWJlU2hhcGVbaV0pO1xuXG4gICAgICAgICAgICB0aGlzLmN1YmVCb2R5W2ldLnBvc2l0aW9uLnNldCh0aGlzLm1lc2hbaV0ucG9zaXRpb24ueCwgdGhpcy5tZXNoW2ldLnBvc2l0aW9uLnksIHRoaXMubWVzaFtpXS5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgIHRoaXMuY3ViZUJvZHlbaV0ucXVhdGVybmlvbi5zZXQodGhpcy5tZXNoW2ldLnF1YXRlcm5pb24ueCwgdGhpcy5tZXNoW2ldLnF1YXRlcm5pb24ueSwgdGhpcy5tZXNoW2ldLnF1YXRlcm5pb24ueiwgdGhpcy5tZXNoW2ldLnF1YXRlcm5pb24udyk7XG5cbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkQm9keSh0aGlzLmN1YmVCb2R5W2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC8vIOOBqeOCk+OBtuOCilxuICAgICAgICAvLyAvLyDlnJ/lj7BcbiAgICAgICAgLy8gbGV0IGJhc2VQb2ludHM6IFRIUkVFLlZlY3RvcjJbXSA9IFtdO1xuICAgICAgICAvLyBiYXNlUG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIoNS41LCAwKSk7XG4gICAgICAgIC8vIGJhc2VQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMig1LjAsIDApKTtcbiAgICAgICAgLy8gYmFzZVBvaW50cy5wdXNoKG5ldyBUSFJFRS5WZWN0b3IyKDUuMCwgMikpO1xuICAgICAgICAvLyBiYXNlUG9pbnRzLnB1c2gobmV3IFRIUkVFLlZlY3RvcjIoNS41LCAyKSk7XG4gICAgICAgIC8vIGJhc2VQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMig1LjUsIDApKTtcbiAgICAgICAgLy8gbGV0IGJhc2VHZW9tZXRyeSA9IG5ldyBUSFJFRS5MYXRoZUdlb21ldHJ5KGJhc2VQb2ludHMpO1xuICAgICAgICAvLyBsZXQgYmFzZU1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4MDAwMDAwLCBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlIH0pO1xuICAgICAgICAvLyBsZXQgYmFzZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChiYXNlR2VvbWV0cnksIGJhc2VNYXRlcmlhbCk7XG4gICAgICAgIC8vIHRoaXMuc2NlbmUuYWRkKGJhc2VNZXNoKTtcblxuICAgICAgICAvLyBjb25zdCBiYXNlU2hhcGUgPSBuZXcgQ0FOTk9OLkN5bGluZGVyKDUuMCwgNS4wLCAyLCAyMCk7XG4gICAgICAgIC8vIGNvbnN0IGJhc2VCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgLy8gYmFzZUJvZHkuYWRkU2hhcGUoYmFzZVNoYXBlKTtcbiAgICAgICAgLy8gYmFzZUJvZHkucG9zaXRpb24uc2V0KGJhc2VNZXNoLnBvc2l0aW9uLngsIGJhc2VNZXNoLnBvc2l0aW9uLnksIGJhc2VNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICAvLyBiYXNlQm9keS5xdWF0ZXJuaW9uLnNldChiYXNlTWVzaC5xdWF0ZXJuaW9uLngsIGJhc2VNZXNoLnF1YXRlcm5pb24ueSwgYmFzZU1lc2gucXVhdGVybmlvbi56LCBiYXNlTWVzaC5xdWF0ZXJuaW9uLncpO1xuICAgICAgICAvLyB0aGlzLndvcmxkLmFkZEJvZHkoYmFzZUJvZHkpO1xuXG4gICAgICAgIC8vIC8vIOWZqFxuICAgICAgICAvLyBsZXQgYm93bFBvaW50czogVEhSRUUuVmVjdG9yMltdID0gW107XG4gICAgICAgIC8vIGxldCBwb2ludE51bSA9IDEwO1xuICAgICAgICAvLyBsZXQgcmFkaXVzID0gMTA7IC8vIOWZqOOBruWNiuW+hFxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHBvaW50TnVtOyArK2kpIHtcbiAgICAgICAgLy8gICAgIGJvd2xQb2ludHMucHVzaChuZXcgVEhSRUUuVmVjdG9yMihyYWRpdXMgKiBNYXRoLmNvcyhNYXRoLlBJIC8gMiAqIGkgLyAocG9pbnROdW0gLSAxKSAtIE1hdGguUEkgLyAyKSxcbiAgICAgICAgLy8gICAgICAgICByYWRpdXMgKiBNYXRoLnNpbihNYXRoLlBJIC8gMiAqIGkgLyAocG9pbnROdW0gLSAxKSAtIE1hdGguUEkgLyAyKSkpO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGxldCBib3dsR2VvbWV0cnkgPSBuZXcgVEhSRUUuTGF0aGVHZW9tZXRyeShib3dsUG9pbnRzKTtcbiAgICAgICAgLy8gbGV0IGJvd2xNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweGZmMDAwMCwgc2lkZTogVEhSRUUuRG91YmxlU2lkZSB9KTtcbiAgICAgICAgLy8gbGV0IGJvd2xNZXNoID0gbmV3IFRIUkVFLk1lc2goYm93bEdlb21ldHJ5LCBib3dsTWF0ZXJpYWwpO1xuICAgICAgICAvLyBib3dsTWVzaC5wb3NpdGlvbi55ID0gMiArIE1hdGguc3FydCg3NSk7XG4gICAgICAgIC8vIHRoaXMuc2NlbmUuYWRkKGJvd2xNZXNoKTtcblxuICAgICAgICAvLyBjb25zdCBib3dsU2hhcGUgID0gbmV3IENBTk5PTi5TcGhlcmUocmFkaXVzKTtcbiAgICAgICAgLy8gY29uc3QgYm93bEJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAwIH0pO1xuICAgICAgICAvLyBib3dsQm9keS5hZGRTaGFwZShib3dsU2hhcGUpO1xuICAgICAgICAvLyBib3dsQm9keS5wb3NpdGlvbi5zZXQoYm93bE1lc2gucG9zaXRpb24ueCwgYm93bE1lc2gucG9zaXRpb24ueSwgYm93bE1lc2gucG9zaXRpb24ueik7XG4gICAgICAgIC8vIGJvd2xCb2R5LnF1YXRlcm5pb24uc2V0KGJvd2xNZXNoLnF1YXRlcm5pb24ueCwgYm93bE1lc2gucXVhdGVybmlvbi55LCBib3dsTWVzaC5xdWF0ZXJuaW9uLnosIGJvd2xNZXNoLnF1YXRlcm5pb24udyk7XG4gICAgICAgIC8vIHRoaXMud29ybGQuYWRkQm9keShib3dsQm9keSk7XG5cbiAgICAgICAgY29uc3Qgd2FsbEhlaWdodCA9IDk7XG4gICAgICAgIGNvbnN0IHdhbGxUaGlja25lc3MgPSAwLjU7XG4gICAgICAgIGNvbnN0IHdhbGxMZW5ndGggPSAyMDtcbiAgICAgICAgY29uc3Qgd2FsbE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4MDBhYWFhIH0pO1xuXG4gICAgICAgIC8vIOWJjemdouOBruWjgVxuICAgICAgICBjb25zdCBmcm9udFdhbGxHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSh3YWxsTGVuZ3RoLCB3YWxsSGVpZ2h0LCB3YWxsVGhpY2tuZXNzKTtcbiAgICAgICAgY29uc3QgZnJvbnRXYWxsTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGZyb250V2FsbEdlb21ldHJ5LCB3YWxsTWF0ZXJpYWwpO1xuICAgICAgICBmcm9udFdhbGxNZXNoLnBvc2l0aW9uLnNldCgwLCB3YWxsSGVpZ2h0IC8gMiwgLXdhbGxMZW5ndGggLyAyKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoZnJvbnRXYWxsTWVzaCk7XG5cbiAgICAgICAgY29uc3QgZnJvbnRXYWxsU2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMod2FsbExlbmd0aCAvIDIsIHdhbGxIZWlnaHQgLyAyLCB3YWxsVGhpY2tuZXNzIC8gMikpO1xuICAgICAgICBjb25zdCBmcm9udFdhbGxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgZnJvbnRXYWxsQm9keS5hZGRTaGFwZShmcm9udFdhbGxTaGFwZSk7XG4gICAgICAgIGZyb250V2FsbEJvZHkucG9zaXRpb24uc2V0KGZyb250V2FsbE1lc2gucG9zaXRpb24ueCwgZnJvbnRXYWxsTWVzaC5wb3NpdGlvbi55LCBmcm9udFdhbGxNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoZnJvbnRXYWxsQm9keSk7XG5cbiAgICAgICAgLy8g6IOM6Z2i44Gu5aOBXG4gICAgICAgIGNvbnN0IGJhY2tXYWxsR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2FsbExlbmd0aCwgd2FsbEhlaWdodCwgd2FsbFRoaWNrbmVzcyk7XG4gICAgICAgIGNvbnN0IGJhY2tXYWxsTWVzaCA9IG5ldyBUSFJFRS5NZXNoKGJhY2tXYWxsR2VvbWV0cnksIHdhbGxNYXRlcmlhbCk7XG4gICAgICAgIGJhY2tXYWxsTWVzaC5wb3NpdGlvbi5zZXQoMCwgd2FsbEhlaWdodCAvIDIsIHdhbGxMZW5ndGggLyAyKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoYmFja1dhbGxNZXNoKTtcblxuICAgICAgICBjb25zdCBiYWNrV2FsbFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHdhbGxMZW5ndGggLyAyLCB3YWxsSGVpZ2h0IC8gMiwgd2FsbFRoaWNrbmVzcyAvIDIpKTtcbiAgICAgICAgY29uc3QgYmFja1dhbGxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgYmFja1dhbGxCb2R5LmFkZFNoYXBlKGJhY2tXYWxsU2hhcGUpO1xuICAgICAgICBiYWNrV2FsbEJvZHkucG9zaXRpb24uc2V0KGJhY2tXYWxsTWVzaC5wb3NpdGlvbi54LCBiYWNrV2FsbE1lc2gucG9zaXRpb24ueSwgYmFja1dhbGxNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkoYmFja1dhbGxCb2R5KTtcblxuICAgICAgICAvLyDlt6blgbTjga7lo4FcbiAgICAgICAgY29uc3QgbGVmdFdhbGxHZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hHZW9tZXRyeSh3YWxsVGhpY2tuZXNzLCB3YWxsSGVpZ2h0LCB3YWxsTGVuZ3RoKTtcbiAgICAgICAgY29uc3QgbGVmdFdhbGxNZXNoID0gbmV3IFRIUkVFLk1lc2gobGVmdFdhbGxHZW9tZXRyeSwgd2FsbE1hdGVyaWFsKTtcbiAgICAgICAgbGVmdFdhbGxNZXNoLnBvc2l0aW9uLnNldCgtd2FsbExlbmd0aCAvIDIsIHdhbGxIZWlnaHQgLyAyLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQobGVmdFdhbGxNZXNoKTtcblxuICAgICAgICBjb25zdCBsZWZ0V2FsbFNoYXBlID0gbmV3IENBTk5PTi5Cb3gobmV3IENBTk5PTi5WZWMzKHdhbGxUaGlja25lc3MgLyAyLCB3YWxsSGVpZ2h0IC8gMiwgd2FsbExlbmd0aCAvIDIpKTtcbiAgICAgICAgY29uc3QgbGVmdFdhbGxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgbGVmdFdhbGxCb2R5LmFkZFNoYXBlKGxlZnRXYWxsU2hhcGUpO1xuICAgICAgICBsZWZ0V2FsbEJvZHkucG9zaXRpb24uc2V0KGxlZnRXYWxsTWVzaC5wb3NpdGlvbi54LCBsZWZ0V2FsbE1lc2gucG9zaXRpb24ueSwgbGVmdFdhbGxNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkobGVmdFdhbGxCb2R5KTtcblxuICAgICAgICAvLyDlj7PlgbTjga7lo4FcbiAgICAgICAgY29uc3QgcmlnaHRXYWxsR2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkod2FsbFRoaWNrbmVzcywgd2FsbEhlaWdodCwgd2FsbExlbmd0aCk7XG4gICAgICAgIGNvbnN0IHJpZ2h0V2FsbE1lc2ggPSBuZXcgVEhSRUUuTWVzaChyaWdodFdhbGxHZW9tZXRyeSwgd2FsbE1hdGVyaWFsKTtcbiAgICAgICAgcmlnaHRXYWxsTWVzaC5wb3NpdGlvbi5zZXQod2FsbExlbmd0aCAvIDIsIHdhbGxIZWlnaHQgLyAyLCAwKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocmlnaHRXYWxsTWVzaCk7XG5cbiAgICAgICAgY29uc3QgcmlnaHRXYWxsU2hhcGUgPSBuZXcgQ0FOTk9OLkJveChuZXcgQ0FOTk9OLlZlYzMod2FsbFRoaWNrbmVzcyAvIDIsIHdhbGxIZWlnaHQgLyAyLCB3YWxsTGVuZ3RoIC8gMikpO1xuICAgICAgICBjb25zdCByaWdodFdhbGxCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KTtcbiAgICAgICAgcmlnaHRXYWxsQm9keS5hZGRTaGFwZShyaWdodFdhbGxTaGFwZSk7XG4gICAgICAgIHJpZ2h0V2FsbEJvZHkucG9zaXRpb24uc2V0KHJpZ2h0V2FsbE1lc2gucG9zaXRpb24ueCwgcmlnaHRXYWxsTWVzaC5wb3NpdGlvbi55LCByaWdodFdhbGxNZXNoLnBvc2l0aW9uLnopO1xuICAgICAgICB0aGlzLndvcmxkLmFkZEJvZHkocmlnaHRXYWxsQm9keSk7XG5cbiAgICAgICAgLy8g5Zyw6Z2iXG4gICAgICAgIGNvbnN0IHBob25nTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHgwMGFhYWEgfSk7XG4gICAgICAgIGNvbnN0IHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyMCwgMjApO1xuICAgICAgICBjb25zdCBwbGFuZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBwaG9uZ01hdGVyaWFsKTtcbiAgICAgICAgcGxhbmVNZXNoLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlOyAvLyDkuKHpnaJcbiAgICAgICAgcGxhbmVNZXNoLnJvdGF0ZVgoLU1hdGguUEkgLyAyKTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQocGxhbmVNZXNoKTtcblxuICAgICAgICBjb25zdCBwbGFuZVNoYXBlID0gbmV3IENBTk5PTi5QbGFuZSgpO1xuICAgICAgICBjb25zdCBwbGFuZUJvZHkgPSBuZXcgQ0FOTk9OLkJvZHkoeyBtYXNzOiAwIH0pO1xuICAgICAgICBwbGFuZUJvZHkuYWRkU2hhcGUocGxhbmVTaGFwZSk7XG4gICAgICAgIHBsYW5lQm9keS5wb3NpdGlvbi5zZXQocGxhbmVNZXNoLnBvc2l0aW9uLngsIHBsYW5lTWVzaC5wb3NpdGlvbi55LCBwbGFuZU1lc2gucG9zaXRpb24ueik7XG4gICAgICAgIHBsYW5lQm9keS5xdWF0ZXJuaW9uLnNldChwbGFuZU1lc2gucXVhdGVybmlvbi54LCBwbGFuZU1lc2gucXVhdGVybmlvbi55LCBwbGFuZU1lc2gucXVhdGVybmlvbi56LCBwbGFuZU1lc2gucXVhdGVybmlvbi53KTtcbiAgICAgICAgdGhpcy53b3JsZC5hZGRCb2R5KHBsYW5lQm9keSk7XG4gICAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiByZWFkRmlsZShwYXRoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUgPT4ge1xuICAgICAgICBjb25zdCBsb2FkZXIgPSBuZXcgVEhSRUUuRmlsZUxvYWRlcigpO1xuICAgICAgICBsb2FkZXIubG9hZChwYXRoLCAoZGF0YSkgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBkYXRhID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkYXRhKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWNvZGVkU3RyaW5nID0gZGVjb2Rlci5kZWNvZGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkZWNvZGVkU3RyaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9KSk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBpbml0KTtcblxuZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBsZXQgY29udGFpbmVyID0gbmV3IFRocmVlSlNDb250YWluZXIoKTtcblxuICAgIGxldCB2aWV3cG9ydCA9IGNvbnRhaW5lci5jcmVhdGVSZW5kZXJlckRPTSg2NDAsIDQ4MCwgbmV3IFRIUkVFLlZlY3RvcjMoLTEwLCAzMCwgMTApKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHZpZXdwb3J0KTtcbn1cbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwidmFyIGRlZmVycmVkID0gW107XG5fX3dlYnBhY2tfcmVxdWlyZV9fLk8gPSAocmVzdWx0LCBjaHVua0lkcywgZm4sIHByaW9yaXR5KSA9PiB7XG5cdGlmKGNodW5rSWRzKSB7XG5cdFx0cHJpb3JpdHkgPSBwcmlvcml0eSB8fCAwO1xuXHRcdGZvcih2YXIgaSA9IGRlZmVycmVkLmxlbmd0aDsgaSA+IDAgJiYgZGVmZXJyZWRbaSAtIDFdWzJdID4gcHJpb3JpdHk7IGktLSkgZGVmZXJyZWRbaV0gPSBkZWZlcnJlZFtpIC0gMV07XG5cdFx0ZGVmZXJyZWRbaV0gPSBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV07XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBub3RGdWxmaWxsZWQgPSBJbmZpbml0eTtcblx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBbY2h1bmtJZHMsIGZuLCBwcmlvcml0eV0gPSBkZWZlcnJlZFtpXTtcblx0XHR2YXIgZnVsZmlsbGVkID0gdHJ1ZTtcblx0XHRmb3IgKHZhciBqID0gMDsgaiA8IGNodW5rSWRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAoKHByaW9yaXR5ICYgMSA9PT0gMCB8fCBub3RGdWxmaWxsZWQgPj0gcHJpb3JpdHkpICYmIE9iamVjdC5rZXlzKF9fd2VicGFja19yZXF1aXJlX18uTykuZXZlcnkoKGtleSkgPT4gKF9fd2VicGFja19yZXF1aXJlX18uT1trZXldKGNodW5rSWRzW2pdKSkpKSB7XG5cdFx0XHRcdGNodW5rSWRzLnNwbGljZShqLS0sIDEpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZnVsZmlsbGVkID0gZmFsc2U7XG5cdFx0XHRcdGlmKHByaW9yaXR5IDwgbm90RnVsZmlsbGVkKSBub3RGdWxmaWxsZWQgPSBwcmlvcml0eTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZC5zcGxpY2UoaS0tLCAxKVxuXHRcdFx0dmFyIHIgPSBmbigpO1xuXHRcdFx0aWYgKHIgIT09IHVuZGVmaW5lZCkgcmVzdWx0ID0gcjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHJlc3VsdDtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuX193ZWJwYWNrX3JlcXVpcmVfXy5PLmogPSAoY2h1bmtJZCkgPT4gKGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9PT0gMCk7XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uLCBkYXRhKSA9PiB7XG5cdHZhciBbY2h1bmtJZHMsIG1vcmVNb2R1bGVzLCBydW50aW1lXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMDtcblx0aWYoY2h1bmtJZHMuc29tZSgoaWQpID0+IChpbnN0YWxsZWRDaHVua3NbaWRdICE9PSAwKSkpIHtcblx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcblx0XHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhtb3JlTW9kdWxlcywgbW9kdWxlSWQpKSB7XG5cdFx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKHJ1bnRpbWUpIHZhciByZXN1bHQgPSBydW50aW1lKF9fd2VicGFja19yZXF1aXJlX18pO1xuXHR9XG5cdGlmKHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKSBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbihkYXRhKTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF1bMF0oKTtcblx0XHR9XG5cdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcblx0fVxuXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHJlc3VsdCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rY2dwcmVuZGVyaW5nXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSB8fCBbXTtcbmNodW5rTG9hZGluZ0dsb2JhbC5mb3JFYWNoKHdlYnBhY2tKc29ucENhbGxiYWNrLmJpbmQobnVsbCwgMCkpO1xuY2h1bmtMb2FkaW5nR2xvYmFsLnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKSk7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBkZXBlbmRzIG9uIG90aGVyIGxvYWRlZCBjaHVua3MgYW5kIGV4ZWN1dGlvbiBuZWVkIHRvIGJlIGRlbGF5ZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXy5PKHVuZGVmaW5lZCwgW1widmVuZG9ycy1ub2RlX21vZHVsZXNfY2Fubm9uLWVzX2Rpc3RfY2Fubm9uLWVzX2pzLW5vZGVfbW9kdWxlc190aHJlZV9leGFtcGxlc19qc21fY29udHJvbHNfT3JiLWU1OGJkMlwiXSwgKCkgPT4gKF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9hcHAudHNcIikpKVxuX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyhfX3dlYnBhY2tfZXhwb3J0c19fKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==