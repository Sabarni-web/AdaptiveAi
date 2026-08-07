class MediaPipeFaceService {
  constructor() {
    this.faceDetection = null;
    this.camera = null;
    this.isInitialized = false;
    this.onResultCallback = null;
  }

  async initialize(videoElement, onResult) {
    if (this.isInitialized) return;
    
    this.onResultCallback = onResult;

    this.faceDetection = new window.FaceDetection({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`;
      }
    });

    this.faceDetection.setOptions({
      modelSelection: 0, // 0 for short-range, 1 for full-range
      minDetectionConfidence: 0.5,
    });

    this.faceDetection.onResults((results) => {
      this.handleResults(results);
    });

    try {
      await this.faceDetection.initialize();
    } catch (e) {
      console.error("Failed to initialize face detection model", e);
    }

    if (videoElement) {
      this.videoElement = videoElement;
      this.isInitialized = true; // Set to true before starting loop
      
      let isProcessing = false;
      
      // Start processing frames manually
      const processFrame = async () => {
        if (!this.isInitialized) return;
        
        if (isProcessing) {
           // Skip frame if still processing previous
           this.animationFrameId = requestAnimationFrame(processFrame);
           return;
        }

        isProcessing = true;
        try {
           if (
             this.videoElement.readyState >= 2 && 
             !this.videoElement.paused && 
             this.videoElement.videoWidth > 0 && 
             this.videoElement.videoHeight > 0
           ) {
             await this.faceDetection.send({ image: this.videoElement });
           }
        } catch (err) {
           console.error("Error processing face frame:", err);
        } finally {
           isProcessing = false;
           this.animationFrameId = requestAnimationFrame(processFrame);
        }
      };
      
      this.animationFrameId = requestAnimationFrame(processFrame);
    } else {
      this.isInitialized = true;
    }
  }

  handleResults(results) {
    console.log("[MediaPipe] onResults fired, detections:", results?.detections?.length);
    if (this.onResultCallback) {
      if (results.detections && results.detections.length > 0) {
        const detection = results.detections[0];
        const confidenceScore = detection.categories?.[0]?.score || detection.score?.[0] || 0;
        this.onResultCallback({ detected: true, confidence: confidenceScore * 100 });
      } else {
        this.onResultCallback({ detected: false, confidence: 0 });
      }
    }
  }

  stop() {
    this.isInitialized = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.faceDetection) {
      this.faceDetection.close();
      this.faceDetection = null;
    }
  }
}

export const faceService = new MediaPipeFaceService();
