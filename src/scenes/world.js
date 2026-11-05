
import * as THREE from 'three';

export function createWorld(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e9dafa');
  scene.fog = new THREE.Fog('#e9dafa', 12, 35);

  const camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 4, 12);
  camera.lookAt(0, 1, 0);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
  });

  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 1.5)
  );

  renderer.setSize(
    window.innerWidth,
    window.innerHeight
  );

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  scene.add(new THREE.HemisphereLight(
    '#fff3f8', '#8975a8', 2
  ));

  const sunlight = new THREE.DirectionalLight(
    '#fff0d5', 3
  );

  sunlight.position.set(5, 10, 6);
  sunlight.castShadow = true;
  scene.add(sunlight);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(18, 64),
    new THREE.MeshStandardMaterial({
      color: '#a9bd91',
      roughness: 1
    })
  );

  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);

  // Panda builder
  function createPanda(x, z, scale = 1) {
    const panda = new THREE.Group();

    const white = new THREE.MeshStandardMaterial({
      color: '#fffaf2',
      roughness: 0.9
    });

    const black = new THREE.MeshStandardMaterial({
      color: '#24202a',
      roughness: 0.85
    });

    function sphere(parent, material, pos, size) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 20, 16),
        material
      );

      mesh.position.set(...pos);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }

    // Body and head
    sphere(panda, white, [0, 0.9, 0], 0.58);
    sphere(panda, white, [0, 1.65, 0], 0.48);

    // Ears
    sphere(panda, black, [-0.34, 2.02, 0], 0.17);
    sphere(panda, black, [0.34, 2.02, 0], 0.17);

    // Eye patches
    sphere(panda, black, [-0.19, 1.72, 0.39], 0.14);
    sphere(panda, black, [0.19, 1.72, 0.39], 0.14);

    // Eyes
    sphere(panda, white, [-0.19, 1.72, 0.50], 0.045);
    sphere(panda, white, [0.19, 1.72, 0.50], 0.045);

    // Nose
    sphere(panda, black, [0, 1.53, 0.45], 0.065);

    // Arms
    sphere(panda, black, [-0.55, 1.02, 0], 0.18);
    sphere(panda, black, [0.55, 1.02, 0], 0.18);

    // Feet
    sphere(panda, black, [-0.3, 0.42, 0.05], 0.22);
    sphere(panda, black, [0.3, 0.42, 0.05], 0.22);

    panda.scale.setScalar(scale);
    panda.position.set(x, 0, z);

    scene.add(panda);
    return panda;
  }

  // Main panda
  const panda = createPanda(0, 0, 1.15);

  // Bamboo builder
  const bambooMaterial = new THREE.MeshStandardMaterial({
    color: '#628c52',
    roughness: 0.9
  });

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: '#91ad69'
  });

  function createBamboo(x, z, height) {
    const group = new THREE.Group();

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.09, 0.13, height, 8
      ),
      bambooMaterial
    );

    stem.position.y = height / 2;
    stem.castShadow = true;
    group.add(stem);

    for (let i = 0; i < 4; i++) {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 6),
        leafMaterial
      );

      leaf.position.set(
        i % 2 ? 0.2 : -0.2,
        height * 0.65 + i * 0.2,
        0
      );

      leaf.scale.set(1.8, 0.35, 0.6);
      group.add(leaf);
    }

    group.position.set(x, 0, z);
    scene.add(group);
  }

  for (let i = 0; i < 26; i++) {
    const angle = (i / 26) * Math.PI * 2;
    const radius = 7 + Math.random() * 3;

    createBamboo(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      3 + Math.random() * 2
    );
  }

  // Cherry blossom trees
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: '#79564d'
  });

  const blossomMaterial = new THREE.MeshStandardMaterial({
    color: '#f5b4d1',
    roughness: 1
  });

  function createTree(x, z) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.24, 2.5, 8),
      trunkMaterial
    );

    trunk.position.y = 1.25;
    tree.add(trunk);

    for (let i = 0; i < 5; i++) {
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.8, 12, 10),
        blossomMaterial
      );

      flower.position.set(
        Math.sin(i * 1.25) * 0.65,
        2.6 + Math.cos(i * 1.25) * 0.35,
        Math.cos(i * 1.25) * 0.65
      );

      tree.add(flower);
    }

    tree.position.set(x, 0, z);
    scene.add(tree);
  }

  createTree(-5, -3);
  createTree(5, -4);
  createTree(-6, 3);
  createTree(6, 3);

  // Floating magical particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = Math.random() * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
  }

  particlesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  );

  const particles = new THREE.Points(
    particlesGeometry,
    new THREE.PointsMaterial({
      color: '#fff3d9',
      size: 0.09,
      transparent: true,
      opacity: 0.8
    })
  );

  scene.add(particles);

  // Animation
  let frame;
  let running = true;

  function animate() {
    if (!running) return;

    frame = requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    panda.position.y = Math.sin(time * 1.5) * 0.06;
    panda.rotation.y = Math.sin(time * 0.35) * 0.12;

    particles.rotation.y += 0.0005;

    renderer.render(scene, camera);
  }

  animate();

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }

  window.addEventListener('resize', resize);

  return {
    scene,
    camera,
    renderer,
    destroy() {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}
