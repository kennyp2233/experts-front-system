import React, { createContext } from 'react';
import * as THREE from 'three';

export interface SceneContextProps {
  scene: THREE.Scene;
  camera: THREE.Camera;
  addUpdate: (callback: () => void) => void;
  removeUpdate: (callback: () => void) => void;
}

export const SceneContext = createContext<SceneContextProps | null>(null);
