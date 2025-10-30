# ASCII Video Player

This project is a web-based video player that converts MP4 videos into ASCII art in real-time. It's built with HTML, CSS, and JavaScript, and it allows users to upload their own videos and customize the ASCII output.

## Features

*   **Real-time ASCII conversion:** Videos are converted to ASCII art on the fly as they play.
*   **Dynamic Status Bar:** Provides real-time feedback on video loading, processing, and playback status, including current resolution.
*   **Customizable output:** Users can adjust the following parameters to customize the ASCII output:
    *   Zoom
    *   Resolution
    *   Brightness
    *   Contrast
    *   Font size
    *   Letter spacing
    *   Line spacing
    *   ASCII color
    *   Background color
    *   Character set
    *   **COLOR ASCII:** Toggling this option automatically sets brightness to 3.0 and contrast to 0.3 for enhanced color representation, reverting to previous values when unchecked.
*   **Playback controls:** The player includes standard playback controls like play, pause, restart, and a seek bar.
*   **Fullscreen mode:** The ASCII art can be viewed in fullscreen mode for a more immersive experience.
*   **Drag and drop file upload:** Users can drag and drop MP4 files to upload them.
*   **Keyboard shortcuts:** The player supports keyboard shortcuts for common actions.

## How to Use

1.  Clone or download the repository.
2.  Open the `ascii.html` file in a web browser.
3.  Click the "UPLOAD VIDEO" button to select an MP4 file, or drag and drop a file onto the upload area.
4.  The video will start playing automatically, and the ASCII art will be displayed in the preview area.
5.  Use the controls in the settings panel to customize the ASCII output.

## Technologies Used

*   **HTML5:** The structure of the web page is built with HTML5.
*   **CSS3:** The styling of the web page is done with CSS3, including a "hacker" theme with a matrix rain effect.
*   **JavaScript:** The functionality of the ASCII video player is implemented with JavaScript. The script handles video processing, ASCII conversion, and user interactions.

## ASCII Conversion Methodology

The ASCII conversion process works as follows:

1.  The video is loaded into an HTML5 `<video>` element.
2.  For each frame of the video, the frame is drawn onto an offscreen `<canvas>` element.
3.  The image data of the canvas is then processed to determine the brightness of each pixel.
4.  The brightness of each pixel is mapped to a character in a character set. The character set can be customized by the user.
5.  The resulting ASCII characters are then displayed in the preview area.

## Test Video

A test video is included in the repository. You can play it by clicking the "PLAY HACKERS CLIP" button, which loads "Hackers (1995) Original Trailer.mp4".

## Deployment

Due to browser security policies (CORS), this application needs to be run from a web server. You cannot simply open the `ascii.html` file directly in your browser from your local file system.

### Local Development

For local testing, you can use Python's built-in HTTP server:

```bash
# Navigate to the project directory
cd /path/to/html5-ascii-video-player

# If you have Python 3
python3 -m http.server

# If you have Python 2
python -m SimpleHTTPServer
```

Then, open your browser and go to `http://localhost:8000/ascii.html`.

### Apache Server Deployment

When deploying to an Apache web server, you may need to set the correct file permissions. After uploading the files to your server, run the following commands:

```bash
# Set ownership to the Apache user (e.g., www-data)
chown -R www-data:www-data /path/to/your/project

# Set directory permissions
find /path/to/your/project -type d -exec chmod 755 {} \;

# Set file permissions
find /path/to/your/project -type f -exec chmod 644 {} \;
```

## Author

*   **Website:** [https://www.brainphreak.net](https://www.brainphreak.net)
