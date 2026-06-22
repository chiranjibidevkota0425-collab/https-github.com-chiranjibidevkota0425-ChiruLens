// Get DOM elements
const uploadInput = document.getElementById('upload');
const previewImage = document.getElementById('previewImage');
const brightnessSlider = document.getElementById('brightness');
const contrastSlider = document.getElementById('contrast');
const saturationSlider = document.getElementById('saturation');
const blurSlider = document.getElementById('blur');
const rotateSlider = document.getElementById('rotate');
const resetBtn = document.getElementById('resetBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Store original image data
let originalImageSrc = '';
let currentFilters = {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    rotate: 0
};

// Create hidden canvas for image manipulation
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Handle file upload
document.querySelector('.upload-box').addEventListener('click', () => {
    uploadInput.click();
});

uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            originalImageSrc = event.target.result;
            previewImage.src = originalImageSrc;
            previewImage.onload = () => {
                updatePreview();
            };
        };
        reader.readAsDataURL(file);
    }
});

// Update preview with all filters applied
function updatePreview() {
    const brightness = brightnessSlider.value;
    const contrast = contrastSlider.value;
    const saturation = saturationSlider.value;
    const blur = blurSlider.value;
    const rotate = rotateSlider.value;

    // Store current values
    currentFilters = {
        brightness: parseInt(brightness),
        contrast: parseInt(contrast),
        saturation: parseInt(saturation),
        blur: parseInt(blur),
        rotate: parseInt(rotate)
    };

    // Apply CSS filters
    let filterString = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        blur(${blur}px)
        rotate(${rotate}deg)
    `;

    previewImage.style.filter = filterString;
}

// Event listeners for sliders
brightnessSlider.addEventListener('input', updatePreview);
contrastSlider.addEventListener('input', updatePreview);
saturationSlider.addEventListener('input', updatePreview);
blurSlider.addEventListener('input', updatePreview);
rotateSlider.addEventListener('input', updatePreview);

// Reset all filters
resetBtn.addEventListener('click', () => {
    brightnessSlider.value = 100;
    contrastSlider.value = 100;
    saturationSlider.value = 100;
    blurSlider.value = 0;
    rotateSlider.value = 0;
    updatePreview();
});

// Download edited image
downloadBtn.addEventListener('click', () => {
    if (!originalImageSrc) {
        alert('Please upload an image first!');
        return;
    }

    const img = new Image();
    img.onload = () => {
        // Set canvas size
        canvas.width = img.width;
        canvas.height = img.height;

        // Save context state
        ctx.save();

        // Move to center for rotation
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((currentFilters.rotate * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Apply filters via canvas
        ctx.filter = `
            brightness(${currentFilters.brightness}%)
            contrast(${currentFilters.contrast}%)
            saturate(${currentFilters.saturation}%)
            blur(${currentFilters.blur}px)
        `;

        // Draw image
        ctx.drawImage(img, 0, 0);
        ctx.restore();

        // Download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'chirulens-edited-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 'image/png');
    };
    img.src = originalImageSrc;
});

// Optional: Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        // Press 'R' to reset
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            resetBtn.click();
        }
    }
});

// Initialize
console.log('ChiruLens Photo Editor loaded successfully!');
