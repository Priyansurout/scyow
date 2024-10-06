import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Connect to Socket.IO backend
const socket = io('http://localhost:4000'); // Change this to your backend address if needed

function VideoPlayer({ roomId }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [inputTime, setInputTime] = useState(''); // To capture input time
  const [player, setPlayer] = useState(null); 
  const [intervalId, setIntervalId] = useState(null); // Track the interval ID for clearing
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // Default playback speed

  useEffect(() => {
    // Load YouTube IFrame API script dynamically
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize the YouTube Player when API is ready
    let newPlayer;
    window.onYouTubeIframeAPIReady = function () {
      newPlayer = new window.YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'M7lc1UVf-VE', // Change this to the video ID you want
        playerVars: { 'playsinline': 1 },
        events: {
          'onReady': (event) => {
            setPlayer(newPlayer); // Save player instance
            setVideoDuration(newPlayer.getDuration()); // Set video duration when ready
            console.log('Player is ready');
          },
          'onStateChange': onPlayerStateChange
        }
      });
    };

    // Handle video state changes (e.g., play, pause, seek)
    function onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.PLAYING) {
        // When the video is playing, set an interval to track the current time
        const newIntervalId = setInterval(() => {
          const currentTime = newPlayer.getCurrentTime();
          setCurrentTime(currentTime);
          // Emit the current video time to sync with other users in the room
          socket.emit('syncVideo', { time: currentTime, playbackSpeed });
        }, 1000);
        setIntervalId(newIntervalId);
      } else {
        // Clear the interval when video pauses or stops
        if (intervalId) clearInterval(intervalId);
      }
    }

    // Join the specific room when component mounts
    socket.emit('joinRoom', roomId);

    // Listen for synchronization events from the server
    socket.on('syncVideo', (data) => {
      if (player) {
        player.seekTo(data.time, true); // Sync video time
        player.setPlaybackRate(data.playbackSpeed); // Sync playback speed
      }
    });


    socket.on('play', ({ time, playbackSpeed }) => {
      player.seekTo(time, true);
      player.setPlaybackRate(playbackSpeed);
      player.playVideo();
    });

    // Listen for pause event and update player
    socket.on('pause', ({ time }) => {
      player.seekTo(time, true);
      player.pauseVideo();
    });

    // Listen for mute and unmute events
    socket.on('mute', () => {
      player.mute();
    });

    socket.on('unmute', () => {
      player.unMute();
    });


    

    // Clean up when the component unmounts
    return () => {
      if (intervalId) clearInterval(intervalId); // Clear any existing intervals
      socket.off('syncVideo'); // Remove the event listener for syncing
      socket.off('play');
      socket.off('pause');
      socket.off('mute');
      socket.off('unmute');
    };
    
  }, [intervalId, player, playbackSpeed, roomId]); // Dependency array to track changes

  // Handle input change for seeking time
  const handleInputChange = (e) => {
    setInputTime(e.target.value);
  };

  // Seek to a specific time when user enters input
  const handleSeek = () => {
    const timeInSeconds = parseFloat(inputTime);
    if (player && !isNaN(timeInSeconds)) {
      player.seekTo(timeInSeconds, true); // Seek to the specified time
      socket.emit('syncVideo', { time: timeInSeconds, playbackSpeed }); // Sync with other users
    }
  };

  // Seek using slider change
  const handleSliderChange = (e) => {
    const time = parseFloat(e.target.value);
    if (player) {
      player.seekTo(time, true); // Seek to the new time
      setCurrentTime(time); // Update the current time in state
      socket.emit('syncVideo', { time, playbackSpeed }); // Sync with other users
    }
  };

  // Control play, pause, and mute
  // const handlePlay = () => player?.playVideo(); // Play video

  const handlePlay = () => {

    if (player){
      player.playVideo();
      socket.emit('play',{time: currentTime, playbackSpeed } )
    }
  };


  // const handlePause = () => player?.pauseVideo(); // Pause video
  const handlePause = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.pauseVideo();
      
      // Emit pause action to sync with other users
      socket.emit('pause', { time: currentTime });
    }
  };
  
  // const handleMute = () => player?.isMuted() ? player.unMute() : player.mute(); // Toggle mute/unmute
  const handleMute = () => {
    if (player) {
      const isMuted = player.isMuted();
      if (isMuted) {
        player.unMute();
        socket.emit('unmute');  // Emit unmute action to sync
      } else {
        player.mute();
        socket.emit('mute');  // Emit mute action to sync
      }
    }
  };

  // Handle playback speed change
  const handlePlaybackSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    setPlaybackSpeed(speed);
    if (player) {
      player.setPlaybackRate(speed); // Set playback speed
      socket.emit('syncVideo', { time: currentTime, playbackSpeed: speed }); // Sync with others
    }
  };

  return (
    <div>
      <h2>Room: {roomId}</h2>

      {/* YouTube Player */}
      <div id="player"></div>

      {/* Video progress bar */}
      <div>
        <input
          type="range"
          min="0"
          max={videoDuration}
          value={currentTime}
          onChange={handleSliderChange}
          style={{ width: '100%' }} // Full width slider
        />
        <p>
          Current Time: {currentTime.toFixed(2)} seconds / Total Duration: {videoDuration.toFixed(2)} seconds
        </p>
      </div>

      {/* Control buttons */}
      <div>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleMute}>Mute/Unmute</button>
      </div>

      {/* Playback speed control */}
      <div>
        <label htmlFor="playbackSpeed">Playback Speed: </label>
        <select id="playbackSpeed" value={playbackSpeed} onChange={handlePlaybackSpeedChange}>
          <option value={0.25}>0.25x</option>
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>

      {/* Input to seek to specific time */}
      <div>
        <input
          type="text"
          placeholder="Enter time in seconds"
          value={inputTime}
          onChange={handleInputChange}
        />
        <button onClick={handleSeek}>Go to Time</button>
      </div>
    </div>
  );
}

export default VideoPlayer;
