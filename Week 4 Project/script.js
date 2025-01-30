document.getElementById("applyFilter").addEventListener("click", () => {
    const input = document.getElementById("imageUpload");
    const canvas = document.getElementById("filteredCanvas");
    const context = canvas.getContext("2d");
    const selectedFilter = document.getElementById("filterSelect").value;

    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.onload = function () {
          if (["rotate", "flip-horizontal", "flip-vertical"].includes(selectedFilter)) {
            applyTransformFilter(context, img, selectedFilter);
          } else {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            applyFilter(context, img.width, img.height, selectedFilter);
          }
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    } else {
      alert("Please upload an image first.");
    }
  });

  function applyFilter(context, width, height, filterType) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;

    switch (filterType) {
      case "grayscale":
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }
        break;

      case "sepia":
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = 0.393 * r + 0.769 * g + 0.189 * b;
          data[i + 1] = 0.349 * r + 0.686 * g + 0.168 * b;
          data[i + 2] = 0.272 * r + 0.534 * g + 0.131 * b;
        }
        break;

      case "invert":
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i + 1] = 255 - data[i + 1];
          data[i + 2] = 255 - data[i + 2];
        }
        break;

      case "brightness":
        const brightnessValue = 40;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] + brightnessValue);
          data[i + 1] = Math.min(255, data[i + 1] + brightnessValue);
          data[i + 2] = Math.min(255, data[i + 2] + brightnessValue);
        }
        break;

      default:
        console.error("Unknown filter type");
    }

    context.putImageData(imageData, 0, 0);
  }

  function applyTransformFilter(context, img, filterType) {
    const canvas = context.canvas;
    const tempCanvas = document.createElement("canvas");
    const tempContext = tempCanvas.getContext("2d");

    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempContext.drawImage(img, 0, 0);

    switch (filterType) {
      case "rotate":
        canvas.width = img.height;
        canvas.height = img.width;
        context.translate(img.height, 0);
        context.rotate(Math.PI / 2);
        context.drawImage(tempCanvas, 0, 0);
        context.resetTransform();
        break;

      case "flip-horizontal":
        canvas.width = img.width;
        canvas.height = img.height;
        context.scale(-1, 1);
        context.drawImage(tempCanvas, -img.width, 0);
        context.resetTransform();
        break;

      case "flip-vertical":
        canvas.width = img.width;
        canvas.height = img.height;
        context.scale(1, -1);
        context.drawImage(tempCanvas, 0, -img.height);
        context.resetTransform();
        break;

      default:
        console.error("Unknown transform filter type");
    }
  }