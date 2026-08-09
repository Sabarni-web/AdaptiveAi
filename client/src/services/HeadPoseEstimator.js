import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';
import * as tf from '@tensorflow/tfjs';
import '@mediapipe/face_mesh';

class HeadPoseEstimator {
  constructor() {
    this.model = null;
  }

  async loadModel() {
    if (!this.model) {
      await tf.ready();
      this.model = await faceLandmarksDetection.createDetector(
        faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh,
        {
          runtime: 'tfjs',
          refineLandmarks: true,
          maxFaces: 1,
        }
      );
    }
    return this.model;
  }

  async estimatePose(videoElement) {
    if (!this.model) return null;

    const predictions = await this.model.estimateFaces(videoElement, { flipHorizontal: false });

    if (predictions.length > 0) {
      const keypoints = predictions[0].keypoints;
      return this.calculatePose(keypoints);
    }

    return null;
  }

  calculatePose(keypoints) {
    // 2D approximation of 3D head pose using specific face landmarks.
    // MediaPipe face mesh provides x, y, z for 468 points.
    
    // Landmark indices based on MediaPipe Face Mesh
    const NOSE_TIP = keypoints[1];
    const LEFT_EYE = keypoints[33]; // Left eye outer corner
    const RIGHT_EYE = keypoints[263]; // Right eye outer corner
    const CHIN = keypoints[152]; // Bottom of the chin

    if (!NOSE_TIP || !LEFT_EYE || !RIGHT_EYE || !CHIN) return null;

    // Calculate Yaw (Left/Right)
    // Compare distance from nose to left eye vs nose to right eye in 3D
    const distNoseLeftX = NOSE_TIP.x - LEFT_EYE.x;
    const distNoseRightX = RIGHT_EYE.x - NOSE_TIP.x;
    const yaw = (distNoseLeftX - distNoseRightX) / (distNoseLeftX + distNoseRightX);
    
    // Calculate Pitch (Up/Down)
    // Compare nose-to-eyes vs nose-to-chin ratio
    const eyeCenterY = (LEFT_EYE.y + RIGHT_EYE.y) / 2;
    const distNoseEyeY = NOSE_TIP.y - eyeCenterY;
    const distNoseChinY = CHIN.y - NOSE_TIP.y;
    // Base ratio is approx 0.8 when looking forward. 
    // Higher ratio means looking down. Lower means looking up.
    const pitch = distNoseEyeY / distNoseChinY;

    // Calculate Roll (Tilt left/right)
    const dX = RIGHT_EYE.x - LEFT_EYE.x;
    const dY = RIGHT_EYE.y - LEFT_EYE.y;
    const roll = Math.atan2(dY, dX) * (180 / Math.PI);

    let direction = 'FORWARD';

    // Thresholds (tune based on testing)
    const YAW_THRESHOLD = 0.2;
    const PITCH_UP_THRESHOLD = 0.55; 
    const PITCH_DOWN_THRESHOLD = 1.0;

    if (yaw > YAW_THRESHOLD) {
      direction = 'LEFT'; // Assuming mirrored video: left side of screen
    } else if (yaw < -YAW_THRESHOLD) {
      direction = 'RIGHT';
    } else if (pitch < PITCH_UP_THRESHOLD) {
      direction = 'UP';
    } else if (pitch > PITCH_DOWN_THRESHOLD) {
      direction = 'DOWN';
    }

    return {
      yaw,
      pitch,
      roll,
      direction,
      keypoints
    };
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

export const headPoseEstimator = new HeadPoseEstimator();
