// Matrix rain effect
        document.addEventListener('DOMContentLoaded', function() {
            const matrixRain = document.getElementById('matrixRain');
            const canvas = document.createElement('canvas');
            matrixRain.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            
            const chars = "01010101010101010101ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
            const charArray = chars.split("");
            const fontSize = 14;
            const columns = canvas.width / fontSize;
            const drops = [];
            
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            
            function drawMatrix() {
                ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = "#0F0";
                ctx.font = fontSize + "px courier";
                
                for (let i = 0; i < drops.length; i++) {
                    const text = charArray[Math.floor(Math.random() * charArray.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    
                    drops[i]++;
                }
            }
            
            setInterval(drawMatrix, 35);
            
            // Handle window resize
            window.addEventListener('resize', function() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        });

        // ASCII Video Player Script
        document.addEventListener('DOMContentLoaded', function() {
            // DOM elements
            const fileInput = document.getElementById('file-input');
            const uploadArea = document.getElementById('upload-area');
            const uploadBtn = document.getElementById('upload-btn');
            const asciiArt = document.getElementById('ascii-art');
            const asciiWrapper = document.getElementById('ascii-wrapper');
            const asciiContainer = document.getElementById('ascii-container');
            const originalVideo = document.getElementById('original-video');
            const playBtn = document.getElementById('play-btn');
            const pauseBtn = document.getElementById('pause-btn');
            const restartBtn = document.getElementById('restart-btn');
            const fullscreenBtn = document.getElementById('fullscreen-btn');
            const fullscreenExitBtn = document.getElementById('fullscreen-exit-btn');
            const fullscreenControls = document.getElementById('fullscreen-controls');
            const seekSlider = document.getElementById('seek-slider');
            const timeDisplay = document.getElementById('time-display');
            const zoomSlider = document.getElementById('zoom-slider');
            const zoomValue = document.getElementById('zoom-value');
            const resolutionSlider = document.getElementById('resolution-slider');
            const resolutionValue = document.getElementById('resolution-value');
            const brightnessSlider = document.getElementById('brightness-slider');
            const brightnessValue = document.getElementById('brightness-value');
            const contrastSlider = document.getElementById('contrast-slider');
            const contrastValue = document.getElementById('contrast-value');
            const fontSizeSlider = document.getElementById('font-size');
            const fontSizeValue = document.getElementById('font-size-value');
            const letterSpacingSlider = document.getElementById('letter-spacing');
            const letterSpacingValue = document.getElementById('letter-spacing-value');
            const lineSpacingSlider = document.getElementById('line-spacing');
            const lineSpacingValue = document.getElementById('line-spacing-value');
            const asciiColor = document.getElementById('ascii-color');
            const bgColor = document.getElementById('bg-color');
            const colorAsciiToggle = document.getElementById('color-ascii');
            const fontFamily = document.getElementById('font-family');
            const fontWeight = document.getElementById('font-weight');
            const charSet = document.getElementById('char-set');
            const customChars = document.getElementById('custom-chars');
            const customCharsGroup = document.getElementById('custom-chars-group');
            const infoPanel = document.getElementById('info-panel');
            const loading = document.getElementById('loading');
            const playTestVideoBtn = document.getElementById('play-test-video');
            const statusMessage = document.getElementById('status-message');
            const resolutionDisplay = document.getElementById('resolution-display');
            
            // Character sets
            const charSets = {
                default: ' .:-=+*#%@',
                simple: ' .:ioVM',
                blocks: '░▒▓█',
                detailed: '·:!7?%$#@',
                minimal: '·+*#',
                inverted: '@%#*+=-:.',
                extended: '¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ',
                custom: customChars.value
            };
            
            // Video processing variables
            let video = null;
            let canvas = null;
            let ctx = null;
            let isPlaying = false;
            let frameRequestId = null;
            let resolution = parseInt(resolutionSlider.value);
            let brightness = parseFloat(brightnessSlider.value);
            let contrast = parseFloat(contrastSlider.value);
            let previousBrightness = brightness; // Store initial brightness
            let previousContrast = contrast;     // Store initial contrast
            let currentCharSet = charSets.default;
            let fontSize = parseFloat(fontSizeSlider.value);
            let letterSpacing = parseFloat(letterSpacingSlider.value);
            let lineSpacing = parseFloat(lineSpacingSlider.value);
            let useColorAscii = false;
            let zoomLevel = parseInt(zoomSlider.value) / 100;
            let videoDuration = 0;
            let isFullscreen = false;
            let shouldPlayAudio = false;
            let processedFrameCount = 0;
            let isSeeking = false;
            let wasPlayingBeforeSeek = false;
            
            // Set up event listeners
            uploadBtn.addEventListener('click', () => {
                uploadArea.style.display = uploadArea.style.display === 'block' ? 'none' : 'block';
            });
            
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', handleDragOver);
            uploadArea.addEventListener('drop', handleDrop);
            fileInput.addEventListener('change', handleFileSelect);
            
            playBtn.addEventListener('click', playVideo);
            pauseBtn.addEventListener('click', pauseVideo);
            restartBtn.addEventListener('click', restartVideo);
            fullscreenBtn.addEventListener('click', toggleFullscreen);
            fullscreenExitBtn.addEventListener('click', exitFullscreen);
            seekSlider.addEventListener('input', seekVideo);
            
            zoomSlider.addEventListener('input', updateZoom);
            resolutionSlider.addEventListener('input', updateResolution);
            brightnessSlider.addEventListener('input', updateBrightness);
            contrastSlider.addEventListener('input', updateContrast);
            fontSizeSlider.addEventListener('input', updateFontSize);
            letterSpacingSlider.addEventListener('input', updateLetterSpacing);
            lineSpacingSlider.addEventListener('input', updateLineSpacing);
            asciiColor.addEventListener('input', updateAsciiColor);
            bgColor.addEventListener('input', updateBgColor);
            colorAsciiToggle.addEventListener('change', updateColorAscii);
            fontFamily.addEventListener('change', updateFont);
            fontWeight.addEventListener('change', updateFontWeight);
            charSet.addEventListener('change', updateCharSet);
            customChars.addEventListener('input', updateCustomChars);
            playTestVideoBtn.addEventListener('click', playTestVideo);
            
            // Keyboard shortcuts
            document.addEventListener('keydown', handleKeyPress);
            
            // Fullscreen change event
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.addEventListener('mozfullscreenchange', handleFullscreenChange);
            document.addEventListener('MSFullscreenChange', handleFullscreenChange);
            
            // Drag and drop handlers
            function handleDragOver(e) {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            }
            
            function handleDrop(e) {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                
                if (e.dataTransfer.files.length) {
                    fileInput.files = e.dataTransfer.files;
                    handleFileSelect();
                }
            }
            
            // File selection handler
            function handleFileSelect() {
                if (!fileInput.files.length) return;
                
                const file = fileInput.files[0];
                if (!file.type.includes('mp4')) {
                    alert('Please upload an MP4 video file.');
                    return;
                }
                
                uploadArea.style.display = 'none';
                loading.style.display = 'block';
                asciiArt.textContent = 'Processing video...';
                statusMessage.textContent = 'STATUS: LOADING VIDEO';
                
                const videoUrl = URL.createObjectURL(file);
                loadVideo(videoUrl, file.name, file.size);
            }
            
            // Play test video
            function playTestVideo(e) {
                e.preventDefault();
                console.log('playTestVideo called');
                shouldPlayAudio = true;
                processedFrameCount = 0;
                originalVideo.muted = true;
                loading.style.display = 'block';
                asciiArt.textContent = 'Loading test video...';
                statusMessage.textContent = 'STATUS: LOADING TEST VIDEO';
                loadVideo('./Hackers (1995) Original Trailer.mp4', 'Hackers (1995) Original Trailer.mp4', 0);
            }
            
            // Common video loading function
            function loadVideo(videoUrl, fileName, fileSize) {
                console.log('loadVideo called with:', videoUrl, fileName, fileSize);
                // Reset the video element
                originalVideo.src = videoUrl;
                originalVideo.load();
                
                // Wait for video metadata to load
                originalVideo.addEventListener('loadedmetadata', function() {
                    console.log('loadedmetadata event fired');
                    videoDuration = originalVideo.duration;
                    seekSlider.max = Math.floor(videoDuration);
                    updateTimeDisplay(0, videoDuration);
                    seekSlider.disabled = false;
                    
                    initVideoProcessing();
                    loading.style.display = 'none';
                    statusMessage.textContent = 'STATUS: READY';
                    resolutionDisplay.textContent = `RESOLUTION: ${resolution}`;
                    
                    // Update info panel
                    const sizeInfo = fileSize > 0 ? ` | Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB` : '';
                    infoPanel.textContent = `Video: ${fileName}${sizeInfo} | Duration: ${formatTime(originalVideo.duration)}`;
                    
                    // Enable controls
                    playBtn.disabled = false;
                    pauseBtn.disabled = false;
                    restartBtn.disabled = false;
                    fullscreenBtn.disabled = false;
                    
                    // Auto-play the video
                    setTimeout(() => {
                        playVideo();
                    }, 500);
                });
                
                originalVideo.addEventListener('error', function(e) {
                    console.error('Video loading error:', fileName, e);
                    loading.style.display = 'none';
                    asciiArt.textContent = `Error loading video: ${fileName}.`;
                    infoPanel.textContent = `Failed to load: ${fileName}`;
                    statusMessage.textContent = 'STATUS: ERROR';
                });
                
                // Update seek bar during playback
                originalVideo.addEventListener('timeupdate', function() {
                    if (!isNaN(originalVideo.duration)) {
                        seekSlider.value = originalVideo.currentTime;
                        updateTimeDisplay(originalVideo.currentTime, originalVideo.duration);
                    }
                });
                
                // Reset audio when video ends
                originalVideo.addEventListener('ended', function() {
                    // Reset audio by reloading the video element
                    originalVideo.currentTime = 0;
                    originalVideo.load();
                    statusMessage.textContent = 'STATUS: ENDED';
                });

                // Handle seeking
                originalVideo.addEventListener('seeked', function() {
                    if (isSeeking) {
                        isSeeking = false;
                        if (wasPlayingBeforeSeek) {
                            playVideo();
                        } else {
                            processVideoFrame(); // Render a single frame
                        }
                    }
                });
            }
            
            // Initialize video processing
            function initVideoProcessing() {
                console.log('initVideoProcessing called');
                statusMessage.textContent = 'STATUS: INITIALIZING PROCESSOR';
                // Create offscreen video element for processing
                if (video) {
                    video.pause();
                    video.src = '';
                }
                
                video = document.createElement('video');
                video.src = originalVideo.src;
                video.crossOrigin = 'anonymous';
                video.muted = true; // Mute the processing video to avoid audio duplication
                video.loop = true; // Loop the video
                
                // Create canvas for frame processing
                if (!canvas) {
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d', { willReadFrequently: true });
                }
                
                // Set canvas size to match video dimensions
                video.addEventListener('loadeddata', function() {
                    console.log('loadeddata event fired on processing video');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    statusMessage.textContent = 'STATUS: VIDEO LOADED';
                    
                    // Process first frame for preview
                    if (!isPlaying) {
                        processVideoFrame();
                    }
                });
                
                // Ensure video is ready to play
                video.addEventListener('canplay', function() {
                    console.log('canplay event fired on processing video');
                    statusMessage.textContent = 'STATUS: READY TO PLAY';
                    if (!isPlaying) {
                        processVideoFrame();
                    }
                });
                
                // Handle video errors
                video.addEventListener('error', function(e) {
                    console.error('Processing video error:', e);
                    statusMessage.textContent = 'STATUS: PROCESSING ERROR';
                });
            }
            
            // Play video
            function playVideo() {
                console.log('playVideo called');
                if (!video) return;
                
                isPlaying = true;
                video.play().catch(e => console.log('Video play error:', e));
                originalVideo.play().catch(e => console.log('Original video play error:', e));
                processVideoFrame();
                statusMessage.textContent = 'STATUS: PLAYING';
            }
            
            // Pause video
            function pauseVideo() {
                if (!video) return;
                
                isPlaying = false;
                video.pause();
                originalVideo.pause();
                
                if (frameRequestId) {
                    cancelAnimationFrame(frameRequestId);
                    frameRequestId = null;
                }
                statusMessage.textContent = 'STATUS: PAUSED';
            }
            
            // Restart video - Fixed audio issue
            function restartVideo() {
                if (!video || !originalVideo) return;
                
                // Reset both videos
                video.currentTime = 0;
                originalVideo.currentTime = 0;
                
                // Reset audio by reloading the video element
                originalVideo.load();
                
                seekSlider.value = 0;
                updateTimeDisplay(0, videoDuration);
                
                // Play immediately after reset
                setTimeout(() => {
                    playVideo();
                }, 100);
                statusMessage.textContent = 'STATUS: RESTARTING';
            }
            
            // Toggle fullscreen
            function toggleFullscreen() {
                if (!isFullscreen) {
                    enterFullscreen();
                } else {
                    exitFullscreen();
                }
            }
            
            // Enter fullscreen
            function enterFullscreen() {
                if (asciiContainer.requestFullscreen) {
                    asciiContainer.requestFullscreen();
                } else if (asciiContainer.webkitRequestFullscreen) {
                    asciiContainer.webkitRequestFullscreen();
                } else if (asciiContainer.mozRequestFullScreen) {
                    asciiContainer.mozRequestFullScreen();
                } else if (asciiContainer.msRequestFullscreen) {
                    asciiContainer.msRequestFullscreen();
                }
            }
            
            // Exit fullscreen
            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
            
            // Handle fullscreen change
            function handleFullscreenChange() {
                isFullscreen = !!(document.fullscreenElement || 
                                 document.webkitFullscreenElement || 
                                 document.mozFullScreenElement || 
                                 document.msFullscreenElement);
                
                if (isFullscreen) {
                    asciiContainer.classList.add('fullscreen');
                    fullscreenControls.classList.add('show');
                    // Adjust zoom for fullscreen
                    updateZoomForFullscreen();
                } else {
                    asciiContainer.classList.remove('fullscreen');
                    fullscreenControls.classList.remove('show');
                    // Reset zoom
                    applyZoom();
                }
            }
            
            // Adjust zoom for fullscreen
            function updateZoomForFullscreen() {
                // You can adjust this logic to optimize for fullscreen
                const fullscreenZoom = Math.min(zoomLevel * 1.5, 2); // Increase zoom but cap at 200%
                asciiArt.style.transform = `scale(${fullscreenZoom})`;
            }
            
            // Handle keyboard shortcuts
            function handleKeyPress(e) {
                if (!video) return;

                // If a text input is focused, don't trigger shortcuts
                if (document.activeElement === customChars) return;
                
                switch(e.key.toLowerCase()) {
                    case 'f':
                        if (!e.ctrlKey && !e.altKey) {
                            e.preventDefault();
                            toggleFullscreen();
                        }
                        break;
                    case 'escape':
                        if (isFullscreen) {
                            e.preventDefault();
                            exitFullscreen();
                        }
                        break;
                    case ' ':
                    case 'k':
                        e.preventDefault();
                        if (isPlaying) {
                            pauseVideo();
                        } else {
                            playVideo();
                        }
                        break;
                    case 'r':
                        if (!e.ctrlKey) {
                            e.preventDefault();
                            restartVideo();
                        }
                        break;
                    case 'arrowleft':
                        e.preventDefault();
                        seekVideoRelative(-5);
                        break;
                    case 'arrowright':
                        e.preventDefault();
                        seekVideoRelative(5);
                        break;
                }
            }
            
            // Seek video relative to current time
            function seekVideoRelative(seconds) {
                if (!video || !originalVideo) return;
                
                const newTime = Math.max(0, Math.min(videoDuration, originalVideo.currentTime + seconds));
                video.currentTime = newTime;
                originalVideo.currentTime = newTime;
                seekSlider.value = newTime;
                updateTimeDisplay(newTime, videoDuration);
            }
            
            // Seek video
            function seekVideo() {
                if (!video || !originalVideo) return;

                if (!isSeeking) {
                    wasPlayingBeforeSeek = isPlaying;
                }

                isSeeking = true;

                const seekTime = parseFloat(seekSlider.value);
                video.currentTime = seekTime;
                originalVideo.currentTime = seekTime;
                updateTimeDisplay(seekTime, videoDuration);
            }
            
            // Update time display
            function updateTimeDisplay(currentTime, duration) {
                timeDisplay.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
            }
            
            // Process each video frame
            function processVideoFrame() {
                console.log('processVideoFrame called');
                if (isSeeking) return; // Don't process frames while seeking

                if (!isPlaying || !video || video.paused || video.ended) {
                    isPlaying = false;
                    return;
                }
                
                try {
                    // Check if video is ready and has valid dimensions
                    if (video.videoWidth > 0 && video.videoHeight > 0) {
                        // Ensure canvas matches video dimensions
                        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                        }
                        
                        // Draw current video frame to canvas
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                        // Increment processed frame count
                        processedFrameCount++;

                        // Start audio after a few frames have been processed
                        if (shouldPlayAudio && processedFrameCount >= 5) { // Start audio after 5 frames
                            originalVideo.muted = false; // Ensure audio is not muted
                            originalVideo.volume = 1; // Ensure volume is up
                            originalVideo.play().catch(e => console.log('Original video play error:', e));
                            shouldPlayAudio = false; // Reset flag
                        }

                        // Synchronize offscreen video to original video's time if there's a significant drift
                        const timeDrift = originalVideo.currentTime - video.currentTime;
                        if (Math.abs(timeDrift) > 0.1) { // Resync if drift is more than 100ms
                            video.currentTime = originalVideo.currentTime;
                        }
                        
                        // Convert frame to ASCII
                        const asciiFrame = convertFrameToAscii();
                        asciiArt.innerHTML = useColorAscii ? asciiFrame : asciiFrame.replace(/<[^>]*>/g, '');
                        
                        // Apply zoom
                        if (isFullscreen) {
                            updateZoomForFullscreen();
                        } else {
                            applyZoom();
                        }
                    }
                } catch (error) {
                    console.error('Error processing video frame:', error);
                }
                
                // Continue processing frames
                frameRequestId = requestAnimationFrame(processVideoFrame);
            }
            
            // Convert canvas frame to ASCII art
            function convertFrameToAscii() {
                try {
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;
                    
                    // Calculate block size based on resolution
                    const blockSize = Math.max(1, Math.floor(canvas.width / resolution));
                    const cols = Math.floor(canvas.width / blockSize);
                    const rows = Math.floor(canvas.height / (blockSize * 2)); // Adjust for character aspect ratio
                    
                    let ascii = '';
                    
                    // Process each block
                    for (let y = 0; y < rows; y++) {
                        for (let x = 0; x < cols; x++) {
                            // Calculate block position
                            const px = x * blockSize;
                            const py = y * blockSize * 2;
                            
                            // Calculate average brightness in the block
                            let brightnessSum = 0;
                            let count = 0;
                            let rTotal = 0, gTotal = 0, bTotal = 0;
                            
                            for (let by = 0; by < blockSize && py + by < canvas.height; by++) {
                                for (let bx = 0; bx < blockSize && px + bx < canvas.width; bx++) {
                                    const idx = ((py + by) * canvas.width + (px + bx)) * 4;
                                    
                                    // Get RGB values
                                    const r = data[idx];
                                    const g = data[idx + 1];
                                    const b = data[idx + 2];
                                    
                                    // Calculate brightness (using weighted values for human perception)
                                    const pixelBrightness = (0.299 * r + 0.587 * g + 0.114 * b);
                                    
                                    brightnessSum += pixelBrightness;
                                    rTotal += r;
                                    gTotal += g;
                                    bTotal += b;
                                    count++;
                                }
                            }
                            
                            // Calculate average brightness
                            let avgBrightness = brightnessSum / count;
                            
                            // Apply contrast (non-linear adjustment)
                            avgBrightness = Math.pow(avgBrightness / 255, contrast) * 255;
                            
                            // Clamp to valid range
                            avgBrightness = Math.max(0, Math.min(255, avgBrightness));
                            
                            // Map brightness to ASCII character
                            const charIndex = Math.floor((avgBrightness / 255) * (currentCharSet.length - 1));
                            const char = currentCharSet[charIndex];
                            
                            // Add color if enabled
                            if (useColorAscii) {
                                const avgR = Math.floor(rTotal / count);
                                const avgG = Math.floor(gTotal / count);
                                const avgB = Math.floor(bTotal / count);
                                const color = `rgb(${avgR},${avgG},${avgB})`;
                                ascii += `<span style="color:${color}">${char}</span>`;
                            } else {
                                ascii += char;
                            }
                        }
                        ascii += '\n';
                    }
                    
                    return ascii;
                } catch (error) {
                    console.error('Error converting frame to ASCII:', error);
                    return 'Error processing video frame';
                }
            }
            
            // Apply zoom to ASCII art
            function applyZoom() {
                asciiArt.style.transform = `scale(${zoomLevel})`;
            }
            
            // Update zoom level
            function updateZoom() {
                zoomLevel = parseInt(zoomSlider.value) / 100;
                zoomValue.textContent = `${zoomSlider.value}%`;
                if (isFullscreen) {
                    updateZoomForFullscreen();
                } else {
                    applyZoom();
                }
            }
            
            // Update resolution
            function updateResolution() {
                resolution = parseInt(resolutionSlider.value);
                resolutionValue.textContent = resolution;
                resolutionDisplay.textContent = `RESOLUTION: ${resolution}`;
                
                // Redraw current frame if video is loaded
                if (video && !isPlaying) {
                    processVideoFrame();
                }
            }
            
                                    // Update brightness - now only affects the final output color
            
                                    function updateBrightness() {
            
                                        if (!useColorAscii) {
            
                                            previousBrightness = brightness;
            
                                        }
            
                                        brightness = parseFloat(brightnessSlider.value);
            
                                        brightnessValue.textContent = brightness.toFixed(1);
            
                        
            
                                        // Apply brightness filter to the ASCII art element
            
                                        asciiArt.style.filter = `brightness(${brightness})`;
            
                                    }
            
                        
            
                                    // Update contrast
            
                                    function updateContrast() {
            
                                        if (!useColorAscii) {
            
                                            previousContrast = contrast;
            
                                        }
            
                                        contrast = parseFloat(contrastSlider.value);
            
                                        contrastValue.textContent = contrast.toFixed(1);
            
                        
            
                                        // Redraw current frame if video is loaded
            
                                        if (video && !isPlaying) {
            
                                            processVideoFrame();
            
                                        }
            
                                    }
            
                        
            
                                    // Update color ASCII toggle
            
                                    function updateColorAscii() {
            
                                        useColorAscii = colorAsciiToggle.checked;
            
                        
            
                                        if (useColorAscii) {
            
                                            // Store current values before overriding
            
                                            previousBrightness = brightness;
            
                                            previousContrast = contrast;
            
                        
            
                                                                // Set new values for color ASCII
            
                        
            
                                                                brightnessSlider.value = 3.0;
            
                        
            
                                                                contrastSlider.value = 0.3;
            
                        
            
                                                            } else {
            
                        
            
                                                                // Revert to previous values
            
                        
            
                                                                brightnessSlider.value = previousBrightness;
            
                        
            
                                                                contrastSlider.value = previousContrast;
            
                        
            
                                                            }
            
                        
            
                                        // Update the display and apply changes
            
                                        updateBrightness();
            
                                        updateContrast();
            
                        
            
                                        // Redraw current frame if video is loaded;
            
                                        if (video && !isPlaying) {
            
                                            processVideoFrame();
            
                                        }
            
                                    }
            
                        
            
                                    // Update font size
            
                                    function updateFontSize() {
            
                                        fontSize = parseFloat(fontSizeSlider.value);
            
                                        fontSizeValue.textContent = `${fontSize}px`;
            
                                        asciiArt.style.fontSize = `${fontSize}px`;
            
                                    }
            
                        
            
                                    // Update letter spacing
            
                                    function updateLetterSpacing() {
            
                                        letterSpacing = parseFloat(letterSpacingSlider.value);
            
                                        letterSpacingValue.textContent = `${letterSpacing}px`;
            
                                        asciiArt.style.letterSpacing = `${letterSpacing}px`;
            
                                    }
            
                        
            
                                    // Update line spacing
            
                                    function updateLineSpacing() {
            
                                        lineSpacing = parseFloat(lineSpacingSlider.value);
            
                                        lineSpacingValue.textContent = lineSpacing;
            
                                        asciiArt.style.lineHeight = lineSpacing;
            
                                    }
            
                        
            
                                    // Update ASCII color
            
                                    function updateAsciiColor() {
            
                                        asciiArt.style.color = asciiColor.value;
            
                                    }
            
                        
            
                                    // Update background color
            
                                    function updateBgColor() {
            
                                        asciiContainer.style.backgroundColor = bgColor.value;
            
                                    }
            
                        
            
                                    // Update font family
            
                                    function updateFont() {
            
                                        asciiArt.style.fontFamily = fontFamily.value;
            
                                    }
            
                        
            
                                    // Update font weight
            
                                    function updateFontWeight() {
            
                                        asciiArt.style.fontWeight = fontWeight.value;
            
                                    }
            
                        
            
                                    // Update character set
            
                                    function updateCharSet() {
            
                                        const selectedSet = charSet.value.split(':')[0].trim();
            
                        
            
                                        if (selectedSet === 'custom') {
            
                                            currentCharSet = customChars.value || ' .:-=+*#%@';
            
                                            customCharsGroup.style.display = 'flex';
            
                                        } else {
            
                                            currentCharSet = charSets[selectedSet];
            
                                            customCharsGroup.style.display = 'none';
            
                                        }
            
                        
            
                                        // Redraw current frame if video is loaded
            
                                        if (video && !isPlaying) {
            
                                            processVideoFrame();
            
                                        }
            
                                    }
            
                        
            
                                    // Update custom characters
            
                                    function updateCustomChars() {
            
                                        if (charSet.value.split(':')[0].trim() === 'custom') {
            
                                            currentCharSet = customChars.value || ' .:-=+*#%@';
            
                        
            
                                            // Redraw current frame if video is loaded
            
                                            if (video && !isPlaying) {
            
                                                processVideoFrame();
            
                                            }
            
                                        }
            
                                    }
            
                        
            
                                    // Format time in seconds to MM:SS
            
                                    function formatTime(seconds) {
            
                                        const mins = Math.floor(seconds / 60);
            
                                        const secs = Math.floor(seconds % 60);
            
                                        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            
                                    }
            
                                });
            
