<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Typewriting Effect</title>
<style>
  .typewriter h1 {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    border-right: 4px solid;
    font-family: Arial, sans-serif;
    font-size: 2.5em;
    animation: typing 3s steps(30, end), blink-caret 0.5s step-end infinite;
  }

  @keyframes typing {
    from { width: 0; }
    to { width: 100%; }
  }

  @keyframes blink-caret {
    50% { border-color: transparent; }
  }
</style>
</head>
<body>

<div class="typewriter">
  <h1>Marton Lederer</h1>
</div>

</body>
</html>
