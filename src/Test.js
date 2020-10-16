import React, { useRef, useState } from "react";
import "./test.css";
// import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import Webcam from "react-webcam";
import { drawKeypoints, drawSkeleton } from "./utilities";

const Test = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [leftEye, setLeftEye] = useState(0);
  const [rightEye, setRightEye] = useState(0);

  const drawCanvas = (pose, video, videoWidth, videoHeight, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = videoWidth;
    canvas.current.height = videoHeight;

    drawKeypoints(pose["keypoints"], 0.6, ctx);
    drawSkeleton(pose["keypoints"], 0.7, ctx);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Make Detections
      const pose = await net.estimateSinglePose(video);
      console.log(pose.keypoints[1].position.y);
      if (pose.keypoints[1].position.y >= 300) {
        const poops = setInterval(() => {
          const status = document.getElementById("isBang");
          if (status) {
            status.innerText = "banged";
            clearInterval(poops);
          }
        }, 100);
      }
      drawCanvas(pose, video, videoWidth, videoHeight, canvasRef);
    }
  };

  const runPosenet = async () => {
    const net = await posenet.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8,
    });
    //
    setInterval(() => {
      detect(net);
    }, 100);
  };

  runPosenet();

  return (
    <div className="App-header">
      <Webcam ref={webcamRef} className="cam-style" />

      <canvas ref={canvasRef} className="cam-style" />

      <div className="data">
        <div className="data_number" id="isBang"></div>
        <div className="data_number">RIGHT EYE : {rightEye}</div>
      </div>
    </div>
  );
};

export default Test;
